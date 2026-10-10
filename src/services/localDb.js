// Phases are structural data (used by dropdowns), not demo data.
const defaultPhases = [
  { id: 'p1', name: 'Phase 1' },
  { id: 'p2', name: 'Phase 2' },
  { id: 'p3', name: 'Phase 3' },
  { id: 'p4', name: 'Phase 4' },
  { id: 'p5', name: 'Phase 5' },
  { id: 'p6', name: 'Phase 6' },
  { id: 's2', name: 'Sector 2' },
];

// Every list starts empty; data comes only from what users add.
// Changing DB_VERSION_KEY wipes older browser copies (which held demo data).
const DB_VERSION_KEY = 'Transparency_db_v19_initialized';
const COLLECTIONS = [
  'securityIssues', 'visitors', 'payments', 'expenses', 'announcements',
  'infrastructure', 'vehicles', 'patrols', 'guards', 'committee', 'serviceProviders',
  'closedHouses', 'businesses', 'users',
];

const initializeDb = () => {
  if (!localStorage.getItem(DB_VERSION_KEY)) {
    localStorage.removeItem('Transparency_demo_v18_initialized');
    localStorage.removeItem('dashboardStats');
    localStorage.setItem('phases', JSON.stringify(defaultPhases));
    COLLECTIONS.forEach((key) => localStorage.setItem(key, JSON.stringify([])));
    localStorage.setItem(DB_VERSION_KEY, 'true');
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
    let issues = localDb.get('securityIssues');
    let payments = localDb.get('payments');
    let expenses = localDb.get('expenses');
    let vehicles = localDb.get('vehicles');
    let patrols = localDb.get('patrols');
    let infrastructure = localDb.get('infrastructure');
    let users = localDb.get('users');

    if (phaseFilter !== 'All') {
      visitors = visitors.filter(v => v.phase === phaseFilter || !v.phase);
      issues = issues.filter(i => i.phase === phaseFilter || !i.phase);
      payments = payments.filter(p => p.phase === phaseFilter || !p.phase);
      expenses = expenses.filter(e => e.phase === phaseFilter || !e.phase);
      vehicles = vehicles.filter(v => v.phase === phaseFilter || !v.phase);
      patrols = patrols.filter(p => p.phase === phaseFilter || !p.phase);
      infrastructure = infrastructure.filter(i => i.phase === phaseFilter || !i.phase);
      users = users.filter(u => u.phase === phaseFilter || !u.phase);
    }

    const activeIssues = issues.filter(i => i.status === "Open" || i.status === "In Progress").length;
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

    const patrolsCompleted = patrols.filter(p => p.status === 'Completed').length;

    return {
      visitorsToday,
      vehiclesToday: vehicles.length, // Showing registered vehicles as 'Vehicles Today'
      activeSecurityIssues: activeIssues,
      streetLightsNotWorking: 0,
      patrolsCompleted: patrolsCompleted,
      totalPatrols: patrols.length,
      vacantHouses: 0,
      totalCollected,
      totalExpenses,
      pendingPayments,
      savingsAmount,
      streetLightsCount,
      totalVolunteers: users.filter(u => u.role === 'Volunteer').length,
      totalServices: localDb.get('serviceProviders').length,
      visitorTrend
    };
  }
};

