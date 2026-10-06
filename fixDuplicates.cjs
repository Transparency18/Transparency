const fs = require('fs');
const path = require('path');
const dir = './src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  content = content.replace(/sector: '', sector: ''/g, "sector: ''");
  fs.writeFileSync(path.join(dir, file), content);
});

console.log('Duplicates removed');
