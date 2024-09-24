import asyncio
import inspect
import logging
import traceback
from asyncio import create_task, gather, Lock as ALock
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
from typing import Callable, List, Dict, Any, Tuple

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

subscribers: Dict[str, List[Callable[..., Any]]] = {}
sync_lock = Lock()  # Synchronous lock
async_lock = ALock()  # Asynchronous lock


def partition_functions(
    functions: List[Callable[..., Any]],
) -> Tuple[List[Callable[..., Any]], List[Callable[..., Any]]]:
    async_funcs = [fn for fn in functions if inspect.iscoroutinefunction(fn)]
    sync_funcs = [fn for fn in functions if not inspect.iscoroutinefunction(fn)]
    return async_funcs, sync_funcs


def get_or_create_event_loop() -> asyncio.AbstractEventLoop:
    try:
        return asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        return loop


# Synchronous Event System
def subscribe(event_type: str, fn: Callable[..., Any]) -> None:
    with sync_lock:
        subscribers.setdefault(event_type, []).append(fn)


def unsubscribe(event_type: str, fn: Callable[..., Any]) -> None:
    with sync_lock:
        if event_type in subscribers:
            try:
                subscribers[event_type].remove(fn)
            except ValueError:
                logger.error(
                    f"Function not found in subscribers for event type: {event_type}\n{traceback.format_exc()}"
                )


def post_event(event_type: str, **kwargs: Any) -> None:
    with sync_lock:
        current_subscribers = subscribers.get(event_type, [])

    # Separate sync from async functions
    async_funcs, sync_funcs = partition_functions(current_subscribers)

    # Handle async functions
    loop = get_or_create_event_loop()
    for fn in async_funcs:
        if loop.is_running():
            loop.create_task(fn(**kwargs))
        else:
            asyncio.run(fn(**kwargs))

    # Handle sync functions
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(safe_execute, fn, **kwargs) for fn in sync_funcs]

        for future in as_completed(futures):
            try:
                future.result()  # Re-raise any exception from the executed function
            except Exception as e:
                logger.error(
                    f"Error executing event handler: {e}\n{traceback.format_exc()}"
                )


def safe_execute(fn: Callable[..., Any], **kwargs: Any) -> None:
    try:
        fn(**kwargs)
    except Exception as e:
        logger.error(
            f"Error in event subscriber {fn.__name__}: {e}\n{traceback.format_exc()}"
        )


# Asynchronous Event System
async def asubscribe(event_type: str, fn: Callable[..., Any]) -> None:
    async with async_lock:
        subscribers.setdefault(event_type, []).append(fn)


async def aunsubscribe(event_type: str, fn: Callable[..., Any]) -> None:
    async with async_lock:
        if event_type in subscribers:
            try:
                subscribers[event_type].remove(fn)
            except ValueError:
                logger.error(
                    f"Function not found in subscribers for event type: {event_type}\n{traceback.format_exc()}"
                )


async def apost_event(event_type: str, **kwargs: Any) -> None:
    async with async_lock:
        current_subscribers = subscribers.get(event_type, [])

    tasks = [create_task(asafe_execute(fn, **kwargs)) for fn in current_subscribers]
    await gather(*tasks)


async def asafe_execute(fn: Callable[..., Any], **kwargs: Any) -> None:
    try:
        if inspect.iscoroutinefunction(fn):
            await fn(**kwargs)
        else:
            fn(**kwargs)
    except Exception as e:
        logger.error(
            f"Error in event subscriber {fn.__name__}: {e}\n{traceback.format_exc()}"
        )
