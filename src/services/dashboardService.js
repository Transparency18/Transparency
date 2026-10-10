import { localDb } from "./localDb";
import { getComplaints } from "./complaintService";
import { getCameras } from "./cameraService";
import { getGuards } from "./userService";

export const dashboardService = {
  getStats: async (phaseFilter = 'All') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localDb.getDashboardStats(phaseFilter));
      }, 500);
    });
  },

  // Complaints come from the backend (members get only their own).
  getComplaintSummary: async (phaseFilter = 'All') => {
    let complaints = await getComplaints();
    if (phaseFilter !== 'All') complaints = complaints.filter(c => c.phase === phaseFilter);
    const active = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress');
    return { activeCount: active.length, recent: complaints.slice(0, 5) };
  },

  // Cameras come from the backend (everyone sees all of them).
  getCameraSummary: async (phaseFilter = 'All') => {
    let cameras = await getCameras();
    if (phaseFilter !== 'All') cameras = cameras.filter(c => c.phase === phaseFilter);
    const count = (status) => cameras.filter(c => c.status === status).length;
    const cctvTrend = cameras.length === 0
      ? [{ name: 'No cameras added yet', value: 1, color: '#e5e7eb', placeholder: true }]
      : [
        { name: 'Working', value: count('Working'), color: '#22c55e' },
        { name: 'Faulty', value: count('Not Working'), color: '#ef4444' },
        { name: 'Maintenance', value: count('Under Maintenance'), color: '#f97316' },
      ].filter(entry => entry.value > 0);
    return { totalCameras: cameras.length, camerasNotWorking: count('Not Working'), cctvTrend };
  },

  // Guards are users with the guard role (from the backend).
  getGuardCount: async () => (await getGuards()).length,

  getRecentVisitors: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localDb.getVisitors().slice(0, 5));
      }, 500);
    });
  },
  
  getExpenseSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localDb.getExpenses());
      }, 500);
    });
  },

  getAnnouncements: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localDb.getAnnouncements().slice(0, 5));
      }, 500);
    });
  }
};

