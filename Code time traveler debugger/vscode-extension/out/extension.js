"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
const net = __importStar(require("net"));
let backendProcess = null;
let frontendProcess = null;
let statusBarItem;
function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        server.listen(port, '127.0.0.1');
    });
}
function updateStatusBar(backend, frontend) {
    let color = '';
    let icon = '';
    if (backend && frontend) {
        color = '#43a047'; // green
        icon = '$(check)';
    }
    else if (backend || frontend) {
        color = '#fbc02d'; // yellow
        icon = '$(alert)';
    }
    else {
        color = '#e53935'; // red
        icon = '$(error)';
    }
    statusBarItem.text = `${icon} Code Time Traveler: Backend ${backend ? '$(check)' : '$(x)'} | Frontend ${frontend ? '$(check)' : '$(x)'}`;
    statusBarItem.color = color;
    statusBarItem.show();
}
function activate(context) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = '$(debug) Code Time Traveler: Idle';
    statusBarItem.color = '#e53935';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(vscode.commands.registerCommand('codeTimeTravelDebugger.start', () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const config = vscode.workspace.getConfiguration('codeTimeTravelDebugger');
        const pythonPath = config.get('pythonPath', 'python');
        const backendPort = config.get('backendPort', 5000);
        const frontendPort = config.get('frontendPort', 3000);
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }
        const workspacePath = workspaceFolders[0].uri.fsPath;
        const backendPath = path.join(workspacePath, 'backend', 'app.py');
        const frontendPath = path.join(workspacePath, 'frontend');
        // Start backend if not running
        const backendFree = yield checkPort(backendPort);
        if (backendFree) {
            vscode.window.showInformationMessage(`Starting Code Time Traveler backend at ${backendPath}...`);
            try {
                backendProcess = cp.spawn(pythonPath, [backendPath, `--port=${backendPort}`], {
                    cwd: workspacePath,
                    detached: true,
                    shell: true,
                });
                backendProcess.on('error', (err) => {
                    vscode.window.showErrorMessage('Failed to start backend: ' + err.message);
                    updateStatusBar(false, !!frontendProcess);
                });
                (_a = backendProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                    vscode.window.showInformationMessage(`[Backend] ${data}`);
                });
                (_b = backendProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
                    vscode.window.showErrorMessage(`[Backend Error] ${data}`);
                });
                vscode.window.showInformationMessage('Backend started.');
            }
            catch (err) {
                vscode.window.showErrorMessage('Failed to start backend: ' + err.message);
            }
        }
        else {
            vscode.window.showInformationMessage('Backend already running.');
        }
        // Start frontend if not running
        const frontendFree = yield checkPort(frontendPort);
        if (frontendFree) {
            vscode.window.showInformationMessage(`Starting Code Time Traveler frontend (npm start in ${frontendPath})...`);
            try {
                frontendProcess = cp.spawn('npm', ['start'], {
                    cwd: frontendPath,
                    detached: true,
                    shell: true,
                });
                frontendProcess.on('error', (err) => {
                    vscode.window.showErrorMessage('Failed to start frontend: ' + err.message);
                    updateStatusBar(!!backendProcess, false);
                });
                (_c = frontendProcess.stdout) === null || _c === void 0 ? void 0 : _c.on('data', (data) => {
                    vscode.window.showInformationMessage(`[Frontend] ${data}`);
                });
                (_d = frontendProcess.stderr) === null || _d === void 0 ? void 0 : _d.on('data', (data) => {
                    vscode.window.showErrorMessage(`[Frontend Error] ${data}`);
                });
                vscode.window.showInformationMessage('Frontend started.');
            }
            catch (err) {
                vscode.window.showErrorMessage('Failed to start frontend: ' + err.message);
            }
        }
        else {
            vscode.window.showInformationMessage('Frontend already running.');
        }
        updateStatusBar(!backendFree || !!backendProcess, !frontendFree || !!frontendProcess);
    })));
    context.subscriptions.push(vscode.commands.registerCommand('codeTimeTravelDebugger.stop', () => {
        if (backendProcess) {
            backendProcess.kill();
            backendProcess = null;
        }
        if (frontendProcess) {
            frontendProcess.kill();
            frontendProcess = null;
        }
        updateStatusBar(false, false);
        vscode.window.showInformationMessage('Code Time Traveler backend and frontend stopped.');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('codeTimeTravelDebugger.openTimeline', () => {
        const config = vscode.workspace.getConfiguration('codeTimeTravelDebugger');
        const frontendPort = config.get('frontendPort', 3000);
        vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${frontendPort}`));
    }));
    // Webview integration: open timeline UI in a VS Code webview
    context.subscriptions.push(vscode.commands.registerCommand('codeTimeTravelDebugger.openTimelineWebview', () => {
        const config = vscode.workspace.getConfiguration('codeTimeTravelDebugger');
        const frontendPort = config.get('frontendPort', 3000);
        const panel = vscode.window.createWebviewPanel('codeTimeTravelTimeline', 'Code Time Traveler Timeline', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        panel.webview.html = getWebviewContent(frontendPort);
    }));
    // Adapter injection wizard (stub)
    context.subscriptions.push(vscode.commands.registerCommand('codeTimeTravelDebugger.injectAdapter', () => __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Adapter injection wizard coming soon!');
        // Will scan workspace, detect language, and offer to inject adapter code.
    })));
    // Code lens/hover guide (stub)
    context.subscriptions.push(vscode.commands.registerCommand('codeTimeTravelDebugger.showCodeLensGuide', () => {
        vscode.window.showInformationMessage('Code lens and variable hover integration is coming soon!\n\n' +
            'In the future, you will be able to see variable values at each timeline point directly in your code.\n' +
            'Stay tuned!');
    }));
    // --- CodeLens/hover integration stubs removed for now ---
    // If you want to implement full code lens/hover, you would add a CodeLensProvider and HoverProvider here.
}
exports.activate = activate;
function getWebviewContent(frontendPort) {
    // Use an iframe to embed the React app
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Time Traveler Timeline</title>
    <style>
      html, body, iframe { height: 100%; width: 100%; margin: 0; padding: 0; border: none; }
      iframe { border: none; }
    </style>
  </head>
  <body>
    <iframe src="http://localhost:${frontendPort}" frameborder="0" style="width:100vw;height:100vh;"></iframe>
  </body>
</html>`;
}
function deactivate() {
    if (backendProcess) {
        backendProcess.kill();
        backendProcess = null;
    }
    if (frontendProcess) {
        frontendProcess.kill();
        frontendProcess = null;
    }
    if (statusBarItem) {
        statusBarItem.hide();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map