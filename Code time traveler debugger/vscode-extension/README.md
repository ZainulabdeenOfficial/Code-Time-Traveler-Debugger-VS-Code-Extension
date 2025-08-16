# Code Time Traveler Debugger VS Code Extension

<img src="logo.png" alt="Extension Logo" width="96" height="96" />

Scrub through your app’s execution like a video. Time travel debugging for JS, Python, and C#.

## Features
- Start/stop the Code Time Traveler backend from VS Code
- Open the timeline UI in your browser or inside VS Code
- Works with JS, Python, and C# via adapters
- Supports screenshots, variable graphs, and more

## Screenshots

![Timeline UI](images/timeline.png)
![Variable Graph](images/variable-graph.png)

## Usage
1. Install the extension in VS Code.
2. Open the Command Palette (Ctrl+Shift+P) and run:
   - `Code Time Traveler: Start Debugging` to start the backend
   - `Code Time Traveler: Open Timeline UI` to view the timeline
   - `Code Time Traveler: Open Timeline in Editor` to view in VS Code
   - `Code Time Traveler: Stop Debugging` to stop the backend
3. Integrate the appropriate adapter in your app (see main project README).
4. Run your app and interact with the timeline in the UI.

## Development
- Build: `npm run compile`
- Watch: `npm run watch`
- Package: `vsce package`

## Requirements
- Python (for backend)
- Node.js (for frontend and adapters)

## Contributing
PRs welcome! 

---

## Why I Can’t Publish For You

- Publishing requires your personal access token (PAT) and access to your Microsoft account.
- For your security, only you should have access to these credentials.
- No AI or assistant can (or should) run commands on your behalf or access your private tokens.

---

## What You Should Do

1. **Double-check your `package.json`:**
   ```json
   "publisher": "mzainulabideen"
   ```

2. **Generate a new PAT** (with Marketplace: Manage and Packaging: Read & write) while logged in as the owner of `mzainulabideen`.

3. **Login with your publisher:**
   ```sh
   vsce login mzainulabideen
   ```
   - Paste your new PAT.

4. **Publish:**
   ```sh
   vsce publish
   ```

---

## If You Still Get Errors

- Double-check you are logged in to the correct Microsoft account (the one that owns the publisher).
- Make sure you are using the correct PAT.
- If you see “/your-publisher-name” in the error, your `package.json` is not set to `"mzainulabideen"`.

---

**If you paste the exact error message and your `package.json` publisher field here, I’ll help you debug it step by step!**

You’re almost there—just a permissions or account mismatch to resolve! 

---

## 1. **Install vsce (if you haven’t already)**
```sh
npm install -g vsce
```

---

## 2. **Check your `package.json`**
Make sure it contains:
```json
<code_block_to_apply_changes_from>
```

---

## 3. **Login to your publisher**
```sh
vsce login mzainulabideen
```
- When prompted, paste your **Personal Access Token (PAT)** with the correct permissions (Marketplace: Manage, Packaging: Read & write).

---

## 4. **Build your extension (if using TypeScript)**
```sh
npm run compile
```
*(Run this in your extension directory if you have TypeScript source files.)*

---

## 5. **Package your extension (optional, for local testing)**
```sh
vsce package
```
- This creates a `.vsix` file for manual installation or testing.

---

## 6. **Publish your extension**
```sh
vsce publish
```
- This will upload your extension to the VS Code Marketplace under your publisher account.

---

## 7. **(Optional) Update your extension**
If you make changes and want to publish a new version:
1. Bump the version in `package.json` (e.g., `"version": "0.1.1"`)
2. Run:
   ```sh
   vsce publish
   ```

---

## 📚 **References**
- [VS Code Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Your Publisher Page](https://marketplace.visualstudio.com/publishers/mzainulabideen)

---

**If you encounter any errors, copy the error message here and I’ll help you resolve it step by step!** 

---

## 1. **Open a terminal and navigate to your extension directory**
```sh
cd "Code time traveler debugger/vscode-extension"
```

---

## 2. **Install vsce (if you haven’t already)**
```sh
npm install -g vsce
```

---

## 3. **Check your `package.json`**
Make sure it contains:
```json
<code_block_to_apply_changes_from>
```

---

## 4. **Login to your publisher**
```sh
vsce login mzainulabideen
```
- When prompted, paste your **Personal Access Token (PAT)** with the correct permissions (Marketplace: Manage, Packaging: Read & write).

---

## 5. **Build your extension (if using TypeScript)**
```sh
npm run compile
```
*(Run this in your extension directory if you have TypeScript source files.)*

---

## 6. **Package your extension (optional, for local testing)**
```sh
vsce package
```
- This creates a `.vsix` file for manual installation or testing.

---

## 7. **Publish your extension**
```sh
vsce publish
```
- This will upload your extension to the VS Code Marketplace under your publisher account.

---

## 8. **(Optional) Update your extension**
If you make changes and want to publish a new version:
1. Bump the version in `package.json` (e.g., `"version": "0.1.1"`)
2. Run:
   ```sh
   vsce publish
   ```

---

## 📚 **References**
- [VS Code Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Your Publisher Page](https://marketplace.visualstudio.com/publishers/mzainulabideen)

---

**If you encounter any errors, copy the error message here and I’ll help you resolve it step by step!** 

---

## Here’s Exactly What You Need To Do:

### 1. **Check your `package.json`**
Open `Code time traveler debugger/vscode-extension/package.json` and make sure you have:
```json
<code_block_to_apply_changes_from>
```
**Do NOT use** `"your-publisher-name"`.

---

### 2. **Create a New Personal Access Token (PAT)**
- Go to [Azure DevOps PAT page](https://dev.azure.com/).
- Create a new PAT with these scopes:
  - **Marketplace**: Manage
  - **Packaging**: Read & write
- Make sure you are logged in with the Microsoft account that owns the `mzainulabideen` publisher.

---

### 3. **Login with the Correct Publisher**
In your terminal:
```sh
cd "Code time traveler debugger/vscode-extension"
vsce login mzainulabideen
```
- Paste your new PAT when prompted.

---

### 4. **Publish**
```sh
vsce publish
```

---

## If You Still See the Error

- Double-check you are logged in to the correct Microsoft account (the one that owns the publisher).
- Double-check the `"publisher"` field in your `package.json`.
- Make sure you are using the new PAT with the correct permissions.

---

**I cannot do these steps for you, but if you follow them exactly, you will resolve the error.**

If you get stuck, paste the exact error message and your `package.json` publisher field here, and I’ll help you debug further! 

---

## ✅ **What This Means for Publishing**

- You must be logged in to [https://dev.azure.com/zu4425](https://dev.azure.com/zu4425) as the owner when creating your Personal Access Token (PAT).
- The PAT you generate here will have the correct permissions to publish extensions for the `mzainulabideen` publisher, as long as that publisher is owned by your `zu4425` account.

---

## **Summary of Steps (with your owner account)**

1. **Log in to Azure DevOps as `zu4425`**  
   [https://dev.azure.com/zu4425](https://dev.azure.com/zu4425)

2. **Create a new PAT**  
   - Go to [PATs page](https://dev.azure.com/zu4425/_usersSettings/tokens)
   - Scopes: Marketplace: Manage, Packaging: Read & write

3. **Set your publisher in `package.json`**  
   ```json
   "publisher": "mzainulabideen"
   ```

4. **Login and publish:**
   ```sh
   cd "Code time traveler debugger/vscode-extension"
   vsce login mzainulabideen
   ``` 