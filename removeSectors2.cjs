const fs = require('fs');
const path = require('path');

function removeSectors(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeSectors(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Extremely aggressive match: find "<div...Sector (Optional)...</div>" and kill it.
      // We will match from <div up to the next </div> that comes after </select>
      const sectorDivRegex = /<div[^>]*>\s*<label[^>]*>Sector \(Optional\)<\/label>[\s\S]*?<\/select>\s*<\/div>/g;
      content = content.replace(sectorDivRegex, '');

      // Remove specific options
      content = content.replace(/\s*<option value="">None \/ All Sectors<\/option>/g, '');
      content = content.replace(/\s*<option value="All">All Phases \/ Sectors \(Optional\)<\/option>/g, '');

      // Remove mapping `{sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}`
      content = content.replace(/\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*/g, '');
      content = content.replace(/\s*\{sectors\.map\(s => \(\s*<option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\s*\)\)\}\s*/g, '');

      // Remove any leftover inline Sector text
      content = content.replace(/\s*\/ \{sectors\.find\(s => s\.id === [^.]+\.sector\)\?\.name \|\| [^.]+\.sector\}/g, '');
      content = content.replace(/\{issue\.sector && <span[^>]*>\/ \{sectors\.find[^\}]+\}\.?name \|\| [^\}]+\}<\/span>\}/g, '');
      content = content.replace(/\{p\.sector && <span[^>]*>\/ \{sectors\.find[^\}]+\}\.?name \|\| [^\}]+\}<\/span>\}/g, '');
      content = content.replace(/\{u\.sector && ` - \$\{sectors\.find\(s => s\.id === u\.sector\)\?\.name \|\| u\.sector\}`\}/g, '');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

removeSectors(path.join(__dirname, 'src', 'pages'));
