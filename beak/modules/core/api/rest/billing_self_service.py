"""Tenant-facing platform billing self-service endpoints."""

from __future__ import annotations

import io
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import StreamingResponse

from beak.api.deps import get_current_tenant_context, get_current_user
from beak.core.config import get_settings
from beak.core.tenant_context import TenantContext
from beak.modules.core.identity.schemas import User
from beak.modules.platform.billing.schemas import (
    BillingInvoice,
    BillingPaymentAttempt,
    BillingPaymentProof,
    BillingPaymentProofCreateResponse,
    SubscriptionResponse,
    TenantBillingOverview,
    TenantEntitlementsOut,
)
from beak.modules.platform.billing.services import PlatformBillingService

billing_self_service = APIRouter(tags=["billing-self-service"], prefix="/billing/self-service")
settings = get_settings()


def _require_platform_billing_enabled() -> None:
    if not settings.PLATFORM_BILLING_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform billing is disabled",
        )


def _tenant_slug_from_context(context: TenantContext) -> str:
    if not context.tenant_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant slug missing from request context",
        )
    return context.tenant_slug


@billing_self_service.get("/subscription", response_model=SubscriptionResponse | None)
async def self_service_subscription(
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
) -> SubscriptionResponse | None:
    """Return active subscription details for the authenticated tenant."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)
    try:
        return await PlatformBillingService().get_subscription(tenant_slug)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@billing_self_service.get("/overview", response_model=TenantBillingOverview)
async def self_service_overview(
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
) -> TenantBillingOverview:
    """Return overview snapshot (plan, MRR, aging buckets)."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)
    try:
        return await PlatformBillingService().get_overview(tenant_slug)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@billing_self_service.get("/entitlements", response_model=TenantEntitlementsOut)
async def self_service_entitlements(
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
) -> TenantEntitlementsOut:
    """Return resolved limits/features for the authenticated tenant."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)
    try:
        return await PlatformBillingService().get_tenant_entitlements(tenant_slug)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@billing_self_service.get("/invoices", response_model=list[BillingInvoice])
async def self_service_invoices(
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
) -> list[BillingInvoice]:
    """Return invoices for the authenticated tenant."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)
    try:
        return await PlatformBillingService().list_invoices(tenant_slug)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@billing_self_service.get("/payment-attempts", response_model=list[BillingPaymentAttempt])
async def self_service_payment_attempts(
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
    limit: int = Query(20, ge=1, le=100),
) -> list[BillingPaymentAttempt]:
    """Return recent payment attempt records for the tenant."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)
    try:
        return await PlatformBillingService().list_payment_attempts(tenant_slug, limit=limit)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@billing_self_service.post(
    "/invoices/{invoice_uid}/payment-proofs",
    response_model=BillingPaymentProofCreateResponse,
)
async def self_service_upload_payment_proof(
    invoice_uid: str,
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
    file: UploadFile = File(...),
    amount: Decimal | None = Form(None),
    currency: str | None = Form(None),
    payment_method: str | None = Form(None),
    payment_reference: str | None = Form(None),
    note: str | None = Form(None),
) -> BillingPaymentProofCreateResponse:
    """Upload proof of off-platform payment for a tenant invoice."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)

    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing upload filename")
    payload = await file.read()
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty upload payload")
    if len(payload) > 20 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload exceeds 20MB limit")

    try:
        return await PlatformBillingService().submit_payment_proof(
            tenant_slug=tenant_slug,
            invoice_uid=invoice_uid,
            file_bytes=payload,
            original_filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            amount=amount,
            currency=currency,
            payment_method=payment_method,
            payment_reference=payment_reference,
            note=note,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@billing_self_service.get(
    "/invoices/{invoice_uid}/payment-proofs",
    response_model=list[BillingPaymentProof],
)
async def self_service_payment_proofs(
    invoice_uid: str,
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
    limit: int = Query(100, ge=1, le=200),
) -> list[BillingPaymentProof]:
    """List tenant-uploaded proofs for one invoice."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)
    try:
        return await PlatformBillingService().list_payment_proofs(
            tenant_slug=tenant_slug,
            invoice_uid=invoice_uid,
            limit=limit,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@billing_self_service.get("/payment-proofs/{proof_uid}/download")
async def self_service_download_payment_proof(
    proof_uid: str,
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_context: Annotated[TenantContext, Depends(get_current_tenant_context)],
) -> StreamingResponse:
    """Download previously uploaded payment proof attachment."""
    _require_platform_billing_enabled()
    _ = current_user
    tenant_slug = _tenant_slug_from_context(tenant_context)
    try:
        proof, content = await PlatformBillingService().get_payment_proof_download(
            tenant_slug=tenant_slug,
            proof_uid=proof_uid,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    headers = {"Content-Disposition": f'attachment; filename="{proof.original_filename}"'}
    return StreamingResponse(
        io.BytesIO(content),
        media_type=proof.content_type,
        headers=headers,
    )
