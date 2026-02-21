"""Provider adapter contract for platform billing."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class BillingProviderAdapter(ABC):
    """Defines provider-agnostic billing operations."""

    provider_name: str

    @abstractmethod
    async def create_or_sync_customer(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Create or synchronize a customer in provider."""

    @abstractmethod
    async def create_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Create provider subscription."""

    @abstractmethod
    async def change_subscription(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Mutate provider subscription."""

    @abstractmethod
    async def create_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Create provider invoice draft."""

    @abstractmethod
    async def finalize_invoice(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Finalize provider invoice."""

    @abstractmethod
    async def collect_payment(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Collect payment for invoice."""

    @abstractmethod
    def parse_webhook(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Parse provider webhook payload to normalized event."""
