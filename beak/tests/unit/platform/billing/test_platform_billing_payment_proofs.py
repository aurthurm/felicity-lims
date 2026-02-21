from __future__ import annotations

from decimal import Decimal
from typing import Any

import pytest

from beak.modules.platform.billing.services import PlatformBillingService


class _StubStorage:
    def __init__(self) -> None:
        self.objects: dict[str, bytes] = {}

    def put_object(
        self,
        *,
        object_name: str,
        data: bytes,
        **_: Any,
    ) -> None:
        self.objects[object_name] = data

    def get_object(self, *, object_names: list[str], **_: Any) -> list[bytes]:
        return [self.objects[name] for name in object_names]


class _StubRepo:
    def __init__(self) -> None:
        self.invoice = {
            "uid": "inv_1",
            "tenant_slug": "acme",
            "invoice_number": "INV-001",
            "status": "open",
            "currency": "USD",
            "subtotal": Decimal("10"),
            "tax_amount": Decimal("0"),
            "total_amount": Decimal("10"),
            "amount_due": Decimal("10"),
            "amount_paid": Decimal("0"),
            "metadata": {},
        }
        self.created_proof: dict[str, Any] | None = None

    async def ensure_tenant_exists(self, tenant_slug: str) -> bool:
        return tenant_slug == "acme"

    async def get_invoice(self, tenant_slug: str, invoice_uid: str) -> dict[str, Any] | None:
        if tenant_slug == "acme" and invoice_uid == "inv_1":
            return self.invoice
        return None

    async def create_payment_proof(self, **payload: Any) -> dict[str, Any]:
        self.created_proof = {
            "uid": "proof_1",
            "status": "submitted",
            "created_at": None,
            "updated_at": None,
            "metadata": {},
            **payload,
        }
        return self.created_proof

    async def get_payment_proof(self, *, tenant_slug: str, proof_uid: str) -> dict[str, Any] | None:
        if tenant_slug != "acme" or proof_uid != "proof_1":
            return None
        return self.created_proof

    async def update_payment_proof(
        self,
        *,
        tenant_slug: str,
        proof_uid: str,
        status: str | None = None,
        note: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, Any] | None:
        if tenant_slug != "acme" or proof_uid != "proof_1" or self.created_proof is None:
            return None
        if status is not None:
            self.created_proof["status"] = status
        if note is not None:
            self.created_proof["note"] = note
        if metadata is not None:
            self.created_proof["metadata"] = metadata
        return self.created_proof


@pytest.mark.asyncio
async def test_submit_payment_proof_uploads_and_persists() -> None:
    service = PlatformBillingService()
    repo = _StubRepo()
    storage = _StubStorage()
    service.repository = repo  # type: ignore[assignment]
    service._storage = storage  # type: ignore[attr-defined]

    result = await service.submit_payment_proof(
        tenant_slug="acme",
        invoice_uid="inv_1",
        file_bytes=b"receipt-pdf",
        original_filename="bank receipt.pdf",
        content_type="application/pdf",
        amount=Decimal("10"),
        currency="USD",
        payment_method="bank_transfer",
        payment_reference="TX-123",
        note="paid externally",
    )

    assert result.proof.uid == "proof_1"
    assert result.proof.payment_reference == "TX-123"
    assert repo.created_proof is not None
    assert repo.created_proof["object_name"] in storage.objects


@pytest.mark.asyncio
async def test_get_payment_proof_download_returns_file_bytes() -> None:
    service = PlatformBillingService()
    repo = _StubRepo()
    storage = _StubStorage()
    service.repository = repo  # type: ignore[assignment]
    service._storage = storage  # type: ignore[attr-defined]

    created = await repo.create_payment_proof(
        tenant_slug="acme",
        invoice_uid="inv_1",
        amount=Decimal("10"),
        currency="USD",
        payment_method="bank_transfer",
        payment_reference="TX-123",
        note=None,
        original_filename="proof.pdf",
        content_type="application/pdf",
        size_bytes=9,
        bucket_name="invoice",
        object_name="inv_1/proof.pdf",
        metadata={},
    )
    storage.objects[created["object_name"]] = b"pdf-bytes"

    proof, content = await service.get_payment_proof_download(
        tenant_slug="acme",
        proof_uid="proof_1",
    )

    assert proof.uid == "proof_1"
    assert content == b"pdf-bytes"


@pytest.mark.asyncio
async def test_review_payment_proof_rejects_and_updates_metadata() -> None:
    from beak.modules.platform.billing.schemas import BillingPaymentProofReviewPayload

    service = PlatformBillingService()
    repo = _StubRepo()
    storage = _StubStorage()
    service.repository = repo  # type: ignore[assignment]
    service._storage = storage  # type: ignore[attr-defined]

    await repo.create_payment_proof(
        tenant_slug="acme",
        invoice_uid="inv_1",
        amount=Decimal("10"),
        currency="USD",
        payment_method="bank_transfer",
        payment_reference="TX-123",
        note=None,
        original_filename="proof.pdf",
        content_type="application/pdf",
        size_bytes=9,
        bucket_name="invoice",
        object_name="inv_1/proof.pdf",
        metadata={},
    )
    reviewed = await service.review_payment_proof(
        tenant_slug="acme",
        proof_uid="proof_1",
        payload=BillingPaymentProofReviewPayload(status="rejected", note="invalid proof"),
        reviewed_by="billing@beak.test",
    )

    assert reviewed.status == "rejected"
    assert reviewed.metadata.get("reviewed_by") == "billing@beak.test"
