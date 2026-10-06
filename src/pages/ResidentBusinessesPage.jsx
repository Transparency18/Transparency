import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Plus, CheckCircle, XCircle, Store } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function ResidentBusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Tuition', openTime: '09:00', closeTime: '18:00', description: '' });
  const { role } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    setBusinesses(localDb.getBusinesses() || []);
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    localDb.addBusiness({
      ...formData,
      owner: 'Current Resident', // Auto-filled mock
      houseId: 'A-101 (Auto-detected)', // Auto-filled mock
    });
    setBusinesses(localDb.getBusinesses());
    setIsModalOpen(false);
    addToast('Business registered. Waiting for volunteer approval.', 'info');
    setFormData({ name: '', category: 'Tuition', openTime: '09:00', closeTime: '18:00', description: '' });
  };

  const handleApprove = (id) => {
    localDb.updateBusiness(id, { status: 'Approved' });
    setBusinesses(localDb.getBusinesses());
    addToast('Business approved.', 'success');
  };

  const handleReject = (id) => {
    localDb.updateBusiness(id, { status: 'Rejected' });
    setBusinesses(localDb.getBusinesses());
    addToast('Business rejected.', 'success');
  };

  // Residents and Guards see only Approved. Volunteers see all.
  const visibleBusinesses = role === ROLES.VOLUNTEER 
    ? businesses 
    : businesses.filter(b => b.status === 'Approved');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resident Businesses</h2>
          <p className="text-gray-500 mt-1">Directory of commercial services run by residents</p>
        </div>
        {role === ROLES.RESIDENT && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Register Business</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBusinesses.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-white rounded-lg border border-gray-200">
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Businesses Found</h3>
            <p className="text-gray-500 text-sm mt-1">No resident businesses are currently registered.</p>
          </div>
        ) : (
          visibleBusinesses.map(b => (
            <Card key={b.id} className="flex flex-col h-full">
              <CardHeader className="pb-2 border-b border-gray-100 flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{b.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{b.category}</p>
                </div>
                {role === ROLES.VOLUNTEER && (
                  <Badge variant={b.status === 'Approved' ? 'success' : (b.status === 'Rejected' ? 'danger' : 'warning')}>
                    {b.status}
                  </Badge>
                )}
              </CardHeader>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{b.description || 'No description provided.'}</p>
                  <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Run by:</span>
                      <span className="font-medium">{b.owner} ({b.houseId})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Timings:</span>
                      <span className="font-medium">{b.openTime} to {b.closeTime}</span>
                    </div>
                  </div>
                </div>
                {role === ROLES.VOLUNTEER && b.status === 'Pending' && (
                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="flex-1" onClick={() => handleReject(b.id)}>
                      <XCircle className="w-4 h-4 mr-1 inline" /> Reject
                    </Button>
                    <Button className="flex-1" onClick={() => handleApprove(b.id)}>
                      <CheckCircle className="w-4 h-4 mr-1 inline" /> Approve
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Commercial Service">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Business/Service Name *</label>
            <input required className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Fresh Bakes, Math Tuitions" />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Category *</label>
            <select className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Tuition / Coaching</option>
              <option>Home Bakery / Food</option>
              <option>Clinic / Consultation</option>
              <option>Boutique / Tailoring</option>
              <option>Daycare</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Open Time *</label>
              <input required type="time" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Close Time *</label>
              <input required type="time" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Briefly describe what you offer..." />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit for Approval</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
