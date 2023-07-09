import httpx
import json




async def authenticate(username, password):
    payload = await httpx.post("http://localhost:8000/api/v1/login/access-token", data={
        "username": username,
        "password": password
    }, headers={"Content-Type": "application/json"})
    print(payload.json())
    return payload.json()

async def post_data(url: str, data: dict, username: str, password: str, retries: int = 3) -> bool | None:
    headers = {
        "Content-Type": "application/fhir+json; charset=utf-8",
    }

    # print("authenticate b4 .............")
    # authenticate(username, password)
    # print("authenticate after .............")

    async with httpx.AsyncClient(base_url=url, auth=(username, password), headers=headers) as client:
        for attempt in range(1, retries + 1):
            try:
                response = await client.post(".", json=data)
                response.raise_for_status()
                return True
            except httpx.RequestError as exc:
                print(f"Attempt {attempt}: An error occurred while requesting {exc.request.url!r}.")
            except httpx.HTTPStatusError as exc:
                print(f"Attempt {attempt}: Error response {exc.response.status_code} while requesting {exc.request.url!r}.")

    return False
