# Minimal Python Adapter for Code Time Travel Debugger
# Usage: import and call start_recording() in your app

import time
import requests

timeline = []
current_vars = {}


def capture_snapshot(event, data):
    snapshot = {
        'timestamp': time.time(),
        'event': event,
        'data': {**data, 'vars': {**current_vars}},
    }
    timeline.append(snapshot)
    # Send to backend (example)
    try:
        requests.post('http://localhost:5000/snapshot', json=snapshot)
    except Exception:
        pass


def start_recording():
    import builtins
    orig_print = builtins.print

    def print_hook(*args, **kwargs):
        capture_snapshot('log', {'args': args})
        orig_print(*args, **kwargs)
    builtins.print = print_hook


def wrap_function(fn, name=None):
    def wrapper(*args, **kwargs):
        capture_snapshot('call', {'name': name or fn.__name__, 'args': args})
        result = fn(*args, **kwargs)
        capture_snapshot('return', {'name': name or fn.__name__, 'result': result})
        return result
    return wrapper


def set_var(name, value):
    current_vars[name] = value
    capture_snapshot('var', {'name': name, 'value': value})


def stop_recording():
    global timeline
    timeline = [] 