# GitHub Packages Publishing Guide

## Publishing Version 1.1.0 to GitHub Packages

### Prerequisites

1. **GitHub Personal Access Token (PAT)**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: "GitHub Packages Publish"
   - Scopes needed:
     - `write:packages` (to publish packages)
     - `read:packages` (to install packages)
     - `delete:packages` (optional, to delete packages)
   - Generate and copy the token

2. **Configure npm Authentication**
   
   Create/update `.npmrc` file (already exists):
   ```
   @VishalNandy17:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

   Then set the token as environment variable:
   ```powershell
   $env:GITHUB_TOKEN="your-github-token-here"
   ```

### Publishing Steps

#### Method 1: Using npm publish (Recommended)

```powershell
# Set your GitHub token
$env:GITHUB_TOKEN="your-github-token-here"

# Build the project
npm run build

# Publish to GitHub Packages
npm publish
```

#### Method 2: Using npm publish with token inline

```powershell
# Build first
npm run build

# Publish with token
npm publish --registry=https://npm.pkg.github.com --//npm.pkg.github.com/:_authToken=your-token-here
```

#### Method 3: Login via npm

```powershell
# Login to GitHub Packages
npm login --registry=https://npm.pkg.github.com --scope=@VishalNandy17

# Enter your username, password (use token as password), and email
# Then publish
npm publish
```

### Package Information

- **Package Name**: `@VishalNandy17/retroc`
- **Version**: `1.1.0`
- **Registry**: `https://npm.pkg.github.com`
- **Repository**: `https://github.com/VishalNandy17/RetroC`
- **Package URL**: `https://github.com/VishalNandy17/RetroC/pkgs/npm/retroc`

### Verification

After publishing, verify at:
- https://github.com/VishalNandy17/RetroC/pkgs/npm/retroc
- The new version 1.1.0 should appear as "Latest"

### Installing the Published Package

Users can install your package with:

```bash
npm install @VishalNandy17/retroc@1.1.0
```

Or configure `.npmrc` in their project:
```
@VishalNandy17:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Troubleshooting

**Error: 403 Forbidden**
- Check that your token has `write:packages` scope
- Verify the token is correct
- Ensure `.npmrc` is properly configured

**Error: Package name mismatch**
- Ensure package.json has `"name": "@VishalNandy17/retroc"`
- Scope must match your GitHub username

**Error: Version already exists**
- Version 1.1.0 must be unique
- If already published, increment version in package.json

### Current Status

✅ Package configured: `@VishalNandy17/retroc@1.1.0`
✅ `.npmrc` configured for GitHub Packages
✅ Repository URL set
✅ Ready to publish!

Just set `$env:GITHUB_TOKEN` and run `npm publish`!

