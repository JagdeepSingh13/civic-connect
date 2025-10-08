#!/bin/bash

echo "Starting Civic Connect Application..."
echo

echo "[1/4] Starting MongoDB (if not already running)..."
echo "Please ensure MongoDB is running on localhost:27017"
echo

echo "[2/4] Starting Backend Server..."
cd backend && npm run dev &
BACKEND_PID=$!
cd ..

echo "[3/4] Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo "[4/4] Application Started!"
echo
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
