"""
Custom WebSocket handlers for Strawberry GraphQL with authentication
"""

import logging
from typing import Dict, Optional

from jose import jwt, JWTError
from strawberry.fastapi import GraphQLRouter
from strawberry.fastapi.handlers import GraphQLTransportWSHandler, GraphQLWSHandler

from felicity.core.config import get_settings
from felicity.core.tenant_context import TenantContext, set_tenant_context

logger = logging.getLogger(__name__)
settings = get_settings()


class ConnectionRejectionError(Exception):
    def __init__(self, payload=None):
        self.payload = payload
        super().__init__("WebSocket connection rejected")


class AuthenticatedGraphQLTransportWSHandler(GraphQLTransportWSHandler):
    """
    Custom GraphQL Transport WS Handler with authentication
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._tenant_context = None

    async def handle_connection_init(self, message) -> None:
        """
        Handle connection initialization with authentication.
        This is called when the client sends a connection_init message.
        """

        # Get the payload from the connection_init message
        payload = message.payload or {}

        if not isinstance(payload, dict):
            logger.warning("No valid payload in connection_init message")
            await self.close(4401, "Authentication required")
            return

        try:
            # Extract tenant context from the payload
            tenant_context = await self._extract_websocket_context(payload)

            if not tenant_context or not tenant_context.is_authenticated:
                logger.warning("Unauthenticated WebSocket connection attempt")
                await self.close(4401, "Only accessible to authenticated users")
                return

            # Set the tenant context for this WebSocket connection
            # though not reliable
            set_tenant_context(tenant_context)

            # Also Store on instance since set_tenant_context won't be
            # shared across requests on same socket connection
            # this must survive all connections via current connection
            self._tenant_context = tenant_context

            logger.info(f"WebSocket authenticated for user: {tenant_context.user_uid}")

            # Call the parent method to complete the connection initialization
            await super().handle_connection_init(message)

        except Exception as e:
            logger.error(f"Error during WebSocket authentication: {str(e)}")
            await self.close(4500, "Authentication failed")
            return

    async def handle_request(self):
        # Set context before each operation
        if self._tenant_context:
            set_tenant_context(self._tenant_context)
        return await super().handle_request()

    async def _extract_websocket_context(self, payload: Dict) -> Optional[TenantContext]:
        """
        Extract tenant context from WebSocket connection payload.
        """

        # Initialize context
        tenant_context = TenantContext(
            request_id=f"ws_{id(self)}",
            ip_address=None,
            user_agent=None
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
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )

            # Extract user info from JWT
            tenant_context.user_uid = jwt_payload.get("sub")
            tenant_context.organization_uid = jwt_payload.get("organization_uid")

            # Extract laboratory context from token or payload
            lab_from_token = jwt_payload.get("laboratory_uid")
            lab_from_payload = payload.get("X-Laboratory-ID")

            tenant_context.laboratory_uid = lab_from_payload or lab_from_token

            logger.info(f"Extracted WebSocket context for user {tenant_context.user_uid}")
            return tenant_context

        except JWTError as e:
            logger.warning(f"Invalid JWT token in WebSocket connection: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error extracting WebSocket context: {str(e)}")
            return None


class AuthenticatedGraphQLWSHandler(GraphQLWSHandler):
    """
    Custom GraphQL WS Handler (legacy protocol) with authentication
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._tenant_context = None

    async def handle_connection_init(self, message) -> None:
        """
        Handle connection initialization for the legacy GraphQL WS protocol
        """
        payload = message.get("payload") or {}
        logger.debug(f"Legacy WebSocket connection_init received")

        if not isinstance(payload, dict):
            logger.warning("No valid payload in legacy connection_init message")
            await self.close(4401, "Authentication required")
            return

        try:
            # Use the same context extraction logic
            tenant_context = await self._extract_websocket_context(payload)

            if not tenant_context or not tenant_context.is_authenticated:
                logger.warning("Unauthenticated legacy WebSocket connection attempt")
                await self.close(4401, "Only accessible to authenticated users")
                return

            set_tenant_context(tenant_context)
            self._tenant_context = tenant_context
            logger.debug(f"Legacy WebSocket authenticated for user: {tenant_context.user_uid}")

            # Call the parent method to complete the connection initialization
            await super().handle_connection_init(message)

        except Exception as e:
            logger.error(f"Error during legacy WebSocket authentication: {str(e)}")
            await self.close(4500, "Authentication failed")
            return

    async def handle_request(self):
        # Set context before each operation
        if self._tenant_context:
            set_tenant_context(self._tenant_context)
        return await super().handle_request()

    async def _extract_websocket_context(self, payload: Dict) -> Optional[TenantContext]:
        """Same context extraction logic as the transport WS handler"""

        tenant_context = TenantContext(
            request_id=f"ws_{id(self)}",
            ip_address=None,
            user_agent=None
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

            jwt_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

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
