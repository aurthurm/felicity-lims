import json
import time
from typing import Callable, Dict, Any, Optional

from fastapi import Request, Response
from starlette.datastructures import Headers
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from felicity.apps.app.schemas import APPActivityLogCreate
from felicity.apps.app.services import APPActivityLogService
from felicity.core.tenant_context import get_tenant_context


class APIActivityLogMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app: ASGIApp,
            auth_header: str = "Authorization",
            graphql_path: str = "/felicity-gql"
    ):
        super().__init__(app)
        self.auth_header = auth_header
        self.graphql_path = graphql_path

    async def dispatch(
            self, request: Request, call_next: Callable
    ) -> Response:
        # Store request start time
        start_time = time.time()

        # Get tenant context (set by TenantContextMiddleware)
        tenant_context = get_tenant_context()

        # Get the Bearer token from Authorization header
        auth_header = request.headers.get(self.auth_header, "")
        token = "No token found in Authorization header"

        # Extract token if it's in Bearer format
        if auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "", 1)

        # Get request body
        request_body = None
        graphql_operation: Optional[Dict[str, Any]] = None
        is_graphql = request.url.path == self.graphql_path

        try:
            request_body_bytes = await request.body()
            # Store original body for later reuse
            request._body = request_body_bytes
            if request_body_bytes:
                request_body = request_body_bytes.decode('utf-8')

                # Parse GraphQL specific data if this is a GraphQL endpoint
                if is_graphql and request.method == "POST":
                    try:
                        graphql_data = json.loads(request_body)
                        graphql_operation = {
                            "query": graphql_data.get("query", ""),
                            "operationName": graphql_data.get("operationName", ""),
                            "variables": graphql_data.get("variables", {})
                        }
                    except json.JSONDecodeError:
                        print("Failed to parse GraphQL request body as JSON")
        except Exception as e:
            print(f"Error reading request body: {e}")

        # Process the request through the application
        response = await call_next(request)

        # Calculate request duration
        duration = time.time() - start_time

        # Skip logging if response is None
        if response is None:
            print("Warning: Response is None, skipping logging")
            # Since the response is None, we need to return something to avoid the TypeError
            return Response(status_code=500, content="Internal Server Error")

        # Get response body
        response_body = None
        graphql_response = None
        original_response_body = b""

        # Create a new response to capture the response body
        try:
            # Check if response has body_iterator attribute
            if hasattr(response, 'body_iterator'):
                async for chunk in response.body_iterator:
                    original_response_body += chunk

                if original_response_body:
                    response_body = original_response_body.decode('utf-8')

                    # Parse GraphQL response if applicable
                    if is_graphql:
                        try:
                            graphql_response = json.loads(response_body)
                        except json.JSONDecodeError:
                            print("Failed to parse GraphQL response body as JSON")

                # Reconstruct the response with the captured body
                response = Response(
                    content=original_response_body,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                    media_type=response.media_type
                )
            else:
                print(f"Response does not have body_iterator attribute: {type(response)}")
        except Exception as e:
            print(f"Error reading response body: {e}")
            # In case of an error capturing the body, return the original response
            return response

        # Log the API activity
        try:
            # Build enhanced log for GraphQL
            enhanced_body = request_body
            enhanced_response = response_body

            if is_graphql and graphql_operation:
                # Check if this is an authentication operation
                operation_name = graphql_operation.get("operationName", "")
                query = graphql_operation.get("query", "")
                variables = graphql_operation.get("variables", {})

                # More detailed detection of auth requests
                is_auth_request = (
                        operation_name in ["AuthenticateUser", "Login", "SignIn"] or
                        "password" in variables or
                        "authenticateUser" in query or
                        "login" in query or
                        "signIn" in query or
                        "password" in query
                )

                # Redact sensitive information for auth requests
                if is_auth_request:
                    # Create a safe copy with redacted credentials
                    safe_variables = {}
                    for key, value in variables.items():
                        if key.lower() in ["password", "token", "secret", "key", "credential"]:
                            safe_variables[key] = "********"
                        else:
                            safe_variables[key] = value

                    # Format the GraphQL operation with redacted variables
                    enhanced_body = json.dumps({
                        "operationType": self._detect_operation_type(graphql_operation.get("query", "")),
                        "operationName": operation_name,
                        "query": "[REDACTED FOR SECURITY]",
                        "variables": safe_variables,
                        # 🆕 TENANT CONTEXT
                        "tenantContext": {
                            "user_uid": tenant_context.user_uid if tenant_context else None,
                            "laboratory_uid": tenant_context.laboratory_uid if tenant_context else None,
                            "organization_uid": tenant_context.organization_uid if tenant_context else None,
                            "request_id": tenant_context.request_id if tenant_context else None,
                        }
                    }, indent=2)
                else:
                    # Format the GraphQL operation in a more readable way for non-auth requests
                    enhanced_body = json.dumps({
                        "operationType": self._detect_operation_type(graphql_operation.get("query", "")),
                        "operationName": operation_name,
                        "query": graphql_operation.get("query", ""),
                        "variables": variables,
                        # 🆕 TENANT CONTEXT
                        "tenantContext": {
                            "user_uid": tenant_context.user_uid if tenant_context else None,
                            "laboratory_uid": tenant_context.laboratory_uid if tenant_context else None,
                            "organization_uid": tenant_context.organization_uid if tenant_context else None,
                            "request_id": tenant_context.request_id if tenant_context else None,
                        }
                    }, indent=2)

            # Process response body to redact sensitive information
            if is_graphql and enhanced_response:
                try:
                    response_json = json.loads(enhanced_response)

                    # If there's token/auth data in the response, redact it
                    if "token" in str(response_json) or "refresh" in str(response_json):
                        # Recursively redact sensitive fields
                        def redact_sensitive(obj):
                            if isinstance(obj, dict):
                                for key in list(obj.keys()):
                                    if key.lower() in ["token", "refresh", "password", "secret", "key", "credential",
                                                       "accesstoken", "refreshtoken"]:
                                        obj[key] = "[REDACTED]"
                                    else:
                                        obj[key] = redact_sensitive(obj[key])
                            elif isinstance(obj, list):
                                obj = [redact_sensitive(item) for item in obj]
                            return obj

                        redacted_response = redact_sensitive(response_json)
                        enhanced_response = json.dumps(redacted_response)
                except:
                    # If anything fails, just use the response as is
                    pass

            # Create a more detailed path for GraphQL operations
            log_path = str(request.url.path)

            # 🆕 ENHANCED PATH WITH TENANT INFO
            if tenant_context and tenant_context.laboratory_uid:
                log_path = f"[LAB:{tenant_context.laboratory_uid}] {log_path}"

            if is_graphql and graphql_operation:
                operation_name = graphql_operation.get("operationName", "")
                if operation_name:
                    log_path = f"{log_path}/{operation_name}"

            # Create a log entry in the database
            ac_in = APPActivityLogCreate(
                token_identifier=token,
                path=log_path,
                method="GraphQL" if is_graphql else request.method,
                query_params=str(request.query_params),
                # Don't log full headers as they may contain auth data
                headers=self._redact_sensitive_headers(request.headers),
                body=enhanced_body if enhanced_body else "No body",
                response_body=enhanced_response if enhanced_response else "No response body",
                response_code=int(response.status_code) if response and response.status_code else 0,
                ip_address=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent"),
                duration=duration,
                user_uid=tenant_context.user_uid if tenant_context else None,
                laboratory_uid=tenant_context.laboratory_uid if tenant_context else None,
                organization_uid=tenant_context.organization_uid if tenant_context else None,
                request_id=tenant_context.request_id if tenant_context else None,
            )
            # Add try/except specifically around the service call
            try:
                await APPActivityLogService().create(ac_in)

                # Additional tenant-aware logging
                if tenant_context:
                    print(f"📊 Activity Log - User: {tenant_context.user_uid}, "
                          f"Lab: {tenant_context.laboratory_uid}, "
                          f"Path: {log_path}, "
                          f"Status: {response.status_code}, "
                          f"Duration: {duration:.3f}s")

            except Exception as e:
                print(f"Error creating log entry: {e}")
        except Exception as e:
            print(f"Error logging API activity: {e}")

        return response

    def _detect_operation_type(self, query: str) -> str:
        """Detect the GraphQL operation type from the query string."""
        if not query:
            return "unknown"

        query = query.strip().lower()
        if query.startswith("query"):
            return "query"
        elif query.startswith("mutation"):
            return "mutation"
        elif query.startswith("subscription"):
            return "subscription"
        else:
            return "unknown"

    def _redact_sensitive_headers(self, headers: Headers) -> str:
        """Redact sensitive information from headers before logging."""
        # Make a copy of the headers to avoid modifying the original
        safe_headers = dict(headers)

        # List of headers that might contain sensitive information
        sensitive_headers = [
            "authorization", "x-api-key", "api-key", "x-auth-token",
            "cookie", "set-cookie", "jwt", "token"
        ]

        # Redact sensitive headers
        for header in sensitive_headers:
            if header in safe_headers:
                safe_headers[header] = "[REDACTED]"

        return str(safe_headers)
