import { localDb } from "./localDb";
import { getComplaints } from "./complaintService";

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

