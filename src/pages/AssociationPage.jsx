import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Plus, Users, Trash2 } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";

export function AssociationPage() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'President', contact: '', phase: 'p1' });
  const { phase, role } = useAuth();

  useEffect(() => {
    setMembers(localDb.getCommittee());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    localDb.addCommitteeMember(formData);
    setMembers(localDb.getCommittee());
    setIsModalOpen(false);
    setFormData({ name: '', role: 'President', contact: '', phase: 'p1' });
  };

  const filteredMembers = members.filter(m => phase === 'All' || m.phase === phase || !m.phase);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      localDb.deleteCommitteeMember(id);
      setMembers(localDb.getCommittee());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Association Committee</h2>
          <p className="text-gray-500 mt-1">Directory of management committee members</p>
        </div>
        {role !== ROLES.RESIDENT && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Member</Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <Card key={member.id} className="text-center p-6 flex flex-col items-center relative group">
             {role !== ROLES.RESIDENT && (
               <button 
                 onClick={() => handleDelete(member.id)}
                 className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                 title="Remove Member"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             )}
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
               <Users className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
             <Badge className="mt-1 mb-2 bg-blue-50 text-blue-700">{member.role}</Badge>
             <p className="text-sm text-gray-500">{member.contact}</p>
          </Card>
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            No committee members found for this phase.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Committee Member">
        <form onSubmit={handleAdd} className="space-y-4">
          <input required placeholder="Name" className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <select className="w-full border rounded p-2" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option>President</option><option>Secretary</option><option>Treasurer</option><option>Member</option>
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
