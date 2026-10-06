import { localDb } from "./localDb";

export const dashboardService = {
  getStats: async (phaseFilter = 'All') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localDb.getDashboardStats(phaseFilter));
      }, 500);
    });
  },

  getRecentIssues: async (phaseFilter = 'All') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let issues = localDb.getSecurityIssues();
        if (phaseFilter !== 'All') {
          issues = issues.filter(i => i.phase === phaseFilter || !i.phase);
        }
        resolve(issues.slice(0, 5));
      }, 500);
    });
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

