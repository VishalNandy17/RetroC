# VS Code Marketplace Publishing Guide

## Prerequisites

Before publishing, you need:

1. **Personal Access Token (PAT)** from Azure DevOps
   - Go to: https://dev.azure.com
   - Sign in with your Microsoft account (or create one)
   - Go to User Settings → Personal Access Tokens
   - Create new token with **Marketplace (Manage)** scope
   - Copy and save the token (you'll need it for publishing)

2. **Publisher Account**
   - Go to: https://marketplace.visualstudio.com/manage
   - Create a publisher ID if you don't have one
   - Your publisher ID should match `package.json`: `VishalNandy17`

## Publishing Steps

### Option 1: Using npx (Recommended)

```bash
# Make sure you're in the extension directory
cd d:\VS_Extension

# Publish using npx (no global install needed)
npx @vscode/vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN

# Or if you have VSCE_TOKEN environment variable set:
npx @vscode/vsce publish
```

### Option 2: Install Globally First

```bash
# Install vsce globally
npm install -g @vscode/vsce

# Verify installation
vsce --version

# Publish
vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN
```

### Option 3: Using npm Script

```bash
# Add this to package.json scripts:
# "publish-extension": "vsce publish -p $env:VSCE_TOKEN"

# Then run:
npm run publish-extension
```

## Alternative: Manual Upload

If publishing via CLI doesn't work:

1. Package the extension:
   ```bash
   npm run package
   ```

2. Go to: https://marketplace.visualstudio.com/manage
3. Select your publisher: **VishalNandy17**
4. Click "New Extension" → "Visual Studio Code"
5. Upload the `retroc-1.0.5.vsix` file
6. Fill in the details and publish

## Verification Checklist

Before publishing:
- [x] Extension packages successfully (`npm run package`)
- [x] VSIX file created (`retroc-1.0.5.vsix`)
- [x] Version number updated in package.json (1.0.5)
- [x] CHANGELOG.md updated
- [x] README.md is complete
- [x] Icon and gallery banner configured
- [x] All tests pass

## Troubleshooting

### "vsce: command not found"
- Use `npx @vscode/vsce` instead of `vsce`
- Or install globally: `npm install -g @vscode/vsce`

### Authentication Errors
- Verify your Personal Access Token is valid
- Ensure token has "Marketplace (Manage)" scope
- Token format: `vsce publish -p <your-token>`

### Publisher ID Mismatch
- Ensure `package.json` publisher matches your marketplace publisher ID
- Current publisher: `VishalNandy17`

### Version Already Exists
- Increment version in `package.json`
- Update CHANGELOG.md
- Re-package: `npm run package`

## Next Steps After Publishing

1. Wait for extension to appear in marketplace (5-10 minutes)
2. Test installation from marketplace
3. Share with community
4. Monitor for user feedback and issues

