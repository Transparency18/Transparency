import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { RefreshCw, Search, Trash2, Users } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { phases } from "../data/mockData";
import { getUsers, deleteUser } from "../services/userService";
import { useToast } from "../context/ToastContext";

const ROLE_LABELS = { member: "Member", volunteer: "Volunteer", guard: "Guard" };
const ROLE_BADGES = { member: "default", volunteer: "primary", guard: "warning" };

export function UserManagementPage() {
  const { role, logout } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const { addToast } = useToast();

  const isVolunteer = role === ROLES.VOLUNTEER;

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      setUsersList(await getUsers());
    } catch (err) {
      if (err.status === 401) return logout();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name} (${u.email})? This removes their account and cannot be undone.`)) return;
    setDeletingId(u.id);
    try {
      await deleteUser(u.id);
      setUsersList(prev => prev.filter(x => x.id !== u.id));
      addToast(`${u.name} was deleted.`, 'success');
    } catch (err) {
      if (err.status === 401) return logout();
      window.alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Load on open, and again whenever the volunteer comes back to this tab,
  // so people who registered in the meantime show up.
  useEffect(() => {
    if (!isVolunteer) return;
    loadUsers();
    const reloadOnReturn = () => document.visibilityState === 'visible' && loadUsers();
    document.addEventListener('visibilitychange', reloadOnReturn);
    return () => document.removeEventListener('visibilitychange', reloadOnReturn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVolunteer]);

  if (!isVolunteer) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view this page.</div>;
  }

  const query = search.trim().toLowerCase();
  const filteredUsers = usersList.filter(u => {
    const matchesPhase = phaseFilter === 'All' || u.phase === phaseFilter;
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch = !query ||
      [u.name, u.email, u.phone, u.villa_no].some(v => v?.toLowerCase().includes(query));
    return matchesPhase && matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-1">Everyone who has registered</p>
        </div>
        <Button variant="secondary" icon={RefreshCw} onClick={loadUsers} disabled={loading}>Refresh</Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle>
              Users Directory <span className="text-sm font-normal text-gray-500">({filteredUsers.length})</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full sm:w-64 border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  placeholder="Search name, email, phone, villa"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={phaseFilter}
                onChange={(e) => setPhaseFilter(e.target.value)}
              >
                <option value="All">All Phases</option>
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="member">Member</option>
                <option value="volunteer">Volunteer</option>
                <option value="guard">Guard</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-6 text-xs text-gray-500">Name</th>
                <th className="py-3 px-6 text-xs text-gray-500">Role</th>
                <th className="py-3 px-6 text-xs text-gray-500">Phase</th>
                <th className="py-3 px-6 text-xs text-gray-500">Villa No.</th>
                <th className="py-3 px-6 text-xs text-gray-500">Email ID</th>
                <th className="py-3 px-6 text-xs text-gray-500">Mobile Number</th>
                <th className="py-3 px-6 text-xs text-gray-500">Registered</th>
                <th className="py-3 px-6 text-xs text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">
                    <div className="flex items-center">
                      {u.photo_url ? (
                        <a href={u.photo_url} target="_blank" rel="noreferrer">
                          <img src={u.photo_url} alt={u.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200" />
                        </a>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                          <Users className="w-4 h-4" />
                        </div>
                      )}
                      {u.name}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <Badge variant={ROLE_BADGES[u.role]}>{ROLE_LABELS[u.role] || u.role}</Badge>
                  </td>
                  <td className="py-3 px-6 text-sm">{phases.find(p => p.id === u.phase)?.name || u.phase || '-'}</td>
                  <td className="py-3 px-6 text-sm">{u.villa_no || '-'}</td>
                  <td className="py-3 px-6 text-sm">{u.email}</td>
                  <td className="py-3 px-6 text-sm">{u.phone || '-'}</td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap">{format(new Date(u.created_at), 'dd MMM yyyy')}</td>
                  <td className="py-3 px-6 text-right">
                    {u.role !== 'volunteer' && (
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan="8" className="text-center py-6 text-gray-500">Loading users…</td></tr>}
              {!loading && error && <tr><td colSpan="8" className="text-center py-6 text-red-600">{error}</td></tr>}
              {!loading && !error && filteredUsers.length === 0 && (
                <tr><td colSpan="8" className="text-center py-6 text-gray-500">
                  {usersList.length ? "No users match these filters." : "No one has registered yet."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
