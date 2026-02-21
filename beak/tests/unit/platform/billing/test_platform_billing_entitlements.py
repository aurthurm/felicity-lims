from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any

import pytest

from beak.modules.platform.billing.entities import (
    BillingLimitMetricKey,
)
from beak.modules.platform.billing.services import PlatformBillingService


class FakeEntitlementRepository:
    def __init__(self) -> None:
        self.tenant_exists = True
        self.subscription: dict[str, Any] | None = {
            "uid": "sub_uid_1",
            "tenant_slug": "acme",
            "plan_code": "starter",
            "status": "active",
            "base_amount": Decimal("10"),
            "usage_overage_amount": Decimal("0"),
            "mrr_snapshot": Decimal("10"),
            "metadata": {},
        }
        self.plan: dict[str, Any] | None = {
            "uid": "plan_uid_1",
            "plan_code": "starter",
            "name": "Starter",
            "active": True,
            "currency": "USD",
            "base_amount": Decimal("10"),
            "limits": [
                {
                    "metric_key": "tenant_users",
                    "limit_value": 2,
                    "window": "month",
                    "enforcement_mode": "hard_block",
                },
                {
                    "metric_key": "api_requests_tenant",
                    "limit_value": 1,
                    "window": "minute",
                    "enforcement_mode": "hard_block",
                },
            ],
            "features": [
                {"feature_key": "inventory", "enabled": True, "included_units": Decimal("0"), "unit_price": Decimal("0")},
                {"feature_key": "billing", "enabled": False, "included_units": Decimal("0"), "unit_price": Decimal("0")},
            ],
        }
        self.overrides: list[dict[str, Any]] = []
        self.user_count = 0
        self.lab_count = 0
        self.usage: dict[tuple[str, str, datetime, str | None, str | None], int] = {}

    async def ensure_tenant_exists(self, tenant_slug: str) -> bool:
        return self.tenant_exists

    async def get_subscription(self, tenant_slug: str) -> dict[str, Any] | None:
        return self.subscription

    async def get_plan_by_code(self, plan_code: str) -> dict[str, Any] | None:
        return self.plan

    async def list_tenant_overrides(self, tenant_slug: str) -> list[dict[str, Any]]:
        return self.overrides

    async def replace_tenant_overrides(
        self,
        tenant_slug: str,
        overrides: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        self.overrides = overrides
        return self.overrides

    async def list_usage_counters(self, tenant_slug: str) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for (slug, metric_key, window_start, scope_user_uid, scope_lab_uid), quantity in self.usage.items():
            if slug != tenant_slug:
                continue
            rows.append(
                {
                    "metric_key": metric_key,
                    "quantity": quantity,
                    "window_start": window_start,
                    "window_end": window_start,
                    "scope_user_uid": scope_user_uid,
                    "scope_lab_uid": scope_lab_uid,
                }
            )
        return rows

    async def count_tenant_users(self, tenant_slug: str) -> int:
        return self.user_count

    async def count_tenant_labs(self, tenant_slug: str) -> int:
        return self.lab_count

    async def get_usage_counter_value(
        self,
        *,
        tenant_slug: str,
        metric_key: str,
        window_start: datetime,
        scope_user_uid: str | None = None,
        scope_lab_uid: str | None = None,
    ) -> int:
        return self.usage.get(
            (tenant_slug, metric_key, window_start, scope_user_uid, scope_lab_uid),
            0,
        )

    async def increment_usage_counter(
        self,
        *,
        tenant_slug: str,
        metric_key: str,
        window_start: datetime,
        window_end: datetime,
        scope_user_uid: str | None = None,
        scope_lab_uid: str | None = None,
        delta: int = 1,
    ) -> None:
        key = (tenant_slug, metric_key, window_start, scope_user_uid, scope_lab_uid)
        self.usage[key] = self.usage.get(key, 0) + delta


@pytest.fixture
def entitlement_service() -> tuple[PlatformBillingService, FakeEntitlementRepository]:
    service = PlatformBillingService()
    repo = FakeEntitlementRepository()
    service.repository = repo  # type: ignore[assignment]
    return service, repo


@pytest.mark.asyncio
async def test_get_tenant_entitlements_applies_overrides(
    entitlement_service: tuple[PlatformBillingService, FakeEntitlementRepository],
) -> None:
    service, repo = entitlement_service
    repo.overrides = [
        {
            "metric_key": "tenant_users",
            "feature_key": None,
            "override_limit_value": 5,
            "override_enabled": None,
            "window": "month",
            "enforcement_mode": "hard_block",
            "metadata": {},
        },
        {
            "metric_key": None,
            "feature_key": "billing",
            "override_limit_value": None,
            "override_enabled": True,
            "window": None,
            "enforcement_mode": None,
            "metadata": {},
        },
    ]

    entitlements = await service.get_tenant_entitlements("acme")
    user_limit = next(item for item in entitlements.limits if item.metric_key == BillingLimitMetricKey.TENANT_USERS)
    billing_feature = next(item for item in entitlements.features if item.feature_key == "billing")

    assert user_limit.limit_value == 5
    assert billing_feature.enabled is True


@pytest.mark.asyncio
async def test_enforce_tenant_user_capacity_raises_when_exceeded(
    entitlement_service: tuple[PlatformBillingService, FakeEntitlementRepository],
) -> None:
    service, repo = entitlement_service
    repo.user_count = 2

    with pytest.raises(ValueError, match="CAP_LIMIT_EXCEEDED metric=tenant_users"):
        await service.enforce_tenant_user_capacity("acme")


@pytest.mark.asyncio
async def test_assert_feature_enabled_raises_when_disabled(
    entitlement_service: tuple[PlatformBillingService, FakeEntitlementRepository],
) -> None:
    service, _ = entitlement_service

    with pytest.raises(ValueError, match="FEATURE_NOT_ENTITLED feature=billing"):
        await service.assert_feature_enabled("acme", "billing")


@pytest.mark.asyncio
async def test_check_and_increment_request_limit_enforces_cap(
    entitlement_service: tuple[PlatformBillingService, FakeEntitlementRepository],
) -> None:
    service, repo = entitlement_service
    result = await service.check_and_increment_request_limit(
        tenant_slug="acme",
        metric_key=BillingLimitMetricKey.API_REQUESTS_TENANT,
    )
    assert result is not None
    assert result[0] == 1
    assert result[1] == 1

    with pytest.raises(ValueError, match="CAP_LIMIT_EXCEEDED metric=api_requests_tenant"):
        await service.check_and_increment_request_limit(
            tenant_slug="acme",
            metric_key=BillingLimitMetricKey.API_REQUESTS_TENANT,
        )

    assert any(
        key[1] == str(BillingLimitMetricKey.API_REQUESTS_TENANT)
        and quantity == 1
        for key, quantity in repo.usage.items()
    )
