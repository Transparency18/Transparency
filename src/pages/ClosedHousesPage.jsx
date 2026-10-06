import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Plus, Download, Lock } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";
import { useToast } from "../context/ToastContext";

export function ClosedHousesPage() {
  const [closedHouses, setClosedHouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ purpose: '', fromDate: '', toDate: '', emergencyContact: '' });
  const { role, phase } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    setClosedHouses(localDb.getClosedHouses() || []);
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    localDb.addClosedHouse({
      ...formData,
      houseId: 'A-101 (Auto-detected)',
      ownerName: 'Current Resident',
      phase: phase === 'All' ? 'p1' : phase,
      sector: 's2',
      status: 'Active',
      reportedDate: new Date().toISOString().split('T')[0]
    });
    setClosedHouses(localDb.getClosedHouses());
    setIsModalOpen(false);
    addToast('House marked as closed.', 'success');
    setFormData({ purpose: '', fromDate: '', toDate: '', emergencyContact: '' });
  };

  const handleDownloadPdf = () => {
    // Mocking PDF download
    addToast('Generating PDF...', 'info');
    setTimeout(() => {
      addToast('closed_houses_report.pdf downloaded.', 'success');
    }, 1500);
  };

  const filteredHouses = closedHouses.filter(ch => phase === 'All' || ch.phase === phase || !ch.phase);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Closed Houses</h2>
          <p className="text-gray-500 mt-1">Log houses that are temporarily vacant for extra security</p>
        </div>
        <div className="flex space-x-2">
          {(role === ROLES.VOLUNTEER || role === ROLES.GUARD) && (
            <Button variant="secondary" icon={Download} onClick={handleDownloadPdf}>Download Report</Button>
          )}
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Log Closed House</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Currently Closed Houses</CardTitle>
        </CardHeader>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">House & Owner</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Absence Period</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Phase</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Purpose</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Emergency Contact</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouses.map(ch => (
              <tr key={ch.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 font-medium">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-3">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold">{ch.houseId}</div>
                      <div className="text-xs text-gray-500">{ch.ownerName}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 text-sm">
                  {ch.fromDate} to {ch.toDate}
                </td>
                <td className="py-3 px-6 text-sm">
                  {phases.find(p => p.id === ch.phase)?.name || ch.phase}
                  
                </td>
                <td className="py-3 px-6 text-sm text-gray-600 truncate max-w-[200px]" title={ch.purpose}>
                  {ch.purpose}
                </td>
                <td className="py-3 px-6 text-sm text-gray-600">
                  {ch.emergencyContact}
                </td>
                <td className="py-3 px-6 text-sm">
                  <Badge variant="warning">{ch.status}</Badge>
                </td>
              </tr>
            ))}
            {filteredHouses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No closed houses reported for this phase.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Closed House">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Purpose *</label>
            <input required className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} placeholder="e.g. Vacation, Medical Emergency" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">From Date *</label>
              <input required type="date" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.fromDate} onChange={e => setFormData({ ...formData, fromDate: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">To Date *</label>
              <input required type="date" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.toDate} onChange={e => setFormData({ ...formData, toDate: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Emergency Contact Number *</label>
            <input required className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} placeholder="Mobile number" />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
