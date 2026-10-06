import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { phases } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { MessageSquare, Search, Plus, AlertTriangle, CheckCircle, Clock, ShieldAlert, Trash2 } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";

export function SecurityPage() {
  const { phase, role } = useAuth();
  const [issues, setIssues] = useState([]);
  const [patrols, setPatrols] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Suspicious Activity', description: '', phase: 'p1', priority: 'Medium', reportedBy: 'Admin'
  });
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyIssueId, setReplyIssueId] = useState(null);

  useEffect(() => {
    setIssues(localDb.getSecurityIssues());
    setPatrols(localDb.getPatrols());
  }, []);

  const handleReportIssue = (e) => {
    e.preventDefault();
    const newIssue = {
      ...formData,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };
    localDb.addSecurityIssue(newIssue);
    setIssues(localDb.getSecurityIssues());
    setIsModalOpen(false);
    setFormData({ category: 'Suspicious Activity', description: '', phase: 'p1', priority: 'Medium', reportedBy: 'Admin' });
  };

  const handleUpdateStatus = (id, newStatus) => {
    localDb.updateSecurityIssue(id, { status: newStatus });
    setIssues(localDb.getSecurityIssues());
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      localDb.deleteSecurityIssue(id);
      setIssues(localDb.getSecurityIssues());
    }
  };
  const handleReplySubmit = (e) => {
    e.preventDefault();
    localDb.updateSecurityIssue(replyIssueId, { volunteerReply: replyText });
    setIssues(localDb.getSecurityIssues());
    setReplyModalOpen(false);
    setReplyText("");
    setReplyIssueId(null);
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || issue.priority === priorityFilter;
    const matchesPhase = phase === "All" || issue.phase === phase;
    return matchesSearch && matchesStatus && matchesPriority && matchesPhase;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open": return <Badge variant="danger">Open</Badge>;
      case "In Progress": return <Badge variant="warning">In Progress</Badge>;
      case "Resolved": return <Badge variant="success">Resolved</Badge>;
      case "Closed": return <Badge variant="default">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High": return <Badge variant="danger" className="text-[10px]">High</Badge>;
      case "Medium": return <Badge variant="warning" className="text-[10px]">Medium</Badge>;
      case "Low": return <Badge variant="info" className="text-[10px]">Low</Badge>;
      default: return <Badge className="text-[10px]">{priority}</Badge>;
    }
  };

  const openCount = issues.filter(i => i.status === "Open" || i.status === "In Progress").length;
  const resolvedCount = issues.filter(i => i.status === "Resolved" || i.status === "Closed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complains</h2>
          <p className="text-gray-500 mt-1">Track and resolve issues and incidents</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Report Issue</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Issues</p>
              <h3 className="text-2xl font-bold text-gray-900">{openCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Reported</p>
              <h3 className="text-2xl font-bold text-gray-900">{issues.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Resolved</p>
              <h3 className="text-2xl font-bold text-gray-900">{resolvedCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Patrol Rounds</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {patrols.filter(p => p.status === 'Completed').length}/{patrols.length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <CardTitle>Security Issues & Incidents</CardTitle>
            <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="relative w-full md:w-64 flex-shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search issues..."
                  className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-shrink-0"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-shrink-0"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Details</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location / Phase</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported Info</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status & Priority</th>
                {role !== ROLES.RESIDENT && <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIssues.map((issue) => {
                const phase = phases.find(p => p.id === issue.phase);
                return (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{issue.category}</div>
                      <div className="text-sm text-gray-500 mt-1 max-w-xs truncate" title={issue.description}>
                        {issue.description}
                      </div>
                      {issue.volunteerReply && (
                        <div className="mt-2 bg-blue-50 border-l-2 border-blue-500 p-2 text-xs text-gray-700 rounded-r">
                          <span className="font-semibold text-blue-800">Reply: </span>
                          {issue.volunteerReply}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">{issue.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900 font-medium">
                        {phase?.name}
                        
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{issue.reportedBy}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" /> {issue.date}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start space-y-2">
                        {getStatusBadge(issue.status)}
                        {getPriorityBadge(issue.priority)}
                      </div>
                    </td>
                    {role !== ROLES.RESIDENT && (
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {issue.status !== "Resolved" && (
                          <select 
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 mr-2"
                            onChange={(e) => handleUpdateStatus(issue.id, e.target.value)}
                            value={issue.status}
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        )}
                        {(role === ROLES.VOLUNTEER || role === ROLES.GUARD) && (
                           <button
                             onClick={() => { setReplyIssueId(issue.id); setReplyText(issue.volunteerReply || ""); setReplyModalOpen(true); }}
                             className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex align-middle mr-2"
                             title="Reply"
                           >
                             <MessageSquare className="w-4 h-4" />
                           </button>
                        )}
                        <button 
                          onClick={() => handleDelete(issue.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors inline-flex align-middle"
                          title="Delete Issue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={role !== ROLES.RESIDENT ? "5" : "4"} className="py-8 text-center text-gray-500">
                    No security issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Security Issue">
        <form onSubmit={handleReportIssue} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Trespassing">Trespassing</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Infrastructure Damage">Infrastructure Damage</option>
                <option value="CCTV / Camera Fault">CCTV / Camera Fault</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Priority *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phase / Location *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
              {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description *</label>
            <textarea required rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Provide details about the issue..."></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Report Issue</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)} title="Reply to Issue">
        <form onSubmit={handleReplySubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Your Reply *</label>
            <textarea required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response..."></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setReplyModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Reply</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

