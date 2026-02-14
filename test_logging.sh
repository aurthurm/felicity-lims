#!/bin/bash
set -e

echo "=== Testing Beak LIMS Logging ==="
echo ""

# Clean up
echo "1. Cleaning up old processes and log files..."
pkill -9 -f "uvicorn beak.main:beak" 2>/dev/null || true
pkill -9 -f "beak-lims server runserver" 2>/dev/null || true
sleep 2
rm -f ~/.beak-lims/logs/beak-app.log

# Test 1: pnpm server:uv
echo ""
echo "2. Testing pnpm server:uv..."
pnpm server:uv > /tmp/server1.log 2>&1 &
SERVER1_PID=$!
sleep 5

# Make a request
echo "   Making HTTP request..."
curl -s http://localhost:8000/ > /dev/null && echo "   ✓ Request completed"

# Check logs
sleep 1
echo "   Checking log file..."
if [ -f ~/.beak-lims/logs/beak-app.log ] && [ -s ~/.beak-lims/logs/beak-app.log ]; then
    echo "   ✓ Log file created and contains data"
    echo "   Log entries: $(wc -l < ~/.beak-lims/logs/beak-app.log)"
else
    echo "   ✗ Log file is empty or missing"
fi

# Cleanup
kill $SERVER1_PID 2>/dev/null || true
sleep 2

# Test 2: beak-lims server runserver
echo ""
echo "3. Testing beak-lims server runserver..."
rm -f ~/.beak-lims/logs/beak-app.log
beak-lims server runserver > /tmp/server2.log 2>&1 &
SERVER2_PID=$!
sleep 5

# Make a request
echo "   Making HTTP request..."
curl -s http://localhost:8000/ > /dev/null && echo "   ✓ Request completed"

# Check logs
sleep 1
echo "   Checking log file..."
if [ -f ~/.beak-lims/logs/beak-app.log ] && [ -s ~/.beak-lims/logs/beak-app.log ]; then
    echo "   ✓ Log file created and contains data"
    echo "   Log entries: $(wc -l < ~/.beak-lims/logs/beak-app.log)"
    echo ""
    echo "   Sample log entry:"
    tail -1 ~/.beak-lims/logs/beak-app.log
else
    echo "   ✗ Log file is empty or missing"
fi

# Cleanup
kill $SERVER2_PID 2>/dev/null || true

echo ""
echo "=== Test Complete ==="
