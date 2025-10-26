# Async Socket Implementation Analysis

**Date**: 2025-10-27
**Purpose**: Evaluate async socket options for replacing blocking socket library

---

## Option 1: asyncio.open_connection (Recommended)

### Pros
- ✅ Part of Python standard library
- ✅ Cleaner, more Pythonic API
- ✅ Direct replacement for socket.socket()
- ✅ Supports both TCP client and server modes
- ✅ Built-in timeout support via asyncio.wait_for()
- ✅ Integrates seamlessly with asyncio ecosystem
- ✅ Familiar to Python async developers
- ✅ No additional dependencies

### Cons
- ⚠️ Lower-level control than socket library
- ⚠️ Can't set socket options directly (less common options)

### Usage Pattern
```python
# Client
reader, writer = await asyncio.open_connection(host, port)
data = await reader.read(1024)
writer.write(data)
await writer.drain()

# Server
server = await asyncio.start_server(handler, host, port)
async with server:
    await server.serve_forever()
```

### TCP Keepalive
```python
# Get the underlying socket for keepalive
sock = writer.get_extra_info('socket')
set_keep_alive(sock, ...)  # Use existing utility
```

---

## Option 2: asyncio-socket (Third-party)

### Pros
- ✅ Drop-in replacement for socket.socket()
- ✅ Full socket API available
- ✅ Maximum compatibility

### Cons
- ❌ Additional dependency
- ❌ Less integrated with asyncio ecosystem
- ❌ Overkill for our use case

---

## Option 3: Twisted/aiohttp (Full frameworks)

### Pros
- ✅ Very mature
- ✅ Rich feature set

### Cons
- ❌ Major dependency addition
- ❌ Over-engineered for our needs
- ❌ Large learning curve
- ❌ Different paradigm than current architecture

---

## Option 4: Pure asyncio.StreamReader/StreamWriter (Current Recommendation)

This is essentially Option 1 expanded.

### Architecture
```
asyncio.open_connection()
        ↓
    StreamReader (read data)
    StreamWriter (send data)
        ↓
Underlying socket (for keepalive setup)
```

### Why This Is Best
1. **No new dependencies** - Already in Python stdlib
2. **Graceful shutdown** - Built-in context managers
3. **Timeout support** - asyncio.wait_for() for timeouts
4. **Integration** - Works with APScheduler async jobs
5. **Standard** - Most Python async code uses this

---

## Implementation Strategy

### Phase 2A: Create async conn_async.py
```python
# New file: fsocket/conn_async.py

class AsyncSocketLink(AbstractLink):
    async def start_server(self):
        # Use asyncio.start_server() for server mode
        # Use asyncio.open_connection() for client mode

    async def _handle_client(self, reader, writer):
        # Handle individual client connection

    async def process(self, data):
        # Async message processing
```

### Phase 2B: Create protocol handler modules
```python
# New file: fsocket/astm.py
class ASTMProtocolHandler:
    async def process(self, data: bytes) -> bytes:
        """Process ASTM data, return response"""

# New file: fsocket/hl7.py
class HL7ProtocolHandler:
    async def process(self, data: bytes) -> bytes:
        """Process HL7 data, return response"""
```

### Phase 2C: Keep sync conn.py for backwards compatibility
```python
# Existing file: fsocket/conn.py
# Keep as-is for:
# - Existing code that uses it
# - Gradual migration path
# - Testing/comparison
```

---

## Comparison: sync vs async socket handling

### Blocking (Current - sync)
```python
# fsocket/conn.py
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((self.host, self.port))
    s.listen(1)
    client_socket, address = s.accept()  # ❌ BLOCKS
    data = client_socket.recv(1024)       # ❌ BLOCKS
```

**Problems**:
- Can't handle multiple instruments concurrently
- Scheduler can't gracefully shutdown
- No timeout protection without complex threading

### Async (Recommended - async)
```python
# fsocket/conn_async.py
async def start_server(self):
    server = await asyncio.start_server(
        self._handle_client,
        self.host,
        self.port
    )
    async with server:
        await server.serve_forever()  # ✅ Non-blocking

async def _handle_client(self, reader, writer):
    try:
        while True:
            data = await asyncio.wait_for(
                reader.read(1024),
                timeout=self.socket_timeout
            )  # ✅ Non-blocking with timeout
            if not data:
                break
            response = await self.process(data)
            writer.write(response)
            await writer.drain()  # ✅ Proper flushing
    finally:
        writer.close()
        await writer.wait_closed()
```

**Benefits**:
- ✅ Non-blocking operation
- ✅ Handle multiple instruments simultaneously
- ✅ Graceful shutdown support
- ✅ Built-in timeout handling
- ✅ No threading complexity
- ✅ Integrates with APScheduler

---

## Migration Path

### Week 1: Create async version
1. Create `conn_async.py` with AsyncSocketLink
2. Create `astm.py` with ASTMProtocolHandler
3. Create `hl7.py` with HL7ProtocolHandler
4. Keep `conn.py` for backwards compatibility

### Week 2: Testing & Validation
1. Write async tests
2. Run side-by-side testing (sync vs async)
3. Performance comparison
4. Validate protocol handling

### Week 3: Gradual Rollout
1. Deploy async version to staging
2. Monitor for 24-48 hours
3. Switch production when confident
4. Keep sync version as fallback

### Week 4: Cleanup (optional)
1. Remove sync version if not needed
2. Clean up old code

---

## Why asyncio.open_connection() is Better Than socket

| Feature | socket | asyncio |
|---------|--------|---------|
| Non-blocking | No (requires threading) | Yes (native) |
| Multiple connections | Need thread pool | Handles seamlessly |
| Timeout handling | Complex | Built-in |
| Graceful shutdown | Difficult | Easy |
| Learning curve | Low | Medium |
| Dependencies | None | stdlib |
| Performance | Good | Better (no thread overhead) |
| Code complexity | Medium | Medium |

---

## Conclusion

**Recommendation: Use asyncio.open_connection() with asyncio.StreamReader/StreamWriter**

**Rationale**:
1. No new dependencies
2. Better performance than threaded socket
3. Cleaner code than socket library
4. Standard practice in Python async ecosystem
5. Perfect fit for APScheduler integration

**Architecture**:
- `conn_async.py`: Main async connection handler
- `astm.py`: ASTM protocol logic (extracted from conn_async)
- `hl7.py`: HL7 protocol logic (extracted from conn_async)
- `conn.py`: Keep for backwards compatibility (optional cleanup later)

---

## Next Steps

1. Create `conn_async.py` with AsyncSocketLink class
2. Extract ASTM logic to `astm.py`
3. Extract HL7 logic to `hl7.py`
4. Test thoroughly
5. Document usage and migration path

