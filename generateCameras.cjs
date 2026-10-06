const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

const phases = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
const locations = ['Main Gate', 'Gate 2', 'Cross 1', 'Cross 2', 'Park', 'Clubhouse', 'Perimeter Wall', 'Sector A Entrance', 'Sector B Exit', 'Phase Border'];
const types = ['PTZ', 'Bullet', 'Dome'];
const statuses = ['Working', 'Working', 'Working', 'Working', 'Not Working', 'Under Maintenance'];

let cameras = [];
for (let i = 1; i <= 42; i++) {
  const phase = phases[Math.floor(Math.random() * phases.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Random date in the last year
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  const dateStr = date.toISOString().split('T')[0];

  const id = `CAM-${i.toString().padStart(3, '0')}`;
  const name = `${location} Cam ${i}`;

  cameras.push(`  { id: '${id}', name: '${name}', phase: '${phase}', location: '${location}', type: '${type}', status: '${status}', lastMaintenance: '${dateStr}' },`);
}

const camerasReplacement = `export const cameras = [\n${cameras.join('\n')}\n];`;

const newContent = content.replace(/export const cameras = \[[^\]]*\];/s, camerasReplacement);

fs.writeFileSync(mockDataPath, newContent, 'utf8');
console.log('Added 42 cameras');
