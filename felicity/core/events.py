import logging
from asyncio import create_task, gather, Lock as ALock
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
from typing import Callable, List, Dict

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

subscribers: Dict[str, List[Callable]] = {}
lock = Lock()  # Synchronous lock
alock = ALock()  # Asynchronous lock


# Synchronous Event System
def subscribe(event_type: str, fn: Callable):
    with lock:
        if event_type not in subscribers:
            subscribers[event_type] = []
        subscribers[event_type].append(fn)


def unsubscribe(event_type: str, fn: Callable):
    with lock:
        if event_type in subscribers:
            try:
                subscribers[event_type].remove(fn)
            except ValueError:
                logger.warning(f"Function not found in subscribers for event type: {event_type}")


def post_event(event_type: str, **kwargs):
    with lock:
        if event_type not in subscribers:
            return
        current_subscribers: List[Callable] = subscribers[event_type][:]

    with ThreadPoolExecutor() as executor:
        futures = []
        for fn in current_subscribers:
            futures.append(executor.submit(safe_execute, fn, **kwargs))

        for future in as_completed(futures):
            if future.exception() is not None:
                logger.error(f"Error executing event handler: {future.exception()}")


def safe_execute(fn: Callable, **kwargs):
    try:
        fn(**kwargs)
    except Exception as e:
        logger.error(f"Error in event subscriber {fn.__name__}: {e}")


# Asynchronous Event System
async def asubscribe(event_type: str, fn: Callable):
    async with alock:
        if event_type not in subscribers:
            subscribers[event_type] = []
        subscribers[event_type].append(fn)


async def aunsubscribe(event_type: str, fn: Callable):
    async with alock:
        if event_type in subscribers:
            try:
                subscribers[event_type].remove(fn)
            except ValueError:
                logger.warning(f"Function not found in subscribers for event type: {event_type}")


async def apost_event(event_type: str, **kwargs):
    async with alock:
        if event_type not in subscribers:
            return
        current_subscribers: List[Callable] = subscribers[event_type][:]

    tasks = [create_task(asafe_execute(fn, **kwargs)) for fn in current_subscribers]
    await gather(*tasks)


async def asafe_execute(fn: Callable, **kwargs):
    try:
        if callable(fn):
            if hasattr(fn, "__await__"):  # Check if it's an async function
                await fn(**kwargs)
            else:
                fn(**kwargs)
    except Exception as e:
        logger.error(f"Error in async event subscriber {fn.__name__}: {e}")
