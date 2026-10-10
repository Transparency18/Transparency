import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Shield, Phone, Search, Trash2, RefreshCw } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { phases } from "../data/mockData";
import { getGuards, changeUserRole, deleteUser } from "../services/userService";

const ROLE_LABELS = { guard: "Guard", member: "Member", volunteer: "Volunteer" };
const phaseName = (id) => phases.find(p => p.id === id)?.name || id || "-";

// Guards are users whose role is "guard"; volunteers assign that role here or on the Users page.
export function GuardsPage() {
  const { role, logout } = useAuth();
  const { addToast } = useToast();
  const isVolunteer = role === ROLES.VOLUNTEER;

  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const handleError = (err) => {
    if (err.status === 401) return logout();
    addToast(err.message, "error");
  };

  const loadGuards = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setGuards(await getGuards());
    } catch (err) {
      if (err.status === 401) return logout();
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reload when coming back to the tab, so role changes made elsewhere show up.
  useEffect(() => {
    loadGuards();
    const reloadOnReturn = () => document.visibilityState === "visible" && loadGuards();
    document.addEventListener("visibilitychange", reloadOnReturn);
    return () => document.removeEventListener("visibilitychange", reloadOnReturn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = async (g, newRole) => {
    if (newRole === "guard") return;
    const warning = newRole === "volunteer"
      ? `Make ${g.name} a volunteer? They will be able to see, change and delete all users.`
      : `Change ${g.name} to a member? They will be removed from the Security Guards list.`;
    if (!window.confirm(warning)) return;
    setBusyId(g.id);
    try {
      await changeUserRole(g.id, newRole);
      setGuards(prev => prev.filter(x => x.id !== g.id));
      addToast(`${g.name} is now a ${ROLE_LABELS[newRole]}.`, "success");
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (g) => {
    if (!window.confirm(`Delete ${g.name} (${g.phone || "no phone"})? This removes their account and cannot be undone.`)) return;
    setBusyId(g.id);
    try {
      await deleteUser(g.id);
      setGuards(prev => prev.filter(x => x.id !== g.id));
      addToast(`${g.name} was deleted.`, "success");
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const query = search.trim().toLowerCase();
  const filtered = guards.filter(g => !query || [g.name, g.phone].some(v => v?.toLowerCase().includes(query)));
  const columns = isVolunteer ? 5 : 4;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Guards</h2>
          <p className="text-gray-500 mt-1">
            {isVolunteer
              ? "Give someone the Guard role on the Users page and they appear here"
              : "Security personnel on duty in the community and how to reach them"}
          </p>
        </div>
        <Button variant="secondary" icon={RefreshCw} onClick={loadGuards} disabled={loading}>Refresh</Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle>
              Guard Directory <span className="text-sm font-normal text-gray-500">({filtered.length})</span>
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                placeholder="Search name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-6 text-xs text-gray-500 uppercase">Guard Name</th>
                <th className="py-3 px-6 text-xs text-gray-500 uppercase">Contact Number</th>
                <th className="py-3 px-6 text-xs text-gray-500 uppercase">Phase</th>
                <th className="py-3 px-6 text-xs text-gray-500 uppercase">Joined</th>
                {isVolunteer && <th className="py-3 px-6 text-xs text-gray-500 uppercase text-right">Role / Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={columns} className="text-center py-6 text-gray-500">Loading guards…</td></tr>}
              {!loading && loadError && <tr><td colSpan={columns} className="text-center py-6 text-red-600">{loadError}</td></tr>}
              {!loading && !loadError && filtered.length === 0 && (
                <tr><td colSpan={columns} className="text-center py-6 text-gray-500">
                  {guards.length ? "No guards match your search." : "No security guards yet."}
                </td></tr>
              )}
              {!loading && !loadError && filtered.map(g => (
                <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">
                    <div className="flex items-center">
                      {g.photo_url ? (
                        <img src={g.photo_url} alt={g.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                          <Shield className="w-4 h-4" />
                        </div>
                      )}
                      {g.name}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    {g.phone ? (
                      <a href={`tel:${g.phone}`} className="inline-flex items-center text-blue-600 hover:underline">
                        <Phone className="w-3.5 h-3.5 mr-1" />{g.phone}
                      </a>
                    ) : "-"}
                  </td>
                  <td className="py-3 px-6 text-sm">{phaseName(g.phase)}</td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap">{format(new Date(g.created_at), "dd MMM yyyy")}</td>
                  {isVolunteer && (
                    <td className="py-3 px-6 text-right whitespace-nowrap">
                      <select
                        aria-label={`Role for ${g.name}`}
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium outline-none cursor-pointer border-0 bg-orange-100 text-orange-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 mr-2"
                        value="guard"
                        disabled={busyId === g.id}
                        onChange={(e) => handleRoleChange(g, e.target.value)}
                      >
                        {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                      <button
                        onClick={() => handleDelete(g)}
                        disabled={busyId === g.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 align-middle"
                        title="Delete guard"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
