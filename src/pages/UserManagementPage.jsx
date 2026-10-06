import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Plus, Trash2, Users } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";
import { useToast } from "../context/ToastContext";

export function UserManagementPage() {
  const [usersList, setUsersList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [formData, setFormData] = useState({ name: '', role: 'Resident', email: '', contact: '', phase: 'p1', shift: 'Day', photo: '' });
  const { role, phase } = useAuth();
  const { addToast } = useToast();
  
  // Only Super Admin can view/add users
  const isAdmin = role === ROLES.VOLUNTEER;

  useEffect(() => {
    setUsersList(localDb.getUsers());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    localDb.addUser(formData);
    setUsersList(localDb.getUsers());
    setIsModalOpen(false);
    addToast(`User ${formData.name} added as ${formData.role}.`, 'success');
    setFormData({ name: '', role: 'Resident', email: '', contact: '', phase: 'p1', shift: 'Day', photo: '' });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesPhase = phase === 'All' || u.phase === phase || !u.phase;
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesPhase && matchesRole;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      localDb.deleteUser(id);
      setUsersList(localDb.getUsers());
      addToast('User removed successfully.', 'success');
    }
  };

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view this page.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-1">Manage volunteers and residents</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add User</Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <CardTitle>Users Directory</CardTitle>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Resident">Resident</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Guard">Guard</option>
            </select>
          </div>
        </CardHeader>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-6 text-xs text-gray-500">Name</th>
              <th className="py-3 px-6 text-xs text-gray-500">Role</th>
              <th className="py-3 px-6 text-xs text-gray-500">Phase</th>
              <th className="py-3 px-6 text-xs text-gray-500">Email ID</th>
              <th className="py-3 px-6 text-xs text-gray-500">Mobile Number</th>
              <th className="py-3 px-6 text-xs text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 font-medium">
                  <div className="flex items-center">
                    {u.photo ? (
                      <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                    {u.name}
                  </div>
                </td>
                <td className="py-3 px-6 text-sm">
                  <div className="flex flex-col items-start gap-1">
                    <Badge variant={u.role === 'Volunteer' ? 'primary' : (u.role === 'Guard' ? 'warning' : 'default')}>{u.role}</Badge>
                    {u.role === 'Guard' && <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{u.shift} Shift</span>}
                  </div>
                </td>
                <td className="py-3 px-6 text-sm">
                  {phases.find(p => p.id === u.phase)?.name || u.phase}
                  
                </td>
                <td className="py-3 px-6 text-sm">{u.email || '-'}</td>
                <td className="py-3 px-6 text-sm">{u.contact}</td>
                <td className="py-3 px-6 text-right">
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Remove User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-500">No users found for this phase.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add User">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Name *</label>
            <input required className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahul Sharma" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Role *</label>
            <select className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="Resident">Resident</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Guard">Guard</option>
            </select>
          </div>
          {formData.role === 'Guard' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Shift *</label>
              <select className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Reliever">Reliever</option>
              </select>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phase *</label>
            <select className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
              {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <input required type="email" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@email.com" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Contact Number *</label>
            <input required type="tel" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="Mobile number" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Profile Photo</label>
            <input type="file" accept="image/*" className="w-full border rounded-lg p-2 text-sm outline-none" onChange={handlePhotoUpload} />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
