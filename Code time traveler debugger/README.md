# Code Time Travel Debugger

A visual timeline debugger for JS, Python, and C# — scrub through your app’s execution like a video!

## Features
- Timeline slider to jump to any execution point
- View call stack, variables, and logs at each step
- Screenshot extension: see your app’s UI at every moment
- Export/import debugging sessions
- Beautiful visualizations
- Works with JavaScript, Python, and C#

## Project Structure
```
adapters/      # Language hooks for JS, Python, C#
backend/       # API server and storage
frontend/      # React UI
screenshot/    # Screenshot tools
README.md      # This file
docs/          # Documentation
```

## Getting Started

### 1. Clone the repository
```sh
git clone <repo-url>
cd code-time-travel-debugger
```

### 2. Install dependencies
- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Adapters: See respective folders

### 3. Run the app
- Start backend server
- Start frontend UI
- Integrate adapter in your app (JS, Python, or C#)

## Usage
1. Add the adapter to your app:
   - JS: `npm install code-time-travel-debugger-adapter`
   - Python: `pip install code_time_travel_debugger_adapter`
   - C#: `dotnet add package CodeTimeTravelDebuggerAdapter`
2. Start your app and the debugger UI.
3. Scrub through the timeline and inspect state at any point.

## Screenshots

![Timeline UI](docs/screenshots/timeline.png)
![Variable Graph](docs/screenshots/variables.png)

## Contributing

PRs welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md).

## License
MIT 

---

## 1. **Install Dependencies**

### Backend (Flask)
```sh
cd backend
pip install -r requirements.txt
python app.py
```
This starts the backend server at `http://localhost:5000`.

---

### Frontend (React)
```sh
cd frontend
npm install
npm start
```
This starts the frontend at `http://localhost:3000`.

---

### JS Adapter (with Puppeteer)
1. **Install Puppeteer and node-fetch:**
   ```sh
   cd adapters/js
   npm install puppeteer node-fetch
   ```

2. **Create a test script** (e.g., `test.js`):
   ```js
   const { captureAndSendScreenshot } = require('./screenshot');

   // Example: capture a screenshot of a website and send it as a snapshot
   (async () => {
     await captureAndSendScreenshot(
       'default',      // sessionId
       0,              // step
       'https://example.com', // URL to capture
       { event: 'screenshot', data: { note: 'Test screenshot' } }
     );
     console.log('Screenshot sent!');
   })();
   ```

3. **Run the test script:**
   ```sh
   node test.js
   ```

---

## 2. **View in the UI**

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Use the timeline slider. If the screenshot was sent, it will appear in the Screenshot panel for the corresponding step.

---

## 3. **Troubleshooting**

- Make sure the backend is running before sending snapshots.
- If you see "No screenshot" in the UI, check that the test script ran successfully and the backend received the snapshot.
- You can run the test script multiple times to add more steps to the timeline.

---

Would you like me to generate the `test.js` file for you, or do you want to try these steps yourself? If you encounter any errors, let me know and I’ll help debug! 