import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Search, Plus, FileText, TrendingDown } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";

export function ExpensesPage() {
  const { phase, role } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', category: 'Maintenance', amount: '', vendor: '', status: 'Paid', phase: 'p1'
  });

  useEffect(() => {
    setExpenses(localDb.getExpenses());
  }, []);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };
    localDb.addExpense(newExpense);
    setExpenses(localDb.getExpenses());
    setIsModalOpen(false);
    setFormData({ title: '', category: 'Maintenance', amount: '', vendor: '', status: 'Paid', phase: 'p1' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid": return <Badge variant="success">Paid</Badge>;
      case "Pending Approval": return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const totalExpenses = expenses.filter(e => e.status === 'Paid' && (phase === 'All' || e.phase === phase || !e.phase)).reduce((sum, e) => sum + Number(e.amount), 0);
  const pendingExpenses = expenses.filter(e => e.status !== 'Paid' && (phase === 'All' || e.phase === phase || !e.phase)).reduce((sum, e) => sum + Number(e.amount), 0);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = phase === 'All' || e.phase === phase || !e.phase;
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
          <p className="text-gray-500 mt-1">Track community expenses and vendor payouts</p>
        </div>
        {role !== ROLES.RESIDENT && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Log Expense</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Spent (Paid)</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{pendingExpenses.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <CardTitle>Expense Register</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by title or vendor..."
                className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor & Category</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{expense.title}</div>
                    <div className="text-xs text-gray-500">{expense.date} • {expense.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{expense.vendor}</div>
                    <div className="text-xs text-gray-500">{expense.category}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    ₹{Number(expense.amount).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(expense.status)}
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No expenses found for this phase.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Expense">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Expense Title *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Pump Repair Phase 2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security Services</option>
                <option value="Utilities">Utilities (Water/Elec)</option>
                <option value="Events">Events</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phase *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value})}>
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
          </div>

          
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Amount (₹) *</label>
              <input required type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Vendor / Payee *</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} placeholder="e.g. ABC Plumbing" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Status *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Paid">Paid</option>
                <option value="Pending Approval">Pending Approval</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
