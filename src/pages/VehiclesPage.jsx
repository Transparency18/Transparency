import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Plus, Car, Trash2 } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";

export function VehiclesPage() {
  const { phase, role } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ number: '', owner: '', type: 'Car', houseId: '', phase: 'p1' });

  useEffect(() => {
    setVehicles(localDb.getVehicles());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    localDb.addVehicle({ ...formData });
    setVehicles(localDb.getVehicles());
    setIsModalOpen(false);
    setFormData({ number: '', owner: '', type: 'Car', houseId: '', phase: 'p1' });
  };

  const filteredVehicles = vehicles.filter(v => phase === 'All' || v.phase === phase || !v.phase);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      localDb.deleteVehicle(id);
      setVehicles(localDb.getVehicles());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Tracking</h2>
          <p className="text-gray-500 mt-1">Manage resident and authorized vehicles</p>
        </div>
        {role !== ROLES.RESIDENT && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Register Vehicle</Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="p-4 flex items-center space-x-4"><Car className="text-blue-500 w-8 h-8" /><div><p className="text-gray-500">Registered Vehicles</p><h3 className="text-2xl font-bold">{filteredVehicles.length}</h3></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Vehicle Directory</CardTitle></CardHeader>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-6 text-xs text-gray-500">License Plate</th>
              <th className="py-3 px-6 text-xs text-gray-500">Owner</th>
              <th className="py-3 px-6 text-xs text-gray-500">House / Unit</th>
              <th className="py-3 px-6 text-xs text-gray-500">Type</th>
              {role !== ROLES.RESIDENT && <th className="py-3 px-6 text-xs text-gray-500 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map(v => (
              <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 font-bold">{v.number.toUpperCase()}</td>
                <td className="py-3 px-6 text-sm">{v.owner}</td>
                <td className="py-3 px-6 text-sm">{v.houseId}</td>
                <td className="py-3 px-6 text-sm"><Badge>{v.type}</Badge></td>
                {role !== ROLES.RESIDENT && (
                  <td className="py-3 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredVehicles.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-gray-500">No vehicles found for this phase.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Vehicle">
        <form onSubmit={handleAdd} className="space-y-4">
          <input required placeholder="License Plate (e.g. MH12AB1234)" className="w-full border rounded p-2 uppercase" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
          <input required placeholder="Owner Name" className="w-full border rounded p-2" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
          <input required placeholder="House / Unit ID" className="w-full border rounded p-2" value={formData.houseId} onChange={e => setFormData({...formData, houseId: e.target.value})} />
          <select className="w-full border rounded p-2" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
            {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          
          
          <select className="w-full border rounded p-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>Car</option><option>Two-Wheeler</option><option>Commercial</option>
          </select>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
