const fs = require('fs');
const path = require('path');

// Copy templates from src/templates to dist/templates
const srcTemplatesDir = path.join(__dirname, '..', 'src', 'templates');
const distTemplatesDir = path.join(__dirname, '..', 'dist', 'templates');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(srcTemplatesDir)) {
  console.log('Copying templates from src/templates to dist/templates...');
  copyRecursiveSync(srcTemplatesDir, distTemplatesDir);
  console.log('Templates copied successfully!');
} else {
  console.warn('Warning: src/templates directory not found');
}

