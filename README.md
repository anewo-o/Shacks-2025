# Shacks-2025 — Minimal Flask server

This repository contains a minimal Flask server used as a starting point.

Quick start

1. (Optional) Create a virtual environment:

   python -m venv .venv
   source .venv/bin/activate

2. Install dependencies:

   pip install -r requirements.txt

3. Run the server:

   python app.py

The server listens on port 5000. Try:

  - http://localhost:5000/         -> greeting JSON
  - http://localhost:5000/health  -> health check

Run tests:

  python -m unittest discover -v
