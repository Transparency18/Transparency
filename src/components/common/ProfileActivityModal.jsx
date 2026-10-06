import { useState, useEffect } from "react";
import { localDb } from "../../services/localDb";
import { Modal } from "./Modal";
import { User, Activity, AlertTriangle, Users, IndianRupee } from "lucide-react";

export function ProfileActivityModal({ isOpen, onClose, userName, role }) {
  const [activities, setActivities] = useState({
    issuesReported: [],
    visitorsHosted: [],
    paymentsMade: []
  });

  useEffect(() => {
    if (isOpen) {
      // Mocked analysis fetching based on user's name or role
      const allIssues = localDb.getSecurityIssues();
      const allVisitors = localDb.getVisitors();
      const allPayments = localDb.getPayments();

      // In a real app, these would be filtered by userId. 
      // For demo, we just loosely filter or show demo stats if none exist.
      setActivities({
        issuesReported: allIssues,
        visitorsHosted: allVisitors,
        paymentsMade: allPayments
      });
    }
  }, [isOpen, userName]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile & Activity">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
            <p className="text-sm text-gray-500 font-medium">{role}</p>
          </div>
        </div>

        {/* Activity Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
            <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <h4 className="text-xl font-bold text-gray-900">{activities.issuesReported.length}</h4>
            <p className="text-xs text-gray-600 font-medium">Issues Reported</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
            <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <h4 className="text-xl font-bold text-gray-900">{activities.visitorsHosted.length}</h4>
            <p className="text-xs text-gray-600 font-medium">Visitors Hosted</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
            <IndianRupee className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <h4 className="text-xl font-bold text-gray-900">{activities.paymentsMade.length}</h4>
            <p className="text-xs text-gray-600 font-medium">Payments Made</p>
          </div>
        </div>

        {/* Timeline / Recent Actions */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Recent Activity Log
          </h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            
            {/* If there's no data, show some dummy activities to make the demo look good, otherwise map actual data */}
            {activities.issuesReported.length === 0 && activities.visitorsHosted.length === 0 ? (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-gray-200 shadow">
                  <p className="text-sm text-gray-500 mb-1">Just now</p>
                  <p className="text-gray-900 font-medium text-sm">Logged into Dashboard</p>
                </div>
              </div>
            ) : (
              <>
                {activities.issuesReported.slice(0, 2).map((issue, i) => (
                  <div key={`issue-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-red-100 text-red-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-sm">
                      <p className="text-xs text-gray-500 mb-0.5">{issue.date || 'Recently'}</p>
                      <p className="text-gray-900 font-medium">Reported: {issue.category}</p>
                      <p className="text-gray-600 truncate">{issue.description}</p>
                    </div>
                  </div>
                ))}
                
                {activities.visitorsHosted.slice(0, 2).map((visitor, i) => (
                  <div key={`vis-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-sm">
                      <p className="text-xs text-gray-500 mb-0.5">{visitor.entryTime || 'Recently'}</p>
                      <p className="text-gray-900 font-medium">Hosted Visitor: {visitor.name}</p>
                      <p className="text-gray-600">Purpose: {visitor.purpose}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
