# pip install -r requirements.txt
# source .venv/bin/acitvate
python backend/app.py &
BACKEND_PID=$!

# npm install --prefix frontend
npm run dev --prefix frontend &
FRONTEND_PID=$!

echo "running..."

# kill $(lsof -t -i :5000)
# kill BACKEND_PID FRONTEND_PID??
