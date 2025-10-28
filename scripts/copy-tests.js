// Copies compiled tests to out/test if needed (noop when using tsc outDir)
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'test');
const dest = path.join(__dirname, '..', 'out', 'test');

if (!fs.existsSync(src)) process.exit(0);
fs.mkdirSync(dest, { recursive: true });
for (const file of fs.readdirSync(src)) {
  const from = path.join(src, file);
  const to = path.join(dest, file);
  if (fs.statSync(from).isFile()) {
    fs.copyFileSync(from, to);
  }
}


