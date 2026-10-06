const fs = require('fs');

// 1. Update mockData.js
let mockData = fs.readFileSync('./src/data/mockData.js', 'utf8');
mockData = mockData.replace("'Resident John'", "'Aarav Patel'");
mockData = mockData.replace("'John Doe'", "'Aarav Patel'");
mockData = mockData.replace("'Jane Smith'", "'Diya Sharma'");
mockData = mockData.replace("'Bob Johnson'", "'Rohan Verma'");
fs.writeFileSync('./src/data/mockData.js', mockData);

// 2. Update localDb.js
let localDb = fs.readFileSync('./src/services/localDb.js', 'utf8');

const replacement = `const indianNames = ['Aarav Patel', 'Diya Sharma', 'Rohan Verma', 'Ananya Gupta', 'Vikram Singh', 'Priya Reddy', 'Arjun Kumar', 'Kavya Rao', 'Siddharth Desai', 'Neha Joshi', 'Aditya Iyer', 'Pooja Nair', 'Karan Mehta', 'Riya Chawla', 'Rahul Menon'];

    const dummyPayments = Array.from({ length: 15 }, (_, i) => ({
      id: \`PAY-\${1000 + i}\`, houseId: \`A-\${100 + i}\`, type: 'Maintenance', amount: 3500, date: new Date().toISOString().split('T')[0], status: i % 3 === 0 ? 'Pending' : 'Paid', phase: i < 7 ? 'p1' : 'p2', residentName: indianNames[i % indianNames.length]
    }));`;

localDb = localDb.replace(
  /const dummyPayments = Array\.from\(\{ length: 15 \}, \(_, i\) => \(\{\n\s+id: `PAY-\$\{1000 \+ i\}`(.*?)residentName: `Resident \$\{i \+ 1\}`\n\s+\}\)\);/s,
  replacement
);

fs.writeFileSync('./src/services/localDb.js', localDb);
console.log('Done');
