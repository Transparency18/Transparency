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
  
  if (content.includes('const matchesPhase = phase === "All" ||')) {
    content = content.replace(
      /const matchesPhase = phase === "All" \|\| (.*?);/g, 
      'const matchesPhase = phase === "All" || $1;\n    const matchesSector = sector === "All" || !$1.sector || $1.sector === sector;'
    );
    content = content.replace(/return (.*?matchesPhase.*?);/g, (match, p1) => {
      if (!p1.includes('matchesSector')) {
        return 'return ' + p1 + ' && matchesSector;';
      }
      return match;
    });
    content = content.replace(/const matchesPhase = phase === "All" \|\| (\w+)\.phase === phase;\n    const matchesSector = sector === "All" \|\| !\$1\.sector \|\| \$1\.sector === sector;/g, 
      'const matchesPhase = phase === "All" || $1.phase === phase;\n    const matchesSector = sector === "All" || !$1.sector || $1.sector === sector;'
    );
  }
  
  // also inject sectors into mockData imports if phases is there
  if (content.includes('import { phases } from "../data/mockData"')) {
      content = content.replace('import { phases } from "../data/mockData"', 'import { phases, sectors } from "../data/mockData"');
  } else if (content.includes('import { phases, sectors } from "../data/mockData"')) {
      // do nothing
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
