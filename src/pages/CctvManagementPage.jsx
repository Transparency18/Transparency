import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { phases } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Search, Plus, Video, Settings, Activity, Trash2 } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";

export function CctvManagementPage() {
  const { phase, role } = useAuth();
  const [cameras, setCameras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phase: 'p1', location: '', type: 'Bullet'
  });

  useEffect(() => {
    setCameras(localDb.getCameras());
  }, []);

  const handleAddCamera = (e) => {
    e.preventDefault();
    const newCamera = {
      ...formData,
      status: 'Working',
      lastMaintenance: new Date().toISOString().split('T')[0]
    };
    localDb.addCamera(newCamera);
    setCameras(localDb.getCameras());
    setIsModalOpen(false);
    setFormData({ name: '', phase: 'p1', location: '', type: 'Bullet' });
  };

  const handleUpdateStatus = (id, newStatus) => {
    localDb.updateCamera(id, { status: newStatus });
    setCameras(localDb.getCameras());
  };

  const handleDeleteCamera = (id) => {
    if (window.confirm("Are you sure you want to delete this camera?")) {
      localDb.deleteCamera(id);
      setCameras(localDb.getCameras());
    }
  };

  const filteredCameras = cameras.filter((cam) => {
    const matchesSearch = cam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cam.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || cam.status === statusFilter;
    const matchesPhase = phase === "All" || cam.phase === phase;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Working": return <Badge variant="success">Working</Badge>;
      case "Not Working": return <Badge variant="danger">Not Working</Badge>;
      case "Under Maintenance": return <Badge variant="warning">Maintenance</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const workingCount = cameras.filter(c => c.status === "Working").length;
  const faultCount = cameras.filter(c => c.status === "Not Working").length;
  const maintCount = cameras.filter(c => c.status === "Under Maintenance").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CCTV & Infrastructure</h2>
          <p className="text-gray-500 mt-1">Manage and monitor community camera network</p>
        </div>
        {role !== ROLES.RESIDENT && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Camera</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Cameras</p>
              <h3 className="text-2xl font-bold text-gray-900">{cameras.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Working</p>
              <h3 className="text-2xl font-bold text-gray-900">{workingCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-red-200 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-red-500 font-medium">Faulty</p>
              <h3 className="text-2xl font-bold text-red-700">{faultCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">In Maintenance</p>
              <h3 className="text-2xl font-bold text-gray-900">{maintCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <CardTitle>Camera Directory</CardTitle>
            <div className="flex space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search cameras..."
                  className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white hidden sm:block"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Working">Working</option>
                <option value="Not Working">Not Working</option>
                <option value="Under Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Camera ID & Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phase / Location</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                {role !== ROLES.RESIDENT && <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCameras.map((cam) => {
                const phase = phases.find(p => p.id === cam.phase);
                return (
                  <tr key={cam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{cam.name}</div>
                      <div className="text-sm text-gray-500">{cam.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900">{phase?.name}</div>
                      <div className="text-sm text-gray-500">{cam.location}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{cam.type}</td>
                    <td className="py-4 px-6">
                      {getStatusBadge(cam.status)}
                    </td>
                    {role !== ROLES.RESIDENT && (
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <select 
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 mr-2"
                          onChange={(e) => handleUpdateStatus(cam.id, e.target.value)}
                          value={cam.status}
                        >
                          <option value="Working">Working</option>
                          <option value="Not Working">Not Working (Faulty)</option>
                          <option value="Under Maintenance">Maintenance</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteCamera(cam.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors mr-2"
                          title="Delete Camera"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Button variant="ghost" size="sm">Details</Button>
                      </td>
                    )}
                  </tr>
                )
              })}
              {filteredCameras.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No cameras found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Camera">
        <form onSubmit={handleAddCamera} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Camera Name *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Back Gate Cam 2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phase *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
          </div>

          
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Camera Type *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Bullet">Bullet</option>
                <option value="Dome">Dome</option>
                <option value="PTZ">PTZ (Pan-Tilt-Zoom)</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Exact Location *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Corner of Avenue 3" />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Camera</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
