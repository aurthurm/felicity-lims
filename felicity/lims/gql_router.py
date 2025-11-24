"""
Custom WebSocket handlers for Strawberry GraphQL with authentication
"""

import logging
from typing import Dict, Optional

from jose import jwt, JWTError
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions.protocols.graphql_transport_ws.handlers import (
    BaseGraphQLTransportWSHandler,
)
from strawberry.subscriptions.protocols.graphql_transport_ws.types import (
    ConnectionInitMessage,
)
from strawberry.subscriptions.protocols.graphql_ws.handlers import BaseGraphQLWSHandler
from strawberry.subscriptions.protocols.graphql_ws.types import (
    ConnectionInitMessage as LegacyConnectionInitMessage,
)

from felicity.core.config import get_settings
from felicity.core.tenant_context import TenantContext, set_tenant_context

logger = logging.getLogger(__name__)
settings = get_settings()

# Even if not authenticated always allow connection
ALWAYS_ALLOW_CONNECTION = False


class ConnectionRejectionError(Exception):
    def __init__(self, payload=None):
        self.payload = payload
        super().__init__("WebSocket connection rejected")


class AuthenticatedGraphQLTransportWSHandler(BaseGraphQLTransportWSHandler):
    """
    Custom GraphQL Transport WS Handler with authentication
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._tenant_context = None

    async def handle_connection_init(self, message: ConnectionInitMessage) -> None:
        """
        Handle connection initialization with authentication.
        This is called when the client sends a connection_init message.
        """

        # Get the payload from the connection_init message
        payload = message.get("payload", {})

        if not isinstance(payload, dict):
            logger.warning("No valid payload in connection_init message")
            if ALWAYS_ALLOW_CONNECTION:
                ## Accept connection anyway - let subscriptions handle auth
                await super().handle_connection_init(message)
            else:
                await self.websocket.close(code=4401, reason="Authentication required")
            return

        try:
            # Extract tenant context from the payload
            tenant_context = await self._extract_websocket_context(payload)

            if not tenant_context or not tenant_context.is_authenticated:
                logger.warning("Unauthenticated WebSocket connection attempt")
                if ALWAYS_ALLOW_CONNECTION:
                    logger.info("WebSocket connection without authentication - subscriptions will require auth")
                    # Still accept the connection, auth will be enforced at subscription level
                    await super().handle_connection_init(message)
                else:
                    await self.websocket.close(code=4401, reason="Only accessible to authenticated users")
                return

            # Set the tenant context for this WebSocket connection
            # though not reliable
            set_tenant_context(tenant_context)

            # Also Store on instance since set_tenant_context won't be
            # shared across requests on same socket connection
            # this must survive all connections via current connection
            self._tenant_context = tenant_context

            logger.info(f"WebSocket authenticated :)")

            # Call the parent method to complete the connection initialization
            await super().handle_connection_init(message)

        except Exception as e:
            logger.error(f"Error during WebSocket authentication: {str(e)}")
            if ALWAYS_ALLOW_CONNECTION:
                logger.warning(f"Error during WebSocket authentication (non-fatal): {str(e)}")
                # Still allow connection - auth enforced at subscription level
                await super().handle_connection_init(message)
            else:
                await self.websocket.close(code=4500, reason="Authentication failed")
            return

    async def handle_message(self, message) -> None:
        # Set context before each message
        if self._tenant_context:
            set_tenant_context(self._tenant_context)
        await super().handle_message(message)

    async def _extract_websocket_context(
            self, payload: Dict
    ) -> Optional[TenantContext]:
        """
        Extract tenant context from WebSocket connection payload.
        """

        # Initialize context
        tenant_context = TenantContext(
            request_id=f"ws_{id(self)}", ip_address=None, user_agent=None
        )

        try:
            # Look for JWT token in different places
            token = None

            # Method 1: From Authorization parameter
            auth_param = payload.get("Authorization")
            if auth_param and auth_param.startswith("Bearer "):
                token = auth_param.split(" ")[1]

            # Method 2: From direct token parameter
            elif "token" in payload:
                token = payload["token"]

            if not token:
                logger.warning("No authentication token found in WebSocket payload")
                return None

            # Decode JWT token
            jwt_payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )

            # Extract user info from JWT
            tenant_context.user_uid = jwt_payload.get("sub")
            tenant_context.organization_uid = jwt_payload.get("organization_uid")

            # Extract laboratory context from token or payload
            lab_from_token = jwt_payload.get("laboratory_uid")
            lab_from_payload = payload.get("X-Laboratory-ID")

            tenant_context.laboratory_uid = lab_from_payload or lab_from_token

            logger.info(f"Extracted WebSocket context :)")
            return tenant_context

        except JWTError as e:
            logger.warning(f"Invalid JWT token in WebSocket connection: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error extracting WebSocket context: {str(e)}")
            return None


class AuthenticatedGraphQLWSHandler(BaseGraphQLWSHandler):
    """
    Custom GraphQL WS Handler (legacy protocol) with authentication
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._tenant_context = None

    async def handle_connection_init(self, message: LegacyConnectionInitMessage) -> None:
        """
        Handle connection initialization for the legacy GraphQL WS protocol
        """
        payload = message.get("payload") or {}
        logger.debug("Legacy WebSocket connection_init received")

        if payload is not None and not isinstance(payload, dict):
            logger.warning("No valid payload in legacy connection_init message")
            await self.send_message({"type": "connection_error"})
            await self.websocket.close(code=1000, reason="Authentication required")
            return

        try:
            # Use the same context extraction logic
            tenant_context = await self._extract_websocket_context(payload)

            if not tenant_context or not tenant_context.is_authenticated:
                logger.warning("Unauthenticated legacy WebSocket connection attempt")
                await self.send_message({"type": "connection_error"})
                await self.websocket.close(code=1011, reason="Only accessible to authenticated users")
                return

            set_tenant_context(tenant_context)
            self._tenant_context = tenant_context
            logger.debug(
                f"Legacy WebSocket authenticated for user: {tenant_context.user_uid}"
            )

            # Call the parent method to complete the connection initialization
            await super().handle_connection_init(message)

        except Exception as e:
            logger.error(f"Error during legacy WebSocket authentication: {str(e)}")
            await self.send_message({"type": "connection_error"})
            await self.websocket.close(code=1011, reason="Authentication failed")
            return

    async def handle_message(self, message) -> None:
        # Set context before each message
        if self._tenant_context:
            set_tenant_context(self._tenant_context)
        await super().handle_message(message)

    async def _extract_websocket_context(
            self, payload: Dict
    ) -> Optional[TenantContext]:
        """Same context extraction logic as the transport WS handler"""

        tenant_context = TenantContext(
            request_id=f"ws_{id(self)}", ip_address=None, user_agent=None
        )

        try:
            token = None
            auth_param = payload.get("Authorization")
            if auth_param and auth_param.startswith("Bearer "):
                token = auth_param.split(" ")[1]
            elif "token" in payload:
                token = payload["token"]

            if not token:
                return None

            jwt_payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )

            tenant_context.user_uid = jwt_payload.get("sub")
            tenant_context.organization_uid = jwt_payload.get("organization_uid")

            lab_from_token = jwt_payload.get("laboratory_uid")
            lab_from_payload = payload.get("X-Laboratory-ID")
            tenant_context.laboratory_uid = lab_from_payload or lab_from_token

            return tenant_context

        except JWTError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Context extraction error: {str(e)}")
            return None


class FelGraphQLRouter(GraphQLRouter):
    """
    Custom GraphQL Router that uses authenticated WebSocket handlers
    """

    # Override the handler classes to use our authenticated versions
    graphql_ws_handler_class = AuthenticatedGraphQLWSHandler
    graphql_transport_ws_handler_class = AuthenticatedGraphQLTransportWSHandler
