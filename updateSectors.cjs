const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('phases.map')) {
    // 1. Add sectors to import
    if (content.includes('import { phases } from')) {
      content = content.replace('import { phases } from "../data/mockData"', 'import { phases, sectors } from "../data/mockData"');
    } else if (content.includes('import { phases, sectors } from')) {
      // already there
    } else if (content.includes('import {') && content.includes('phases') && content.includes('mockData')) {
      content = content.replace('phases', 'phases, sectors');
    }

    // 2. Add sector to formData
    // E.g., phase: 'p1' -> phase: 'p1', sector: ''
    // Need to handle both useState and setFormData
    content = content.replace(/phase: ['"]p1['"]/g, "phase: 'p1', sector: ''");
    content = content.replace(/phase: ['"]All['"]/g, "phase: 'All', sector: ''");

    // 3. Add sector dropdown in the JSX next to phase
    // Find where the phase select is.
    const phaseSelectRegex = /<select[^>]*value=\{formData\.phase\}[^>]*>[\s\S]*?<\/select>/g;
    
    content = content.replace(phaseSelectRegex, (match) => {
      // Create the sector select
      const sectorSelect = `
          </div>
          <div className="space-y-1 mt-4">
            <label className="text-sm font-medium text-gray-700">Sector (Optional)</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.sector || ''} onChange={e => setFormData({...formData, sector: e.target.value})}>
              <option value="">None / All Sectors</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>`;
      
      // We will just append the sector select after the phase select. 
      // But they are usually wrapped in some divs. If we just place it after, it might break flex/grid layouts.
      // Most forms use <div className="space-y-1"> for labels, or just put them directly.
      // If it's just raw <select> without wrapper (like ServicesPage):
      let replacement = match;
      if (match.includes('border-gray-300 rounded-lg')) {
        replacement = match + sectorSelect;
      } else {
        // Services/Guards page format
        replacement = match + `\n          <select className="w-full border rounded p-2 mt-4" value={formData.sector || ''} onChange={e => setFormData({...formData, sector: e.target.value})}>\n            <option value="">None / All Sectors</option>\n            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}\n          </select>`;
      }
      return replacement;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
}
