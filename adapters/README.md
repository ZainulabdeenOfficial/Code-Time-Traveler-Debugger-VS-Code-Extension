# Adapters

Adapters are language-specific hooks that enable the Code Time Travel Debugger to record execution data from JavaScript, Python, and C# applications.

## Purpose
- Capture function calls, variable states, and logs from your app.
- Send execution snapshots to the backend for visualization.

## Implementing a New Adapter
1. Follow the interface guidelines below.
2. Place your adapter in a subfolder (e.g., `js/`, `python/`, `csharp/`).
3. Ensure it can:
   - Hook into function calls
   - Record variable changes
   - Capture logs
   - Communicate with the backend API

## Example Structure
```
adsapters/
  js/
    index.js
  python/
    __init__.py
  csharp/
    Adapter.cs
```

## Adapter API
- `startRecording()` — Begin capturing execution data
- `stopRecording()` — Stop and flush data
- `sendSnapshot(data)` — Send a snapshot to the backend

## Contributing
See [../docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) 