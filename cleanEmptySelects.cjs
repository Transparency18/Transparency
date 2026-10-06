const fs = require('fs');
const path = require('path');

function cleanUpEmptySelects(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanUpEmptySelects(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Remove the specific empty select
      content = content.replace(/<select className="w-full border rounded p-2 mt-4" value=\{formData\.sector \|\| ''\} onChange=\{e => setFormData\(\{\.\.\.formData, sector: e\.target\.value\}\)\}>\s*<\/select>/g, '');
      content = content.replace(/<select className="w-full border rounded p-2 text-sm" value=\{formData\.sector \|\| ''\} onChange=\{e => setFormData\(\{\.\.\.formData, sector: e\.target\.value\}\)\}>\s*<\/select>/g, '');

      // Also clean up useAuth destructuring
      content = content.replace(/const \{ phase, sector \} = useAuth\(\);/g, 'const { phase } = useAuth();');
      content = content.replace(/const \{ phase, sector, role \} = useAuth\(\);/g, 'const { phase, role } = useAuth();');
      content = content.replace(/const \{ role, phase, sector \} = useAuth\(\);/g, 'const { role, phase } = useAuth();');

      // Also clean up Table Headers
      content = content.replace(/Phase \/ Sector/g, 'Phase');
      content = content.replace(/Phase & Sector/g, 'Phase');

      // Also clean up display of sector in rows
      content = content.replace(/\{volunteer\.sector && ` - Sector 2`\}/g, '');
      content = content.replace(/\{guard\.sector && ` - Sector 2`\}/g, '');
      content = content.replace(/\{ch\.sector && ` - Sector 2`\}/g, '');
      content = content.replace(/\{issue\.sector && <span className="ml-1 text-gray-500">\/<\/span>\}/g, '');
      content = content.replace(/\{p\.sector && <span className="ml-1 text-gray-500">\/<\/span>\}/g, '');
      
      // Cleanup match logic in filters
      content = content.replace(/const matchesSector = sector === "All" \|\| ![^.]+\.sector \|\| [^.]+\.sector === sector;\n/g, '');
      content = content.replace(/ && matchesSector/g, '');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Cleaned up ${file}`);
      }
    }
  }
}

cleanUpEmptySelects(path.join(__dirname, 'src', 'pages'));
