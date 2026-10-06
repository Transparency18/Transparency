import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Plus, Trash2 } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";

export function InfrastructurePage() {
  const { phase, role } = useAuth();
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Water Pump', location: '', phase: 'p1' });

  useEffect(() => {
    setItems(localDb.getInfrastructure());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    localDb.addInfrastructure({ ...formData, status: 'Working' });
    setItems(localDb.getInfrastructure());
    setIsModalOpen(false);
    setFormData({ name: '', type: 'Water Pump', location: '', phase: 'p1' });
  };

  const filteredItems = items.filter(item => phase === 'All' || item.phase === phase || !item.phase);

  const handleUpdateStatus = (id, newStatus) => {
    localDb.updateInfrastructure(id, { status: newStatus });
    setItems(localDb.getInfrastructure());
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      localDb.deleteInfrastructure(id);
      setItems(localDb.getInfrastructure());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Infrastructure & Assets</h2>
          <p className="text-gray-500 mt-1">Manage community assets and maintenance schedules</p>
        </div>
        {role !== ROLES.RESIDENT && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Asset</Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-gray-500">Total Assets</p><h3 className="text-2xl font-bold">{filteredItems.length}</h3></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-gray-500">Working</p><h3 className="text-2xl font-bold text-green-600">{filteredItems.filter(i => i.status === 'Working').length}</h3></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-gray-500">Faulty</p><h3 className="text-2xl font-bold text-red-600">{filteredItems.filter(i => i.status === 'Faulty').length}</h3></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Asset Directory</CardTitle></CardHeader>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-6 text-xs text-gray-500">Asset</th>
              <th className="py-3 px-6 text-xs text-gray-500">Location</th>
              <th className="py-3 px-6 text-xs text-gray-500">Status</th>
              {role !== ROLES.RESIDENT && <th className="py-3 px-6 text-xs text-gray-500 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </td>
                <td className="py-3 px-6 text-sm">{item.location}</td>
                <td className="py-3 px-6 text-sm">
                  <Badge variant={item.status === 'Working' ? 'success' : 'danger'}>{item.status}</Badge>
                </td>
                {role !== ROLES.RESIDENT && (
                  <td className="py-3 px-6 text-right whitespace-nowrap">
                    <select 
                      className="text-sm border rounded p-1 mr-2"
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                    >
                      <option value="Working">Working</option>
                      <option value="Faulty">Faulty</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors inline-flex align-middle"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredItems.length === 0 && <tr><td colSpan={role !== ROLES.RESIDENT ? "4" : "3"} className="text-center py-6 text-gray-500">No assets found for this phase.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Asset">
        <form onSubmit={handleAdd} className="space-y-4">
          <input required placeholder="Asset Name" className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <select className="w-full border rounded p-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>Water Pump</option><option>Generator</option><option>Lift</option><option>Streetlight</option>
          </select>
          <select className="w-full border rounded p-2" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
            {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          
          
          <input required placeholder="Location" className="w-full border rounded p-2" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
