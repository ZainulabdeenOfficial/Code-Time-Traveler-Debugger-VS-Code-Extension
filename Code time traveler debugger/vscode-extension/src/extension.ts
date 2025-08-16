import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as net from 'net';

let backendProcess: cp.ChildProcess | null = null;
let frontendProcess: cp.ChildProcess | null = null;
let statusBarItem: vscode.StatusBarItem;

function checkPort(port: number): Promise<boolean> {
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

function updateStatusBar(backend: boolean, frontend: boolean) {
  let color = '';
  let icon = '';
  if (backend && frontend) {
    color = '#43a047'; // green
    icon = '$(check)';
  } else if (backend || frontend) {
    color = '#fbc02d'; // yellow
    icon = '$(alert)';
  } else {
    color = '#e53935'; // red
    icon = '$(error)';
  }
  statusBarItem.text = `${icon} Code Time Traveler: Backend ${backend ? '$(check)' : '$(x)'} | Frontend ${frontend ? '$(check)' : '$(x)'}`;
  statusBarItem.color = color;
  statusBarItem.show();
}

export function activate(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = '$(debug) Code Time Traveler: Idle';
  statusBarItem.color = '#e53935';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand('codeTimeTravelDebugger.start', async () => {
      const config = vscode.workspace.getConfiguration('codeTimeTravelDebugger');
      const pythonPath = config.get<string>('pythonPath', 'python');
      const backendPort = config.get<number>('backendPort', 5000);
      const frontendPort = config.get<number>('frontendPort', 3000);
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
      }
      const workspacePath = workspaceFolders[0].uri.fsPath;
      const backendPath = path.join(workspacePath, 'backend', 'app.py');
      const frontendPath = path.join(workspacePath, 'frontend');

      // Start backend if not running
      const backendFree = await checkPort(backendPort);
      if (backendFree) {
        vscode.window.showInformationMessage(`Starting Code Time Traveler backend at ${backendPath}...`);
        try {
          backendProcess = cp.spawn(pythonPath, [backendPath, `--port=${backendPort}`], {
            cwd: workspacePath,
            detached: true,
            shell: true,
          });
          backendProcess.on('error', (err: Error) => {
            vscode.window.showErrorMessage('Failed to start backend: ' + err.message);
            updateStatusBar(false, !!frontendProcess);
          });
          backendProcess.stdout?.on('data', (data) => {
            vscode.window.showInformationMessage(`[Backend] ${data}`);
          });
          backendProcess.stderr?.on('data', (data) => {
            vscode.window.showErrorMessage(`[Backend Error] ${data}`);
          });
          vscode.window.showInformationMessage('Backend started.');
        } catch (err: any) {
          vscode.window.showErrorMessage('Failed to start backend: ' + err.message);
        }
      } else {
        vscode.window.showInformationMessage('Backend already running.');
      }

      // Start frontend if not running
      const frontendFree = await checkPort(frontendPort);
      if (frontendFree) {
        vscode.window.showInformationMessage(`Starting Code Time Traveler frontend (npm start in ${frontendPath})...`);
        try {
          frontendProcess = cp.spawn('npm', ['start'], {
            cwd: frontendPath,
            detached: true,
            shell: true,
          });
          frontendProcess.on('error', (err: Error) => {
            vscode.window.showErrorMessage('Failed to start frontend: ' + err.message);
            updateStatusBar(!!backendProcess, false);
          });
          frontendProcess.stdout?.on('data', (data) => {
            vscode.window.showInformationMessage(`[Frontend] ${data}`);
          });
          frontendProcess.stderr?.on('data', (data) => {
            vscode.window.showErrorMessage(`[Frontend Error] ${data}`);
          });
          vscode.window.showInformationMessage('Frontend started.');
        } catch (err: any) {
          vscode.window.showErrorMessage('Failed to start frontend: ' + err.message);
        }
      } else {
        vscode.window.showInformationMessage('Frontend already running.');
      }

      updateStatusBar(!backendFree || !!backendProcess, !frontendFree || !!frontendProcess);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('codeTimeTravelDebugger.stop', () => {
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
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('codeTimeTravelDebugger.openTimeline', () => {
      const config = vscode.workspace.getConfiguration('codeTimeTravelDebugger');
      const frontendPort = config.get<number>('frontendPort', 3000);
      vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${frontendPort}`));
    })
  );

  // Webview integration: open timeline UI in a VS Code webview
  context.subscriptions.push(
    vscode.commands.registerCommand('codeTimeTravelDebugger.openTimelineWebview', () => {
      const config = vscode.workspace.getConfiguration('codeTimeTravelDebugger');
      const frontendPort = config.get<number>('frontendPort', 3000);
      const panel = vscode.window.createWebviewPanel(
        'codeTimeTravelTimeline',
        'Code Time Traveler Timeline',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      panel.webview.html = getWebviewContent(frontendPort);
    })
  );

  // Adapter injection wizard (stub)
  context.subscriptions.push(
    vscode.commands.registerCommand('codeTimeTravelDebugger.injectAdapter', async () => {
      vscode.window.showInformationMessage('Adapter injection wizard coming soon!');
      // Will scan workspace, detect language, and offer to inject adapter code.
    })
  );

  // Code lens/hover guide (stub)
  context.subscriptions.push(
    vscode.commands.registerCommand('codeTimeTravelDebugger.showCodeLensGuide', () => {
      vscode.window.showInformationMessage(
        'Code lens and variable hover integration is coming soon!\n\n'+
        'In the future, you will be able to see variable values at each timeline point directly in your code.\n'+
        'Stay tuned!'
      );
    })
  );

  // --- CodeLens/hover integration stubs removed for now ---
  // If you want to implement full code lens/hover, you would add a CodeLensProvider and HoverProvider here.
}

function getWebviewContent(frontendPort: number): string {
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

export function deactivate() {
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