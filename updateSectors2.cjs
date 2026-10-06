const fs = require('fs');
const path = require('path');
const dir = './src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  if (content.includes('const { phase, role } = useAuth();')) {
    content = content.replace('const { phase, role } = useAuth();', 'const { phase, sector, role } = useAuth();');
  } else if (content.includes('const { role, phase } = useAuth();')) {
    content = content.replace('const { role, phase } = useAuth();', 'const { role, phase, sector } = useAuth();');
  } else if (content.includes('const { phase } = useAuth();')) {
    content = content.replace('const { phase } = useAuth();', 'const { phase, sector } = useAuth();');
  }
  
  const matchPhaseRegex = /const matchesPhase = phase === "All" \|\| ([^\s]+)\.phase === phase( \|\| ![^\s]+\.phase)?;/;
  if (matchPhaseRegex.test(content)) {
    const match = content.match(matchPhaseRegex);
    const itemVar = match[1];
    
    // Add matchesSector below matchesPhase
    if (!content.includes('const matchesSector = sector === "All"')) {
      content = content.replace(matchPhaseRegex, 
        `${match[0]}\n    const matchesSector = sector === "All" || !${itemVar}.sector || ${itemVar}.sector === sector;`
      );
    }
    
    // update return matchesSearch && matchesStatus && matchesPhase;
    content = content.replace(/(return .*?matchesPhase.*?);/g, (m, p1) => {
      if (!p1.includes('matchesSector')) {
        return p1 + ' && matchesSector;';
      }
      return m;
    });
  }

  // Display Phase / Sector in tables
  content = content.replace(
      /<td className="py-4 px-6">\s*<div className="text-gray-900 font-medium">\{phase\?\.name\}<\/div>\s*<\/td>/g,
      '<td className="py-4 px-6">\n                      <div className="text-gray-900 font-medium">\n                        {phase?.name}\n                        {item.sector && <span className="ml-1 text-gray-500">/ {sectors.find(s => s.id === item.sector)?.name || item.sector}</span>}\n                      </div>\n                    </td>'
  );

  // Rename "Phase" to "Phase / Sector" in table headers
  content = content.replace(
      /<th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phase<\/th>/g,
      '<th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phase / Sector</th>'
  );
  
  fs.writeFileSync(path.join(dir, file), content);
});
console.log('Script done');
