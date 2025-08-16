# Backend

The backend server stores execution snapshots and provides API endpoints for the Code Time Travel Debugger.

## Purpose
- Store and retrieve timeline data
- Serve API endpoints for the frontend and adapters

## Setup
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Start the server:
   ```sh
   python app.py
   ```
   The server will run at http://localhost:5000 and serve the frontend at http://localhost:3000.

## API Endpoints
- `POST /snapshot` — Receive execution snapshot
- `GET /timeline/:sessionId` — Get timeline data for a session

## Configuration
- See `config.example.json` for environment variables

## Contributing
See [../docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) 