export const phases = [
  { id: 'p1', name: 'Phase 1', houses: 120, residents: 340 },
  { id: 'p2', name: 'Phase 2', houses: 85, residents: 210 },
  { id: 'p3', name: 'Phase 3', houses: 200, residents: 600 },
  { id: 'p4', name: 'Phase 4', houses: 150, residents: 450 },
  { id: 'p5', name: 'Phase 5', houses: 110, residents: 320 },
  { id: 'p6', name: 'Phase 6', houses: 90, residents: 250 },
  { id: 's2', name: 'Sector 2', houses: 75, residents: 200 },
];



export const cameras = [
  { id: 'CAM-001', name: 'Sector B Exit Cam 1', phase: 'p2', location: 'Sector B Exit', type: 'Dome', status: 'Working', lastMaintenance: '2026-05-05' },
  { id: 'CAM-002', name: 'Cross 1 Cam 2', phase: 'p4', location: 'Cross 1', type: 'PTZ', status: 'Under Maintenance', lastMaintenance: '2026-01-06' },
  { id: 'CAM-003', name: 'Phase Border Cam 3', phase: 'p5', location: 'Phase Border', type: 'PTZ', status: 'Working', lastMaintenance: '2026-08-02' },
  { id: 'CAM-004', name: 'Sector B Exit Cam 4', phase: 'p4', location: 'Sector B Exit', type: 'Dome', status: 'Working', lastMaintenance: '2026-02-28' },
  { id: 'CAM-005', name: 'Clubhouse Cam 5', phase: 'p1', location: 'Clubhouse', type: 'Bullet', status: 'Working', lastMaintenance: '2026-09-11' },
  { id: 'CAM-006', name: 'Park Cam 6', phase: 'p6', location: 'Park', type: 'Bullet', status: 'Working', lastMaintenance: '2026-09-17' },
  { id: 'CAM-007', name: 'Gate 2 Cam 7', phase: 'p4', location: 'Gate 2', type: 'PTZ', status: 'Working', lastMaintenance: '2026-03-04' },
  { id: 'CAM-008', name: 'Sector B Exit Cam 8', phase: 'p1', location: 'Sector B Exit', type: 'PTZ', status: 'Working', lastMaintenance: '2026-07-07' },
  { id: 'CAM-009', name: 'Perimeter Wall Cam 9', phase: 'p6', location: 'Perimeter Wall', type: 'Bullet', status: 'Under Maintenance', lastMaintenance: '2026-07-21' },
  { id: 'CAM-010', name: 'Sector B Exit Cam 10', phase: 'p6', location: 'Sector B Exit', type: 'PTZ', status: 'Not Working', lastMaintenance: '2026-09-26' },
  { id: 'CAM-011', name: 'Gate 2 Cam 11', phase: 'p1', location: 'Gate 2', type: 'Dome', status: 'Working', lastMaintenance: '2025-12-12' },
  { id: 'CAM-012', name: 'Gate 2 Cam 12', phase: 'p6', location: 'Gate 2', type: 'PTZ', status: 'Working', lastMaintenance: '2026-08-04' },
  { id: 'CAM-013', name: 'Phase Border Cam 13', phase: 'p4', location: 'Phase Border', type: 'Dome', status: 'Working', lastMaintenance: '2026-04-04' },
  { id: 'CAM-014', name: 'Sector A Entrance Cam 14', phase: 'p1', location: 'Sector A Entrance', type: 'PTZ', status: 'Under Maintenance', lastMaintenance: '2026-05-12' },
  { id: 'CAM-015', name: 'Cross 1 Cam 15', phase: 'p4', location: 'Cross 1', type: 'Dome', status: 'Under Maintenance', lastMaintenance: '2025-11-07' },
  { id: 'CAM-016', name: 'Cross 1 Cam 16', phase: 'p1', location: 'Cross 1', type: 'Dome', status: 'Under Maintenance', lastMaintenance: '2026-01-29' },
  { id: 'CAM-017', name: 'Gate 2 Cam 17', phase: 'p1', location: 'Gate 2', type: 'PTZ', status: 'Working', lastMaintenance: '2026-06-19' },
  { id: 'CAM-018', name: 'Main Gate Cam 18', phase: 'p3', location: 'Main Gate', type: 'PTZ', status: 'Not Working', lastMaintenance: '2026-04-24' },
  { id: 'CAM-019', name: 'Sector B Exit Cam 19', phase: 'p1', location: 'Sector B Exit', type: 'Dome', status: 'Not Working', lastMaintenance: '2025-12-26' },
  { id: 'CAM-020', name: 'Cross 2 Cam 20', phase: 'p3', location: 'Cross 2', type: 'Bullet', status: 'Working', lastMaintenance: '2025-11-25' },
  { id: 'CAM-021', name: 'Gate 2 Cam 21', phase: 'p2', location: 'Gate 2', type: 'PTZ', status: 'Under Maintenance', lastMaintenance: '2026-06-17' },
  { id: 'CAM-022', name: 'Sector B Exit Cam 22', phase: 'p4', location: 'Sector B Exit', type: 'Dome', status: 'Working', lastMaintenance: '2026-03-26' },
  { id: 'CAM-023', name: 'Cross 1 Cam 23', phase: 'p6', location: 'Cross 1', type: 'PTZ', status: 'Under Maintenance', lastMaintenance: '2025-11-27' },
  { id: 'CAM-024', name: 'Perimeter Wall Cam 24', phase: 'p6', location: 'Perimeter Wall', type: 'Dome', status: 'Not Working', lastMaintenance: '2025-12-27' },
  { id: 'CAM-025', name: 'Sector B Exit Cam 25', phase: 'p1', location: 'Sector B Exit', type: 'Bullet', status: 'Working', lastMaintenance: '2026-09-27' },
  { id: 'CAM-026', name: 'Sector A Entrance Cam 26', phase: 'p2', location: 'Sector A Entrance', type: 'Bullet', status: 'Working', lastMaintenance: '2026-03-22' },
  { id: 'CAM-027', name: 'Main Gate Cam 27', phase: 'p2', location: 'Main Gate', type: 'Dome', status: 'Working', lastMaintenance: '2026-02-17' },
  { id: 'CAM-028', name: 'Perimeter Wall Cam 28', phase: 'p6', location: 'Perimeter Wall', type: 'Bullet', status: 'Under Maintenance', lastMaintenance: '2026-03-23' },
  { id: 'CAM-029', name: 'Sector A Entrance Cam 29', phase: 'p6', location: 'Sector A Entrance', type: 'PTZ', status: 'Not Working', lastMaintenance: '2026-06-18' },
  { id: 'CAM-030', name: 'Sector B Exit Cam 30', phase: 'p1', location: 'Sector B Exit', type: 'Bullet', status: 'Under Maintenance', lastMaintenance: '2026-09-20' },
  { id: 'CAM-031', name: 'Perimeter Wall Cam 31', phase: 'p1', location: 'Perimeter Wall', type: 'PTZ', status: 'Working', lastMaintenance: '2025-11-16' },
  { id: 'CAM-032', name: 'Sector B Exit Cam 32', phase: 'p3', location: 'Sector B Exit', type: 'PTZ', status: 'Under Maintenance', lastMaintenance: '2026-02-18' },
  { id: 'CAM-033', name: 'Cross 2 Cam 33', phase: 'p2', location: 'Cross 2', type: 'PTZ', status: 'Working', lastMaintenance: '2026-09-22' },
  { id: 'CAM-034', name: 'Clubhouse Cam 34', phase: 'p3', location: 'Clubhouse', type: 'Bullet', status: 'Under Maintenance', lastMaintenance: '2025-12-21' },
  { id: 'CAM-035', name: 'Gate 2 Cam 35', phase: 'p6', location: 'Gate 2', type: 'Bullet', status: 'Not Working', lastMaintenance: '2025-11-25' },
  { id: 'CAM-036', name: 'Phase Border Cam 36', phase: 'p2', location: 'Phase Border', type: 'PTZ', status: 'Not Working', lastMaintenance: '2026-09-22' },
  { id: 'CAM-037', name: 'Cross 1 Cam 37', phase: 'p6', location: 'Cross 1', type: 'Dome', status: 'Working', lastMaintenance: '2026-02-23' },
  { id: 'CAM-038', name: 'Perimeter Wall Cam 38', phase: 'p3', location: 'Perimeter Wall', type: 'Dome', status: 'Working', lastMaintenance: '2026-05-10' },
  { id: 'CAM-039', name: 'Gate 2 Cam 39', phase: 'p4', location: 'Gate 2', type: 'Dome', status: 'Working', lastMaintenance: '2026-01-18' },
  { id: 'CAM-040', name: 'Gate 2 Cam 40', phase: 'p5', location: 'Gate 2', type: 'Dome', status: 'Working', lastMaintenance: '2026-05-05' },
  { id: 'CAM-041', name: 'Gate 2 Cam 41', phase: 'p5', location: 'Gate 2', type: 'PTZ', status: 'Not Working', lastMaintenance: '2026-05-25' },
  { id: 'CAM-042', name: 'Phase Border Cam 42', phase: 'p1', location: 'Phase Border', type: 'PTZ', status: 'Not Working', lastMaintenance: '2026-02-02' },
];

export const securityIssues = [
  { id: 'ISS-101', category: 'Trespassing', description: 'Unauthorized person near Phase 2 boundary', phase: 'p2', priority: 'High', status: 'In Progress', reportedBy: 'Guard Smith', date: '2023-10-25' },
  { id: 'ISS-102', category: 'Vandalism', description: 'Broken street light at Sector A', phase: 'p1', priority: 'Medium', status: 'Open', reportedBy: 'Aarav Patel', date: '2023-10-26' },
  { id: 'ISS-103', category: 'Suspicious Activity', description: 'Vehicle parked for 3 days at empty plot', phase: 'p3', priority: 'Low', status: 'Resolved', reportedBy: 'Guard Alan', date: '2023-10-20' },
];

export const visitors = [
  { id: 'V-1001', name: 'Raj Kumar', mobile: '9876543210', hostHouse: 'P1-104', purpose: 'Delivery', vehicleNumber: 'KA-01-AB-1234', gate: 'Main Gate', entryTime: '10:15 AM', exitTime: '10:30 AM', status: 'Exited' },
  { id: 'V-1002', name: 'Anita Sharma', mobile: '9876543211', hostHouse: 'P2-45', purpose: 'Guest', vehicleNumber: '', gate: 'Gate 2', entryTime: '11:00 AM', exitTime: null, status: 'Inside' },
  { id: 'V-1003', name: 'Ramesh (Plumber)', mobile: '9876543212', hostHouse: 'P3-200', purpose: 'Service', vehicleNumber: 'KA-03-XY-9876', gate: 'Main Gate', entryTime: '09:00 AM', exitTime: '11:30 AM', status: 'Exited' },
];

export const payments = [
  { id: 'PAY-001', resident: 'Aarav Patel', house: 'P1-104', phase: 'p1', period: 'Oct 2023', amountDue: 1500, amountPaid: 1500, status: 'Paid', date: '2023-10-05' },
  { id: 'PAY-002', resident: 'Diya Sharma', house: 'P2-45', phase: 'p2', period: 'Oct 2023', amountDue: 1500, amountPaid: 0, status: 'Overdue', date: null },
  { id: 'PAY-003', resident: 'Rohan Verma', house: 'P3-200', phase: 'p3', period: 'Oct 2023', amountDue: 1500, amountPaid: 500, status: 'Partially Paid', date: '2023-10-10' },
];

export const expenses = [
  { id: 'EXP-101', category: 'Security', description: 'Monthly Guard Agency Fee', amount: 45000, date: '2023-10-01', status: 'Paid' },
  { id: 'EXP-102', category: 'Maintenance', description: 'Park Landscaping', amount: 12000, date: '2023-10-15', status: 'Paid' },
  { id: 'EXP-103', category: 'CCTV', description: 'Camera Repair Phase 1', amount: 3500, date: '2023-10-22', status: 'Pending Approval' },
];

export const dashboardStats = {
  visitorsToday: 42,
  vehiclesToday: 156,
  activeSecurityIssues: 2,
  totalCameras: 18,
  camerasNotWorking: 2,
  streetLightsNotWorking: 4,
  patrolsCompleted: 6,
  totalPatrols: 8,
  vacantHouses: 5,
  paymentCollectionPercent: 82,
};
