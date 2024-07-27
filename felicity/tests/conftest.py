# import asyncio

# import pytest_asyncio


# @pytest_asyncio.fixture(scope="session")
# def event_loop():
#     """Overrides pytest default function scoped event loop"""
#     policy = asyncio.get_event_loop_policy()
#     loop = policy.new_event_loop()
#     yield loop
#     loop.close()
