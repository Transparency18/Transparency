const fs = require('fs');
const path = require('path');

function removeSectors(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeSectors(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // House ID to Villa Number (case insensitive but preserving casing where possible? Usually it's "House ID" or "houseId")
      content = content.replace(/House ID/g, 'Villa Number');
      content = content.replace(/House Id/g, 'Villa Number');
      content = content.replace(/house id/g, 'villa number');
      content = content.replace(/House id/g, 'Villa number');

      // mockData.js changes
      if (file === 'mockData.js') {
        content = content.replace(/export const sectors = \[[\s\S]*?\];/g, '');
        if (!content.includes('Sector 2')) {
          content = content.replace(/\{ id: 'p6', name: 'Phase 6', houses: 90, residents: 250 \},/g, `{ id: 'p6', name: 'Phase 6', houses: 90, residents: 250 },\n  { id: 's2', name: 'Sector 2 (Phase 7)', houses: 75, residents: 200 },`);
        }
      }

      // Remove import of 'sectors'
      content = content.replace(/,\s*sectors/g, '');
      content = content.replace(/sectors,\s*/g, '');

      // Remove exact duplicate Sector block 1
      content = content.replace(/          <div className="space-y-1 mt-4">\s*<label className="text-sm font-medium text-gray-700">Sector \(Optional\)<\/label>\s*<select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value=\{formData\.sector \|\| ''\} onChange=\{e => setFormData\(\{\.\.\.formData, sector: e\.target\.value\}\)\}>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>\s*<\/div>\n/g, '');

      // Remove the second exact duplicate block that had an extra `</div>` or no `</div>`
      content = content.replace(/          <div className="space-y-1 mt-4">\s*<label className="text-sm font-medium text-gray-700">Sector \(Optional\)<\/label>\s*<select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value=\{formData\.sector \|\| ''\} onChange=\{e => setFormData\(\{\.\.\.formData, sector: e\.target\.value\}\)\}>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>\s*<\/div>\s*<\/div>\n/g, '');

      // For VisitorManagementPage Pre-approve form (preapproveData)
      content = content.replace(/          <div className="space-y-1">\s*<label className="text-sm font-medium text-gray-700">Sector \(Optional\)<\/label>\s*<select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value=\{preapproveData\.sector \|\| ''\} onChange=\{e => setPreapproveData\(\{\.\.\.preapproveData, sector: e\.target\.value\}\)\}>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>\s*<\/div>\n/g, '');

      // For generic filters (ServicesPage, UserManagementPage, etc.)
      content = content.replace(/          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value=\{sectorFilter\} onChange=\{e => setSectorFilter\(e\.target\.value\)\}>\s*<option value="All">All Phases \/ Sectors \(Optional\)<\/option>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>\n/g, '');

      content = content.replace(/          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value=\{sectorFilter\} onChange=\{e => setSectorFilter\(e\.target\.value\)\}>\s*<option value="All">All Sectors<\/option>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>\n/g, '');

      content = content.replace(/        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value=\{sectorFilter\} onChange=\{e => setSectorFilter\(e\.target\.value\)\}>\s*<option value="All">All Sectors<\/option>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>\n/g, '');

      // Any remaining standalone select blocks (like in VehiclesPage)
      content = content.replace(/\s*<select[^>]*value=\{[a-zA-Z]+Filter\}[^>]*onChange=\{e => set[a-zA-Z]+Filter\(e\.target\.value\)\}>\s*<option value="All">All Sectors<\/option>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>/g, '');
      content = content.replace(/\s*<select[^>]*value=\{sectorFilter\}[^>]*onChange=\{e => setSectorFilter\(e\.target\.value\)\}>\s*<option value="All">All Phases \/ Sectors \(Optional\)<\/option>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>/g, '');
      content = content.replace(/\s*<select[^>]*value=\{sectorFilter\}[^>]*onChange=\{e => setSectorFilter\(e\.target\.value\)\}>\s*<option value="All">All Sectors<\/option>\s*<option value="">None \/ All Sectors<\/option>\s*\{sectors\.map\(s => <option key=\{s\.id\} value=\{s\.id\}>\{s\.name\}<\/option>\)\}\s*<\/select>/g, '');

      // Remove inline sector display logic
      content = content.replace(/ \{sectors\.find\(s => s\.id === [a-zA-Z0-9_.]+\.sector\)\?\.name \|\| [a-zA-Z0-9_.]+\.sector\}/g, '');
      content = content.replace(/\{issue\.sector && <span className="ml-1 text-gray-500">\/ <\/span>\}/g, '');
      content = content.replace(/\{p\.sector && <span className="ml-1 text-gray-500">\/ <\/span>\}/g, '');
      content = content.replace(/\{u\.sector && ` - `\}/g, '');
      content = content.replace(/\{v\.sector && <span className="ml-1 text-gray-500">\/ <\/span>\}/g, '');

      // Remove `sectorFilter` and `sector` from state and props
      content = content.replace(/, sectorFilter/g, '');
      content = content.replace(/sectorFilter, /g, '');
      content = content.replace(/, setSectorFilter/g, '');
      content = content.replace(/const \[sectorFilter, setSectorFilter\] = useState\("All"\);\n/g, '');
      content = content.replace(/const \[sectorFilter, setSectorFilter\] = useState\('All'\);\n/g, '');
      content = content.replace(/sector: '', /g, '');
      content = content.replace(/, sector: ''/g, '');

      // Cleanup broken jsx
      content = content.replace(/\{issue\.sector && <span className="ml-1 text-gray-500">\/ \{issue\.sector\}<\/span>\}/g, '');

      // Manual fixes for specific files since regex might miss some
      if (file === 'UserManagementPage.jsx') {
        content = content.replace(/\{u\.sector && ` - \$\{u\.sector\}`\}/g, '');
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

removeSectors(path.join(__dirname, 'src'));
removeSectors(path.join(__dirname, 'src', 'data'));
