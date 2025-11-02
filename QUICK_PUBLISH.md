# Quick Publish Instructions

## Ready to Publish!

Your extension is ready. Here are the quickest ways to publish:

### Method 1: Using npm script (Easiest)

```bash
cd d:\VS_Extension
npm run publish -p YOUR_PERSONAL_ACCESS_TOKEN
```

Or set the token as environment variable first:
```powershell
$env:VSCE_TOKEN="your-token-here"
npm run publish
```

### Method 2: Using npx directly

```bash
cd d:\VS_Extension
npx @vscode/vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN
```

### Method 3: Manual Upload (If CLI fails)

1. The VSIX file is already created: `retroc-1.0.5.vsix`
2. Go to: https://marketplace.visualstudio.com/manage
3. Login with Microsoft/Azure account
4. Create publisher ID: `VishalNandy17` (if doesn't exist)
5. Click "New Extension" → "Visual Studio Code"
6. Upload `retroc-1.0.5.vsix`
7. Fill details and publish

## Get Your Personal Access Token

1. Go to: https://dev.azure.com
2. Sign in with Microsoft account
3. Click on your profile → Personal Access Tokens
4. New Token → Name it "VS Code Marketplace"
5. Select scope: **Marketplace (Manage)**
6. Copy the token immediately (won't show again!)

## Current Status

✅ Extension packaged: `retroc-1.0.5.vsix` (643.67KB)
✅ All files ready
✅ Metadata complete
✅ Ready to publish!

Just need your Personal Access Token and you're good to go!

