import httpx


async def post_data(url: str, data: dict, username: str, password: str, retries: int = 3) -> bool | None:
    auth = (username, password)

    async with httpx.AsyncClient(base_url=url, auth=auth) as client:
        for attempt in range(1, retries + 1):
            try:
                response = await client.post("", json=data)
                response.raise_for_status()
                return True
            except httpx.RequestError as exc:
                print(f"Attempt {attempt}: An error occurred while requesting {exc.request.url!r}.")
            except httpx.HTTPStatusError as exc:
                print(f"Attempt {attempt}: Error response {exc.response.status_code} while requesting {exc.request.url!r}.")

    return False
