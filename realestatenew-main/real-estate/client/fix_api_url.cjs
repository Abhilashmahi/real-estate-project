const fs = require('fs');
const path = require('path');

const OLD_URLS = ['http://192.168.1.6:5000', 'http://localhost:5000', 'http://127.0.0.1:5000'];
const NEW_URL = 'http://192.168.1.5:5000';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== 'node_modules' && f !== 'dist') {
      walkDir(dirPath, callback);
    } else if (!isDirectory) {
      callback(dirPath);
    }
  });
}

// Fix files in src
const srcPath = path.join(__dirname, 'src');
walkDir(srcPath, filePath => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanged = false;
    OLD_URLS.forEach(oldUrl => {
      if (content.includes(oldUrl)) {
        content = content.split(oldUrl).join(NEW_URL);
        hasChanged = true;
      }
    });
    if (hasChanged) {
      console.log(`Fixing file: ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});

// Fix vite.config.ts
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  let hasChanged = false;
  OLD_URLS.forEach(oldUrl => {
    if (content.includes(oldUrl)) {
      content = content.split(oldUrl).join(NEW_URL);
      hasChanged = true;
    }
  });
  if (hasChanged) {
    console.log(`Fixing file: ${viteConfigPath}`);
    fs.writeFileSync(viteConfigPath, content, 'utf8');
  }
}

console.log('✅ Hardcoded URLs updated to 192.168.1.5 successfully!');
