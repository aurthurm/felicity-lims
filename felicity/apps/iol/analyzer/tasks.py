import asyncio
import traceback


class InstrumentTaskManager:
    def __init__(self):
        # instrument_uid → asyncio.Task
        self.tasks = {}

    async def start_connection(self, instrument_uid):
        """Start a connection if not already running."""
        if uid_task := self.tasks.get(instrument_uid):
            if not uid_task.done():
                print(f"[{instrument_uid}] already running.")
                return

        print(f"[{instrument_uid}] Starting connection task...")
        task = asyncio.create_task(self.run_connection(instrument_uid))
        self.tasks[instrument_uid] = task

    async def run_connection(self, instrument_uid):
        """The actual connection loop for one instrument."""
        while True:
            try:
                print(f"[{instrument_uid}] Connecting...")
                # Example: Simulate your socket link
                await self.simulate_instrument_loop(instrument_uid)
            except Exception as e:
                print(f"[{instrument_uid}] crashed: {e}")
                traceback.print_exc()
                await asyncio.sleep(5)  # wait before restarting
            else:
                print(f"[{instrument_uid}] stopped gracefully, restarting...")
                await asyncio.sleep(2)  # optional delay before reconnect

    async def simulate_instrument_loop(self, instrument_uid):
        """Placeholder for your actual I/O loop (TCP, ASTM, etc.)."""
        while True:
            print(f"[{instrument_uid}] working...")
            await asyncio.sleep(2)
            # Example random failure
            # raise RuntimeError("simulated crash")

    async def stop_connection(self, instrument_uid):
        """Cancel and stop one connection."""
        task = self.tasks.get(instrument_uid)
        if task and not task.done():
            task.cancel()
            await asyncio.gather(task, return_exceptions=True)
            print(f"[{instrument_uid}] stopped.")

    async def monitor(self):
        """Optional periodic monitor to restart crashed tasks."""
        while True:
            for uid, task in list(self.tasks.items()):
                if task.done():
                    print(f"[{uid}] restarting crashed task...")
                    await self.start_connection(uid)
            await asyncio.sleep(10)


async def main():
    manager = InstrumentTaskManager()

    # Start multiple instruments
    await manager.start_connection("ROCHE_X800")
    await manager.start_connection("SYSMEX_XN1000")

    # Optional background monitor
    asyncio.create_task(manager.monitor())

    # Keep running forever
    await asyncio.Event().wait()


if __name__ == "__main__":
    asyncio.run(main())

from fastapi import FastAPI
import asyncio

from your_module import InstrumentTaskManager  # your class from earlier

app = FastAPI()
manager = InstrumentTaskManager()


@app.on_event("startup")
async def start_instrument_manager():
    # Start instrument connections
    await manager.start_connection("ROCHE_X800")
    await manager.start_connection("SYSMEX_XN1000")

    # Launch background monitor (auto-restarts crashed tasks)
    asyncio.create_task(manager.monitor())

    print("InstrumentTaskManager started in background.")


@app.on_event("shutdown")
async def stop_instrument_manager():
    # Gracefully stop all instrument connections
    for uid in list(manager.tasks.keys()):
        await manager.stop_connection(uid)
    print("InstrumentTaskManager stopped.")


@app.get("/status")
async def status():
    return {
        uid: not task.done()
        for uid, task in manager.tasks.items()
    }
