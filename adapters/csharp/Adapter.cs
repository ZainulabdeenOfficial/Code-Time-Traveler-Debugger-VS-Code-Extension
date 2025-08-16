// Minimal C# Adapter for Code Time Travel Debugger
// Usage: Call StartRecording() in your app
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;

public static class CodeTimeTravelAdapter
{
    private static List<Dictionary<string, object>> timeline = new();
    private static Dictionary<string, object> currentVars = new();
    private static readonly HttpClient client = new();

    private static void CaptureSnapshot(string evt, Dictionary<string, object> data)
    {
        var snapshot = new Dictionary<string, object>
        {
            ["timestamp"] = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            ["event"] = evt,
            ["data"] = new Dictionary<string, object>(data)
            {
                ["vars"] = new Dictionary<string, object>(currentVars)
            }
        };
        timeline.Add(snapshot);
        // Send to backend (example)
        var content = new StringContent(JsonSerializer.Serialize(snapshot), Encoding.UTF8, "application/json");
        try { client.PostAsync("http://localhost:5000/snapshot", content).Wait(); } catch { }
    }

    public static void StartRecording()
    {
        // Example: wrap Console.WriteLine
        Console.SetOut(new SnapshotWriter(Console.Out));
    }

    public static void SetVar(string name, object value)
    {
        currentVars[name] = value;
        CaptureSnapshot("var", new Dictionary<string, object> { ["name"] = name, ["value"] = value });
    }

    public static T WrapFunction<T>(Func<T> fn, string name)
    {
        CaptureSnapshot("call", new Dictionary<string, object> { ["name"] = name });
        var result = fn();
        CaptureSnapshot("return", new Dictionary<string, object> { ["name"] = name, ["result"] = result });
        return result;
    }

    public static void StopRecording()
    {
        timeline.Clear();
    }

    private class SnapshotWriter : System.IO.TextWriter
    {
        private readonly System.IO.TextWriter _original;
        public SnapshotWriter(System.IO.TextWriter original) { _original = original; }
        public override Encoding Encoding => _original.Encoding;
        public override void WriteLine(string value)
        {
            CaptureSnapshot("log", new Dictionary<string, object> { ["args"] = value });
            _original.WriteLine(value);
        }
    }
} 