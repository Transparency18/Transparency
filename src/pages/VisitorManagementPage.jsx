import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Search, Plus, Users, UserCheck, UserX, Clock, Phone, Car, Home } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";
import { useToast } from "../context/ToastContext";

export function VisitorManagementPage() {
  const { phase, role } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreapproveModalOpen, setIsPreapproveModalOpen] = useState(false);
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '', mobile: '', hostHouse: '', purpose: 'Guest', vehicleNumber: '', gate: 'Main gate', phase: 'p1'
  });

  const [preapproveData, setPreapproveData] = useState({
    name: '', mobile: '', hostHouse: '', expectedDate: '', expectedTime: '', purpose: 'Guest', phase: 'p1'
  });

  useEffect(() => {
    setVisitors(localDb.getVisitors());
  }, []);

  const handleAddVisitor = (e) => {
    e.preventDefault();
    const newVisitor = {
      ...formData,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exitTime: null,
      status: 'Inside'
    };
    localDb.addVisitor(newVisitor);
    setVisitors(localDb.getVisitors());
    setIsModalOpen(false);
    
    // Trigger WhatsApp notification popup
    addToast(`WhatsApp notification sent to Host (${formData.hostHouse}) regarding arrival of ${formData.name}.`, 'whatsapp');

    setFormData({ name: '', mobile: '', hostHouse: '', purpose: 'Guest', vehicleNumber: '', gate: 'Main gate', phase: 'p1' });
  };

  const handlePreapproveVisitor = (e) => {
    e.preventDefault();
    const newVisitor = {
      ...preapproveData,
      entryTime: `Expected ${preapproveData.expectedDate} ${preapproveData.expectedTime}`,
      exitTime: null,
      gate: 'Pending',
      status: 'Pre-approved'
    };
    localDb.addVisitor(newVisitor);
    setVisitors(localDb.getVisitors());
    setIsPreapproveModalOpen(false);
    
    addToast(`Pass generated for ${preapproveData.name} and sent to mobile.`, 'success');

    setPreapproveData({ name: '', mobile: '', hostHouse: '', expectedDate: '', expectedTime: '', purpose: 'Guest', phase: 'p1' });
  };

  const handleMarkExit = (id) => {
    localDb.updateVisitor(id, { 
      status: 'Exited', 
      exitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    });
    setVisitors(localDb.getVisitors());
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.hostHouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    const matchesPhase = phase === "All" || v.phase === phase || !v.phase;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Inside": return <Badge variant="warning">Inside</Badge>;
      case "Exited": return <Badge variant="success">Exited</Badge>;
      case "Denied": return <Badge variant="danger">Denied</Badge>;
      case "Pre-approved": return <Badge variant="info">Pre-approved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const phaseSectorVisitors = visitors.filter((v) => {
    const matchesPhase = phase === "All" || v.phase === phase || !v.phase;
    return matchesPhase;
  });

  const insideCount = phaseSectorVisitors.filter(v => v.status === "Inside").length;
  const exitedCount = phaseSectorVisitors.filter(v => v.status === "Exited").length;
  const totalVisitorsCount = phaseSectorVisitors.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visitor Management</h2>
          <p className="text-gray-500 mt-1">Track and manage visitors entering the community</p>
        </div>
        {role !== ROLES.RESIDENT && (
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button variant="secondary" onClick={() => setIsPreapproveModalOpen(true)}>Pre-approve</Button>
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>New Entry</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Visitors</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalVisitorsCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Currently Inside</p>
              <h3 className="text-2xl font-bold text-gray-900">{insideCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Exited</p>
              <h3 className="text-2xl font-bold text-gray-900">{exitedCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <CardTitle>Visitor Logs</CardTitle>
            <div className="flex space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by name, house..."
                  className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Inside">Inside</option>
                <option value="Exited">Exited</option>
                <option value="Pre-approved">Pre-approved</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <div className="divide-y divide-gray-200">
          {filteredVisitors.map((v) => (
            <div key={v.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-start space-x-4">
                  <div className="hidden sm:flex h-12 w-12 rounded-full bg-gray-100 items-center justify-center text-gray-500">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-semibold text-gray-900">{v.name}</h4>
                      {getStatusBadge(v.status)}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 space-x-4 gap-y-2">
                      <div className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1" /> {v.mobile}
                      </div>
                      <div className="flex items-center">
                        <Home className="w-3.5 h-3.5 mr-1" /> Host: {v.hostHouse}
                      </div>
                      <div className="flex items-center">
                        <Badge variant="default" className="text-[10px]">{v.purpose}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end text-sm text-gray-500">
                  <div className="flex items-center mb-1">
                    <Clock className="w-3.5 h-3.5 mr-1.5" /> 
                    <span>In: <span className="font-medium text-gray-900">{v.entryTime}</span></span>
                    {v.exitTime && (
                      <span className="ml-2 border-l border-gray-300 pl-2">Out: <span className="font-medium text-gray-900">{v.exitTime}</span></span>
                    )}
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{v.gate}</span>
                    {v.vehicleNumber && (
                      <span className="flex items-center"><Car className="w-3 h-3 mr-1" /> {v.vehicleNumber}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {v.status === "Inside" && role !== ROLES.RESIDENT && (
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="primary" size="sm" onClick={() => handleMarkExit(v.id)}>Mark Exit</Button>
                </div>
              )}
              {v.status === "Pre-approved" && role !== ROLES.RESIDENT && (
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="success" size="sm" onClick={() => {
                    localDb.updateVisitor(v.id, { 
                      status: 'Inside', 
                      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      gate: 'Main gate' 
                    });
                    setVisitors(localDb.getVisitors());
                  }}>Mark Entered</Button>
                </div>
              )}
            </div>
          ))}
          {filteredVisitors.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No visitors found for this phase.
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Visitor">
        <form onSubmit={handleAddVisitor} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Visitor Name *</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mobile Number *</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Host House *</label>
              <input required type="text" placeholder="e.g. P1-104" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.hostHouse} onChange={e => setFormData({...formData, hostHouse: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phase *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
          </div>

          
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Purpose</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}>
                <option value="Guest">Guest</option>
                <option value="Delivery">Delivery</option>
                <option value="Service">Service</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Entry Gate</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.gate} onChange={e => setFormData({...formData, gate: e.target.value})}>
                <option value="Main gate">Main gate</option>
                <option value="4th phase entry gate">4th phase entry gate</option>
                <option value="3rd phase entry gate">3rd phase entry gate</option>
                <option value="2nd sector-gate1(whine shop)">2nd sector-gate1(whine shop)</option>
                <option value="gate2(whine shop)">gate2(whine shop)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Register Entry</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isPreapproveModalOpen} onClose={() => setIsPreapproveModalOpen(false)} title="Pre-approve Visitor">
        <form onSubmit={handlePreapproveVisitor} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Visitor Name *</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={preapproveData.name} onChange={e => setPreapproveData({...preapproveData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mobile Number *</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={preapproveData.mobile} onChange={e => setPreapproveData({...preapproveData, mobile: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Host House *</label>
              <input required type="text" placeholder="e.g. P1-104" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={preapproveData.hostHouse} onChange={e => setPreapproveData({...preapproveData, hostHouse: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phase *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={preapproveData.phase} onChange={e => setPreapproveData({...preapproveData, phase: e.target.value})}>
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Expected Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={preapproveData.expectedDate} onChange={e => setPreapproveData({...preapproveData, expectedDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Expected Time</label>
              <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={preapproveData.expectedTime} onChange={e => setPreapproveData({...preapproveData, expectedTime: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Purpose</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={preapproveData.purpose} onChange={e => setPreapproveData({...preapproveData, purpose: e.target.value})}>
              <option value="Guest">Guest</option>
              <option value="Delivery">Delivery</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsPreapproveModalOpen(false)}>Cancel</Button>
            <Button type="submit">Generate Pass</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

