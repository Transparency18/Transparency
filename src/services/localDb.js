// Initialize local storage empty, without mock data for demo purposes.
// Only setting up default structural data like phases so dropdowns work.
const defaultPhases = [
  { id: 'p1', name: 'Phase 1' },
  { id: 'p2', name: 'Phase 2' },
  { id: 'p3', name: 'Phase 3' },
  { id: 'p4', name: 'Phase 4' },
  { id: 'p5', name: 'Phase 5' },
  { id: 'p6', name: 'Phase 6' },
  { id: 's2', name: 'Sector 2' },
];

const initializeDb = () => {
  if (!localStorage.getItem('Transparency_demo_v18_initialized')) {
    localStorage.setItem('phases', JSON.stringify(defaultPhases));

    // Add some dummy data so dashboard isn't completely empty
    // Generate 30 street lights
    const dummyInfrastructure = Array.from({ length: 30 }, (_, i) => ({
      id: `INF-${100 + i}`,
      name: `Street Light ${i + 1}`,
      type: 'Streetlight',
      phase: i < 10 ? 'p1' : i < 20 ? 'p2' : 'p3',
      location: `Pole ${i + 1}`,
      status: i < 27 ? 'Working' : 'Faulty'
    }));

    const dummyExpenses = Array.from({ length: 12 }, (_, i) => ({
      id: `EXP-${1000 + i}`, title: `Maintenance Work ${i + 1}`, category: i % 2 === 0 ? 'Maintenance' : 'Repairs', amount: 5000 + (i * 1500), date: new Date().toISOString().split('T')[0], phase: i < 5 ? 'p1' : 'p2', approvedBy: 'Admin'
    }));

    const indianNames = ['Aarav Patel', 'Diya Sharma', 'Rohan Verma', 'Ananya Gupta', 'Vikram Singh', 'Priya Reddy', 'Arjun Kumar', 'Kavya Rao', 'Siddharth Desai', 'Neha Joshi', 'Aditya Iyer', 'Pooja Nair', 'Karan Mehta', 'Riya Chawla', 'Rahul Menon'];

    const dummyPayments = Array.from({ length: 15 }, (_, i) => ({
      id: `PAY-${1000 + i}`, houseId: `A-${100 + i}`, type: 'Maintenance', amount: 3500, date: new Date().toISOString().split('T')[0], status: i % 3 === 0 ? 'Pending' : 'Paid', phase: i < 7 ? 'p1' : 'p2', residentName: indianNames[i % indianNames.length]
    }));

    const dummyPatrols = Array.from({ length: 10 }, (_, i) => ({
      id: `PAT-${1000 + i}`, guard: i % 2 === 0 ? 'Ramu' : 'Shyam', route: `Route ${i + 1}`, status: i === 9 ? 'Missed / Incomplete' : 'Completed', date: new Date().toISOString().split('T')[0], startTime: `${10 + i}:00`, endTime: `${11 + i}:00`, phase: i < 5 ? 'p1' : 'p2'
    }));

    // Generate 40 cameras: 35 working, 5 faulty
    const dummyCameras = Array.from({ length: 40 }, (_, i) => ({
      id: `CAM-${String(i + 1).padStart(3, '0')}`,
      name: `Camera ${i + 1}`,
      location: `Location ${i + 1}`,
      type: i % 2 === 0 ? 'Bullet' : 'Dome',
      status: i < 35 ? 'Working' : 'Not Working',
      phase: i < 15 ? 'p1' : i < 25 ? 'p2' : 'p3'
    }));

    const dummyIssues = Array.from({ length: 10 }, (_, i) => ({
      id: `ISS-${101 + i}`, category: i % 2 === 0 ? 'Suspicious Activity' : 'Infrastructure', description: `Issue report ${i + 1}`, priority: i % 3 === 0 ? 'High' : 'Normal', status: i < 3 ? 'Open' : (i < 6 ? 'In Progress' : 'Resolved'), phase: i < 5 ? 'p1' : 'p2', reportedBy: 'Admin', date: new Date().toISOString().split('T')[0]
    }));

    const dummyVisitors = Array.from({ length: 12 }, (_, i) => ({
      id: `V-${1000 + i}`, name: `Visitor ${i + 1}`, mobile: `987654321${i}`, hostHouse: `A-${101 + i}`, purpose: i % 2 === 0 ? 'Delivery' : 'Guest', vehicleNumber: i % 3 === 0 ? '' : `KA-01-AB-123${i}`, gate: 'Main gate', phase: i < 6 ? 'p1' : 'p2', sector: 's2', entryTime: `10:${10 + i}`, exitTime: i < 5 ? null : `11:${10 + i}`, status: i < 5 ? 'Inside' : (i === 11 ? 'Pre-approved' : 'Exited')
    }));

    const dummyAnnouncements = Array.from({ length: 10 }, (_, i) => ({
      id: `ANN-${101 + i}`, title: `Announcement ${i + 1}`, content: `This is the detailed content for announcement ${i + 1}.`, target: i % 2 === 0 ? 'All Residents' : 'Phase 1 Only', priority: i % 3 === 0 ? 'High' : 'Normal', date: new Date().toISOString()
    }));

    const dummyVehicles = Array.from({ length: 12 }, (_, i) => ({
      id: `VEH-${1000 + i}`, owner: `Owner ${i + 1}`, houseId: `A-${101 + i}`, type: i % 2 === 0 ? 'Car' : 'Two-Wheeler', number: `KA-0${i}-XY-123${i}`, makeModel: i % 2 === 0 ? 'Honda City' : 'Activa', phase: i < 6 ? 'p1' : 'p2', sector: 's2', date: new Date().toISOString().split('T')[0]
    }));

    const dummyCommittee = Array.from({ length: 10 }, (_, i) => ({
      id: `COM-${101 + i}`, name: `Committee Member ${i + 1}`, role: i === 0 ? 'President' : (i === 1 ? 'Secretary' : 'Member'), contact: `998877665${i}`, phase: i < 5 ? 'p1' : 'p2', sector: 's2'
    }));

    const dummyServiceProviders = [
      { id: 'SRV-101', name: 'Ramesh (Tank Cleaner)', serviceType: 'Tank Cleaner', contact: '9876543210', verified: true, phase: 'All' },
      { id: 'SRV-102', name: 'Suresh (Garden Cleaning)', serviceType: 'Garden Cleaning', contact: '9876543211', verified: true, phase: 'All' },
      { id: 'SRV-103', name: 'Mahesh (Electrician)', serviceType: 'Electrician', contact: '9876543212', verified: true, phase: 'All' },
      { id: 'SRV-104', name: 'Kamlesh (Plumber)', serviceType: 'Plumber', contact: '9876543213', verified: false, phase: 'All' },
      { id: 'SRV-105', name: 'Gita (Maid)', serviceType: 'Maid', contact: '9876543214', verified: true, phase: 'All' }
    ];

    localStorage.setItem('cameras', JSON.stringify(dummyCameras));
    localStorage.setItem('securityIssues', JSON.stringify(dummyIssues));
    localStorage.setItem('visitors', JSON.stringify(dummyVisitors));
    localStorage.setItem('payments', JSON.stringify(dummyPayments));
    localStorage.setItem('expenses', JSON.stringify(dummyExpenses));
    localStorage.setItem('announcements', JSON.stringify(dummyAnnouncements));
    localStorage.setItem('infrastructure', JSON.stringify(dummyInfrastructure));
    localStorage.setItem('vehicles', JSON.stringify(dummyVehicles));
    localStorage.setItem('patrols', JSON.stringify(dummyPatrols));
    localStorage.setItem('guards', JSON.stringify([])); // Deprecated
    localStorage.setItem('committee', JSON.stringify(dummyCommittee));
    localStorage.setItem('serviceProviders', JSON.stringify(dummyServiceProviders));
    localStorage.setItem('closedHouses', JSON.stringify([]));
    localStorage.setItem('businesses', JSON.stringify([]));
    localStorage.setItem('dashboardStats', JSON.stringify({}));
    const dummyUsers = Array.from({ length: 25 }, (_, i) => {
      const name = indianNames[(i + 15) % indianNames.length];
      return {
        id: `USR-${101 + i}`,
        name: name,
        email: `${name.split(' ')[0].toLowerCase()}@example.com`,
        role: i < 2 ? 'Volunteer' : (i < 12 ? 'Guard' : 'Resident'),
        phase: i % 2 === 0 ? 'p1' : 'p2',
        sector: 's2',
        contact: `987654321${i}`,
        shift: (i >= 2 && i < 12) ? (i % 2 === 0 ? 'Day' : 'Night') : undefined
      };
    });

    localStorage.setItem('users', JSON.stringify(dummyUsers));
    localStorage.setItem('Transparency_demo_v18_initialized', 'true');
  }
};

initializeDb();

export const localDb = {
  get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  deleteItem: (key, id) => {
    const items = localDb.get(key);
    localDb.set(key, items.filter(item => item.id !== id));
  },

  // Specific entity helpers
  getVisitors: () => localDb.get('visitors'),
  addVisitor: (visitor) => {
    const visitors = localDb.get('visitors');
    const newVisitor = { ...visitor, id: `V-${1000 + visitors.length + 1}` };
    localDb.set('visitors', [newVisitor, ...visitors]);
    return newVisitor;
  },
  updateVisitor: (id, updates) => {
    const visitors = localDb.get('visitors');
    const index = visitors.findIndex(v => v.id === id);
    if (index > -1) {
      visitors[index] = { ...visitors[index], ...updates };
      localDb.set('visitors', visitors);
    }
  },

  getCameras: () => localDb.get('cameras'),
  addCamera: (camera) => {
    const cameras = localDb.get('cameras');
    const newCamera = { ...camera, id: `CAM-${String(cameras.length + 1).padStart(3, '0')}` };
    localDb.set('cameras', [newCamera, ...cameras]);
    return newCamera;
  },
  updateCamera: (id, updates) => {
    const cameras = localDb.get('cameras');
    const index = cameras.findIndex(c => c.id === id);
    if (index > -1) {
      cameras[index] = { ...cameras[index], ...updates };
      localDb.set('cameras', cameras);
    }
  },
  deleteCamera: (id) => localDb.deleteItem('cameras', id),

  getSecurityIssues: () => localDb.get('securityIssues'),
  addSecurityIssue: (issue) => {
    const issues = localDb.get('securityIssues');
    const newIssue = { ...issue, id: `ISS-${100 + issues.length + 1}` };
    localDb.set('securityIssues', [newIssue, ...issues]);
    return newIssue;
  },
  updateSecurityIssue: (id, updates) => {
    const issues = localDb.get('securityIssues');
    const index = issues.findIndex(i => i.id === id);
    if (index > -1) {
      issues[index] = { ...issues[index], ...updates };
      localDb.set('securityIssues', issues);
    }
  },
  deleteSecurityIssue: (id) => localDb.deleteItem('securityIssues', id),

  getPayments: () => localDb.get('payments'),
  addPayment: (payment) => {
    const payments = localDb.get('payments');
    const newPayment = { ...payment, id: `PAY-${1000 + payments.length + 1}` };
    localDb.set('payments', [newPayment, ...payments]);
    return newPayment;
  },
  updatePayment: (id, updates) => {
    const payments = localDb.get('payments');
    const index = payments.findIndex(p => p.id === id);
    if (index > -1) {
      payments[index] = { ...payments[index], ...updates };
      localDb.set('payments', payments);
    }
  },

  getExpenses: () => localDb.get('expenses'),
  addExpense: (expense) => {
    const expenses = localDb.get('expenses');
    const newExpense = { ...expense, id: `EXP-${1000 + expenses.length + 1}` };
    localDb.set('expenses', [newExpense, ...expenses]);
    return newExpense;
  },

  getAnnouncements: () => localDb.get('announcements'),
  addAnnouncement: (announcement) => {
    const announcements = localDb.get('announcements');
    const newAnnouncement = { ...announcement, id: `ANN-${100 + announcements.length + 1}`, date: new Date().toISOString() };
    localDb.set('announcements', [newAnnouncement, ...announcements]);
    return newAnnouncement;
  },

  getInfrastructure: () => localDb.get('infrastructure'),
  addInfrastructure: (item) => {
    const items = localDb.get('infrastructure');
    const newItem = { ...item, id: `INF-${100 + items.length + 1}` };
    localDb.set('infrastructure', [newItem, ...items]);
    return newItem;
  },
  updateInfrastructure: (id, updates) => {
    const items = localDb.get('infrastructure');
    const index = items.findIndex(i => i.id === id);
    if (index > -1) {
      items[index] = { ...items[index], ...updates };
      localDb.set('infrastructure', items);
    }
  },
  deleteInfrastructure: (id) => localDb.deleteItem('infrastructure', id),

  getVehicles: () => localDb.get('vehicles'),
  addVehicle: (vehicle) => {
    const vehicles = localDb.get('vehicles');
    const newVehicle = { ...vehicle, id: `VEH-${1000 + vehicles.length + 1}`, date: new Date().toISOString().split('T')[0] };
    localDb.set('vehicles', [newVehicle, ...vehicles]);
    return newVehicle;
  },
  deleteVehicle: (id) => localDb.deleteItem('vehicles', id),

  getGuards: () => localDb.get('guards'),
  addGuard: (guard) => {
    const guards = localDb.get('guards');
    const newGuard = { ...guard, id: `GRD-${100 + guards.length + 1}` };
    localDb.set('guards', [newGuard, ...guards]);
    return newGuard;
  },
  deleteGuard: (id) => localDb.deleteItem('guards', id),

  getPatrols: () => localDb.get('patrols'),
  addPatrol: (patrol) => {
    const patrols = localDb.get('patrols');
    const newPatrol = { ...patrol, id: `PAT-${1000 + patrols.length + 1}`, date: new Date().toISOString().split('T')[0] };
    localDb.set('patrols', [newPatrol, ...patrols]);
    return newPatrol;
  },
  deletePatrol: (id) => localDb.deleteItem('patrols', id),

  getUsers: () => localDb.get('users'),
  addUser: (user) => {
    const users = localDb.get('users');
    const newUser = { ...user, id: `USR-${100 + users.length + 1}` };
    localDb.set('users', [newUser, ...users]);
    return newUser;
  },
  deleteUser: (id) => localDb.deleteItem('users', id),

  getCommittee: () => localDb.get('committee'),
  addCommitteeMember: (member) => {
    const members = localDb.get('committee');
    const newMember = { ...member, id: `COM-${100 + members.length + 1}` };
    localDb.set('committee', [newMember, ...members]);
    return newMember;
  },
  deleteCommitteeMember: (id) => localDb.deleteItem('committee', id),

  getServiceProviders: () => localDb.get('serviceProviders'),
  addServiceProvider: (provider) => {
    const providers = localDb.get('serviceProviders');
    const newProvider = { ...provider, id: `SRV-${100 + providers.length + 1}` };
    localDb.set('serviceProviders', [newProvider, ...providers]);
    return newProvider;
  },
  deleteServiceProvider: (id) => localDb.deleteItem('serviceProviders', id),

  getClosedHouses: () => localDb.get('closedHouses'),
  addClosedHouse: (closedHouse) => {
    const closedHouses = localDb.get('closedHouses');
    const newClosedHouse = { ...closedHouse, id: `CH-${100 + closedHouses.length + 1}` };
    localDb.set('closedHouses', [newClosedHouse, ...closedHouses]);
    return newClosedHouse;
  },
  deleteClosedHouse: (id) => localDb.deleteItem('closedHouses', id),

  getBusinesses: () => localDb.get('businesses'),
  addBusiness: (business) => {
    const businesses = localDb.get('businesses');
    const newBusiness = { ...business, id: `BUS-${100 + businesses.length + 1}`, status: 'Pending' };
    localDb.set('businesses', [newBusiness, ...businesses]);
    return newBusiness;
  },
  updateBusiness: (id, updates) => {
    const businesses = localDb.get('businesses');
    const index = businesses.findIndex(b => b.id === id);
    if (index > -1) {
      businesses[index] = { ...businesses[index], ...updates };
      localDb.set('businesses', businesses);
    }
  },
  deleteBusiness: (id) => localDb.deleteItem('businesses', id),

  getDashboardStats: (phaseFilter = 'All') => {
    let visitors = localDb.get('visitors');
    let cameras = localDb.get('cameras');
    let issues = localDb.get('securityIssues');
    let payments = localDb.get('payments');
    let expenses = localDb.get('expenses');
    let vehicles = localDb.get('vehicles');
    let patrols = localDb.get('patrols');
    let infrastructure = localDb.get('infrastructure');
    let users = localDb.get('users');

    if (phaseFilter !== 'All') {
      visitors = visitors.filter(v => v.phase === phaseFilter || !v.phase);
      cameras = cameras.filter(c => c.phase === phaseFilter);
      issues = issues.filter(i => i.phase === phaseFilter || !i.phase);
      payments = payments.filter(p => p.phase === phaseFilter || !p.phase);
      expenses = expenses.filter(e => e.phase === phaseFilter || !e.phase);
      vehicles = vehicles.filter(v => v.phase === phaseFilter || !v.phase);
      patrols = patrols.filter(p => p.phase === phaseFilter || !p.phase);
      infrastructure = infrastructure.filter(i => i.phase === phaseFilter || !i.phase);
      users = users.filter(u => u.phase === phaseFilter || !u.phase);
    }

    const activeIssues = issues.filter(i => i.status === "Open" || i.status === "In Progress").length;
    const faultyCameras = cameras.filter(c => c.status === "Not Working").length;
    const visitorsToday = visitors.filter(v => v.status === "Inside" || v.status === "Exited").length;

    const totalCollected = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + Number(p.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const pendingPayments = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + Number(p.amount), 0);
    const savingsAmount = totalCollected - totalExpenses;

    const streetLightsCount = infrastructure.filter(i => i.type === 'Streetlight').length;

    // Calculate dynamic 7-day visitor trend
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const visitorTrend = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : days[d.getDay()];

      const count = visitors.filter(v => {
        const vDate = v.date || todayStr; // Assume missing date is today
        return vDate === dateStr;
      }).length;

      visitorTrend.push({ name: dayName, visitors: count });
    }

    // Calculate dynamic CCTV data
    let workingCameras = 0;

    if (cameras.length > 0) {
      workingCameras = cameras.length - faultyCameras;
    }

    const cctvTrend = cameras.length === 0
      ? [{ name: 'No of Cameras', value: 1, color: '#e5e7eb' }]
      : [
        { name: 'Working', value: workingCameras, color: '#22c55e' },
        { name: 'Faulty', value: faultyCameras, color: '#ef4444' },
      ];

    const patrolsCompleted = patrols.filter(p => p.status === 'Completed').length;

    return {
      visitorsToday,
      vehiclesToday: vehicles.length, // Showing registered vehicles as 'Vehicles Today'
      activeSecurityIssues: activeIssues,
      totalCameras: cameras.length,
      camerasNotWorking: faultyCameras,
      streetLightsNotWorking: 0,
      patrolsCompleted: patrolsCompleted,
      totalPatrols: patrols.length,
      vacantHouses: 0,
      totalCollected,
      totalExpenses,
      pendingPayments,
      savingsAmount,
      streetLightsCount,
      totalGuards: users.filter(u => u.role === 'Guard').length,
      totalVolunteers: users.filter(u => u.role === 'Volunteer').length,
      totalServices: localDb.get('serviceProviders').length,
      visitorTrend,
      cctvTrend
    };
  }
};

