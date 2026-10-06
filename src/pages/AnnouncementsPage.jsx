import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { useToast } from "../context/ToastContext";
import { useAuth, ROLES } from "../context/AuthContext";
import { Search, Plus, Megaphone, Calendar, Users } from "lucide-react";

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();
  const { role, phase } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '', content: '', target: 'All Residents', priority: 'Normal'
  });

  useEffect(() => {
    setAnnouncements(localDb.getAnnouncements());
  }, []);

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    localDb.addAnnouncement(formData);
    setAnnouncements(localDb.getAnnouncements());
    setIsModalOpen(false);
    
    addToast(`Announcement broadcasted to ${formData.target}.`, 'success');
    addToast(`WhatsApp notification sent for: ${formData.title}.`, 'whatsapp');

    setFormData({ title: '', content: '', target: 'All Residents', priority: 'Normal' });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High": return <Badge variant="danger">High</Badge>;
      case "Normal": return <Badge variant="info">Normal</Badge>;
      case "Low": return <Badge variant="default">Low</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPhase = true;
    if (phase === 'p1') {
      matchesPhase = a.target === 'All Residents' || a.target === 'Phase 1 Only' || a.target === 'Security Team';
    } else if (phase === 'p2') {
      matchesPhase = a.target === 'All Residents' || a.target === 'Phase 2 Only' || a.target === 'Security Team';
    }

    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
          <p className="text-gray-500 mt-1">Broadcast important information to the community</p>
        </div>
        {role === ROLES.VOLUNTEER && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>New Broadcast</Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <CardTitle>Community Noticeboard</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search notices..."
                className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="p-0 sm:p-4">
          <div className="space-y-4">
            {filteredAnnouncements.map((ann) => (
              <div key={ann.id} className={`p-4 sm:p-6 rounded-lg border ${ann.priority === 'High' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Megaphone className={`w-5 h-5 ${ann.priority === 'High' ? 'text-red-500' : 'text-blue-500'}`} />
                    <h3 className="text-lg font-bold text-gray-900">{ann.title}</h3>
                  </div>
                  {getPriorityBadge(ann.priority)}
                </div>
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{ann.content}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(ann.date).toLocaleDateString()} at {new Date(ann.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Target: {ann.target}
                  </div>
                </div>
              </div>
            ))}
            {filteredAnnouncements.length === 0 && (
              <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                No active announcements.
              </div>
            )}
          </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Announcement">
        <form onSubmit={handleAddAnnouncement} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notice Title *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Water Supply Interruption" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Target Audience *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})}>
                <option value="All Residents">All Residents</option>
                <option value="Phase 1 Only">Phase 1 Only</option>
                <option value="Phase 2 Only">Phase 2 Only</option>
                <option value="Security Team">Security Team</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Priority *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="Normal">Normal</option>
                <option value="High">High (Emergency)</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Message Content *</label>
            <textarea required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Detailed message for the community..."></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Broadcast Message</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
