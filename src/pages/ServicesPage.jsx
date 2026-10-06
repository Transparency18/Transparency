import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Plus, Trash2 } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";

export function ServicesPage() {
  const [providers, setProviders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', serviceType: 'Maid', contact: '', phase: 'All' });
  const { role, phase } = useAuth();
  const isAdmin = role === ROLES.VOLUNTEER;

  useEffect(() => {
    setProviders(localDb.getServiceProviders());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    localDb.addServiceProvider(formData);
    setProviders(localDb.getServiceProviders());
    setIsModalOpen(false);
    setFormData({ name: '', serviceType: 'Maid', contact: '', phase: 'All' });
  };

  const filteredProviders = providers.filter(p => phase === 'All' || p.phase === phase || !p.phase);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this provider?")) {
      localDb.deleteServiceProvider(id);
      setProviders(localDb.getServiceProviders());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Providers</h2>
          <p className="text-gray-500 mt-1">Directory of regular maids, plumbers, electricians</p>
        </div>
        {isAdmin && <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Provider</Button>}
      </div>

      <Card>
        <CardHeader><CardTitle>Providers Directory</CardTitle></CardHeader>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-6 text-xs text-gray-500">Name</th>
              <th className="py-3 px-6 text-xs text-gray-500">Service Type</th>
              <th className="py-3 px-6 text-xs text-gray-500">Contact</th>
              {isAdmin && <th className="py-3 px-6 text-xs text-gray-500 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProviders.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 font-medium">{p.name}</td>
                <td className="py-3 px-6 text-sm"><Badge>{p.serviceType}</Badge></td>
                <td className="py-3 px-6 text-sm">{p.contact}</td>
                {isAdmin && (
                  <td className="py-3 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove Provider"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredProviders.length === 0 && <tr><td colSpan={isAdmin ? "4" : "3"} className="text-center py-6 text-gray-500">No providers found for this phase.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Provider">
        <form onSubmit={handleAdd} className="space-y-4">
          <input required placeholder="Name" className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <select className="w-full border rounded p-2" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}>
            <option>Maid</option>
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Driver</option>
            <option>AC Repair</option>
            <option>Fridge Repair</option>
            <option>Carpenter</option>
            <option>Painter</option>
            <option>Gardener</option>
            <option>Deep Cleaning</option>
            <option>Pest Control</option>
            <option>Cook</option>
            <option>Other</option>
          </select>
          <select className="w-full border rounded p-2" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
            {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          
          
          <input required placeholder="Contact info" className="w-full border rounded p-2" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
