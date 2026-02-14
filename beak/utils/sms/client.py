import logging
import sys
import uuid

import httpx

from beak.utils.sms.auth import TokenAuth
from beak.utils.sms.exception import ClientException
from beak.version.version import __version__

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

py_version = sys.version[:3]


class SmsClient:
    def __init__(self, url, access_token=None, **kwargs):
        self.url = url
        username = kwargs.get("username")
        password = kwargs.get("password")

        if not any((access_token, username and password)):
            self.has_auth = False
            logger.warn("SmsClient not initialised - no credentials")
            return

        self.auth = (
            TokenAuth(access_token)
            if access_token
            else httpx.BasicAuth(username, password)
        )

        self.headers = {
            "User-Agent": f"Beak-LIMS-{__version__} (Python{py_version})",
            "X-Request-Id": str(uuid.uuid4()),
            "Content-Type": "application/json",
        }

        self.timeout = kwargs.get("timeout", 5)
        self.sender = kwargs.get("sender", "Beak LIMS")

    async def send(self, to: str, message: str):
        if not self.has_auth:
            raise ClientException("Sms API Credentials are required.")

        payload = {"to": to, "message": message}
        if self.sender:
            payload["sender"] = self.sender

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.url, json=payload, headers=self.headers, auth=self.auth
                )
            # Check if the response status code indicates an error
            response.raise_for_status()
            return response.status_code, response.json()

        except httpx.HTTPStatusError as e:
            raise ClientException(
                f"SMS sending failed: {e.response.status_code} - {e.response.text}"
            )
        except Exception as e:
            raise ClientException(f"Unexpected error occurred: {str(e)}")
