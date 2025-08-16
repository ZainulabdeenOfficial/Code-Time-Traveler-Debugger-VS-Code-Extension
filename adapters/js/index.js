// Minimal JS Adapter for Code Time Travel Debugger
// Usage: import and call startRecording() in your app

let timeline = [];
let currentVars = {};

function captureSnapshot(event, data) {
  timeline.push({
    timestamp: Date.now(),
    event,
    data: { ...data, vars: { ...currentVars } },
  });
  // Send to backend (example)
  fetch('http://localhost:5000/snapshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(timeline[timeline.length - 1]),
  });
}

export function startRecording() {
  // Example: wrap console.log
  const origLog = console.log;
  console.log = function (...args) {
    captureSnapshot('log', { args });
    origLog.apply(console, args);
  };
  // Example: wrap a function
  // Usage: wrapFunction(myFunc, 'myFunc')
}

export function wrapFunction(fn, name) {
  return function (...args) {
    captureSnapshot('call', { name, args });
    const result = fn.apply(this, args);
    captureSnapshot('return', { name, result });
    return result;
  };
}

export function setVar(name, value) {
  currentVars[name] = value;
  captureSnapshot('var', { name, value });
}

export function stopRecording() {
  // Optionally flush or finalize
  timeline = [];
} 