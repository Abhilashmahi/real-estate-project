const fs = require('fs');
const path = require('path');

const OLD_URL = 'http://192.168.1.6:5000';
const NEW_URL = 'http://localhost:5000';

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
    if (content.includes(OLD_URL)) {
      console.log(`Fixing file: ${filePath}`);
      const updated = content.split(OLD_URL).join(NEW_URL);
      fs.writeFileSync(filePath, updated, 'utf8');
    }
  }
});

// Fix vite.config.ts
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  if (content.includes(OLD_URL)) {
    console.log(`Fixing file: ${viteConfigPath}`);
    const updated = content.split(OLD_URL).join(NEW_URL);
    fs.writeFileSync(viteConfigPath, updated, 'utf8');
  }
}

console.log('✅ Hardcoded IP URLs updated to localhost successfully!');
