#!/bin/bash

# --- CONFIGURATION ---
BACKEND_PORT=8000
FRONTEND_PORT=5173

echo "🚀 Initializing ResumeAI Development Environment..."

# --- KILL EXISTING PROCESSES ---
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port)
    if [ ! -z "$pids" ]; then
        # Format PIDs as space-separated
        local formatted_pids=$(echo $pids | tr '\n' ' ')
        echo "🔪 Clearing port $port (PID: $formatted_pids)..."
        for pid in $pids; do
            kill -9 $pid 2>/dev/null
        done
        
        # Wait up to 2 seconds for the port to be fully released
        for i in {1..10}; do
            if [ -z "$(lsof -ti:$port)" ]; then
                break
            fi
            sleep 0.2
        done
    fi
}

kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# --- START BACKEND ---
echo "🐍 Starting FastAPI Backend..."
cd backend
# Use the virtual environment python to run uvicorn
./venv/bin/python3 -m uvicorn app.main:app --reload --port $BACKEND_PORT > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# --- VALIDATE BACKEND STARTUP ---
echo -n "⏳ Verifying backend startup..."
backend_healthy=false
for i in {1..15}; do
    sleep 0.2
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "\n❌ FastAPI Backend failed to start! Direct traceback from backend.log:"
        echo "-------------------------------------------------------"
        tail -n 25 backend.log
        echo "-------------------------------------------------------"
        exit 1
    fi
    # If the port is active, it means the server is up
    if lsof -i:$BACKEND_PORT -t >/dev/null 2>&1; then
        backend_healthy=true
        break
    fi
done

if [ "$backend_healthy" = false ]; then
    echo -e "\n⚠️  Backend started but not responding on port $BACKEND_PORT yet. Checking status..."
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend has crashed."
        tail -n 25 backend.log
        exit 1
    fi
fi
echo " Done! (PID: $BACKEND_PID)"

# --- START FRONTEND ---
echo "⚛️  Starting Vite Frontend..."
echo "📝 Backend logs are being written to backend.log"
echo "🌐 Access Frontend: http://localhost:$FRONTEND_PORT"
echo "⚙️  Access Backend: http://localhost:$BACKEND_PORT/docs"
echo "-------------------------------------------------------"

# Function to handle script termination (Ctrl+C)
cleanup() {
    echo -e "\n🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill_port $BACKEND_PORT
    exit
}

trap cleanup SIGINT

# Run frontend in foreground so you can see its output
npm run dev -- --port $FRONTEND_PORT
