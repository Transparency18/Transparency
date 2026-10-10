import { useState, useEffect } from "react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { phases } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Search, Plus, Video, VideoOff, Settings, Activity, Trash2, Pencil, History, RefreshCw } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  CAMERA_TYPES, CAMERA_STATUSES, cameraCode,
  getCameras, getCameraHistory, createCamera, updateCamera, setCameraStatus, deleteCamera,
} from "../services/cameraService";

const STATUS_BADGE = { "Working": "success", "Not Working": "danger", "Under Maintenance": "warning" };
const ROLE_LABEL = { member: "Member", guard: "Security Guard", volunteer: "Volunteer" };

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white";
const phaseName = (id) => phases.find(p => p.id === id)?.name || id;
const emptyForm = { name: "", phase: "", location: "", type: "Bullet", status: "Working", last_maintenance: "", notes: "" };

export function CctvManagementPage() {
  const { role, user, phase, logout } = useAuth();
  const { addToast } = useToast();
  // Volunteers manage cameras; members and guards can only view.
  // Members only get their own phase's cameras from the API, so they have no phase filter.
  const isVolunteer = role === ROLES.VOLUNTEER;
  const isMember = role === ROLES.MEMBER;

  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPhase, setPhaseFilter] = useState(phase || "All");
  const phaseFilter = isMember ? user?.phase || "All" : selectedPhase;
  const [busyId, setBusyId] = useState(null);

  // Add / edit (volunteers): editTarget is null when closed, "new" when adding.
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Status update (volunteers).
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "", note: "" });

  // History (everyone).
  const [historyTarget, setHistoryTarget] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);


  const handleError = (err) => {
    if (err.status === 401) return logout();
    addToast(err.message, "error");
  };

  const loadCameras = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setCameras(await getCameras());
    } catch (err) {
      if (err.status === 401) return logout();
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCameras();
    const reloadOnReturn = () => document.visibilityState === "visible" && loadCameras();
    document.addEventListener("visibilitychange", reloadOnReturn);
    return () => document.removeEventListener("visibilitychange", reloadOnReturn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceCamera = (updated) =>
    setCameras(prev => prev.map(c => (c.id === updated.id ? updated : c)));

  const openAdd = () => {
    setForm({ ...emptyForm, phase: phase !== "All" ? phase : "" });
    setFormErrors({});
    setEditTarget("new");
  };

  const openEdit = (cam) => {
    setForm({
      name: cam.name, phase: cam.phase, location: cam.location, type: cam.type,
      status: cam.status, last_maintenance: cam.last_maintenance || "", notes: cam.notes || "",
    });
    setFormErrors({});
    setEditTarget(cam);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = {};
    if (form.name.trim().length < 2) errors.name = "Enter a camera name.";
    if (!form.phase) errors.phase = "Select a phase.";
    if (!form.location.trim()) errors.location = "Enter where the camera is mounted.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    const isNew = editTarget === "new";
    const { status, ...details } = form;
    setSaving(true);
    try {
      if (isNew) {
        const created = await createCamera({ ...details, status });
        setCameras(prev => [...prev, created]);
        addToast(`${cameraCode(created)} added.`, "success");
      } else {
        const updated = await updateCamera(editTarget.id, details);
        replaceCamera(updated);
        addToast(`${cameraCode(updated)} updated.`, "success");
      }
      setEditTarget(null);
    } catch (err) {
      setFormErrors(err.fieldErrors || {});
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const openStatus = (cam) => {
    setStatusForm({ status: cam.status, note: "" });
    setStatusTarget(cam);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    const cam = statusTarget;
    setBusyId(cam.id);
    try {
      const updated = await setCameraStatus(cam.id, statusForm.status, statusForm.note.trim());
      replaceCamera(updated);
      addToast(`${cameraCode(updated)} marked ${updated.status}.`, "success");
      setStatusTarget(null);
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const openHistory = async (cam) => {
    setHistoryTarget(cam);
    setHistory([]);
    setHistoryLoading(true);
    try {
      setHistory(await getCameraHistory(cam.id));
    } catch (err) {
      handleError(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDelete = async (cam) => {
    if (!window.confirm(`Delete ${cameraCode(cam)} (${cam.name}) and its status history? This cannot be undone.`)) return;
    setBusyId(cam.id);
    try {
      await deleteCamera(cam.id);
      setCameras(prev => prev.filter(c => c.id !== cam.id));
      addToast(`${cameraCode(cam)} deleted.`, "success");
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const inPhase = phaseFilter === "All" ? cameras : cameras.filter(c => c.phase === phaseFilter);
  const query = searchTerm.trim().toLowerCase();
  const filtered = inPhase.filter(c => {
    const matchesSearch = !query || [cameraCode(c), c.name, c.location, c.type]
      .some(v => v && v.toLowerCase().includes(query));
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const count = (status) => inPhase.filter(c => c.status === status).length;
  const stats = [
    { label: "Total Cameras", value: inPhase.length, icon: Video, tone: "bg-blue-100 text-blue-600" },
    { label: "Working", value: count("Working"), icon: Activity, tone: "bg-green-100 text-green-600" },
    { label: "Not Working", value: count("Not Working"), icon: VideoOff, tone: "bg-red-100 text-red-600" },
    { label: "Under Maintenance", value: count("Under Maintenance"), icon: Settings, tone: "bg-orange-100 text-orange-600" },
  ];

  const iconButton = "p-1.5 rounded transition-colors disabled:opacity-50";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CCTV Cameras</h2>
          <p className="text-gray-500 mt-1">
            {isMember
              ? `Where the cameras in ${phaseName(user?.phase)} are and which ones are working`
              : !isVolunteer
              ? "Where the community's cameras are and which ones are working"
              : "Monitor the community camera network and keep its status up to date"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={RefreshCw} onClick={loadCameras} disabled={loading}>Refresh</Button>
          {isVolunteer && <Button icon={Plus} onClick={openAdd}>Add Camera</Button>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${s.tone}`}><s.icon className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3">
            <CardTitle>{phaseFilter === "All" ? "All Cameras" : `${phaseName(phaseFilter)} Cameras`}</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search CAM-001, name, location"
                  className={`${inputClass} pl-9 sm:w-64`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                {CAMERA_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {!isMember && (
                <select className={inputClass} value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
                  <option value="All">All Phases</option>
                  {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              )}
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Camera</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phase / Location</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr><td colSpan="5" className="py-10 text-center text-gray-500">Loading cameras…</td></tr>
              )}
              {!loading && loadError && (
                <tr><td colSpan="5" className="py-10 text-center text-red-600">{loadError}</td></tr>
              )}
              {!loading && !loadError && filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500">
                    {cameras.length === 0
                      ? (isVolunteer ? "No cameras yet. Use Add Camera to register the first one." : "No cameras have been added yet.")
                      : "No cameras match these filters."}
                  </td>
                </tr>
              )}

              {!loading && !loadError && filtered.map(cam => (
                <tr key={cam.id} className="hover:bg-gray-50 transition-colors align-top">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{cam.name}</div>
                    <div className="text-sm text-gray-500 font-mono">{cameraCode(cam)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">{phaseName(cam.phase)}</div>
                    <div className="text-sm text-gray-500">{cam.location}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{cam.type}</td>
                  <td className="py-4 px-6 max-w-xs">
                    <Badge variant={STATUS_BADGE[cam.status]}>{cam.status}</Badge>
                    {cam.status_note && <p className="mt-1 text-sm text-gray-600 break-words">{cam.status_note}</p>}
                    {cam.status_updated_at && (
                      <p className="mt-1 text-xs text-gray-400" title={format(new Date(cam.status_updated_at), "dd MMM yyyy, h:mm a")}>
                        {formatDistanceToNow(new Date(cam.status_updated_at), { addSuffix: true })}
                        {cam.status_updated_by_name ? ` by ${cam.status_updated_by_name}` : ""}
                      </p>
                    )}
                    {cam.last_maintenance && (
                      <p className="text-xs text-gray-400">Last serviced {format(parseISO(cam.last_maintenance), "dd MMM yyyy")}</p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    {isVolunteer && (
                      <Button size="sm" variant="secondary" className="mr-1" disabled={busyId === cam.id} onClick={() => openStatus(cam)}>
                        Update Status
                      </Button>
                    )}
                    <button onClick={() => openHistory(cam)} className={`${iconButton} text-gray-500 hover:bg-gray-100`} title="Status history">
                      <History className="w-4 h-4" />
                    </button>
                    {isVolunteer && (
                      <>
                        <button onClick={() => openEdit(cam)} disabled={busyId === cam.id} className={`${iconButton} text-blue-600 hover:bg-blue-50`} title="Edit camera">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cam)} disabled={busyId === cam.id} className={`${iconButton} text-red-500 hover:bg-red-50`} title="Delete camera">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title={editTarget === "new" ? "Add Camera" : `Edit ${editTarget ? cameraCode(editTarget) : ""}`}>
        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Camera name *</label>
            <input className={inputClass} maxLength={100} placeholder="e.g. Back Gate Cam 2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {formErrors.name && <p className="text-xs text-red-600">{formErrors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phase *</label>
              <select className={inputClass} value={form.phase} onChange={e => setForm({ ...form, phase: e.target.value })}>
                <option value="">Select</option>
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {formErrors.phase && <p className="text-xs text-red-600">{formErrors.phase}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Camera type *</label>
              <select className={inputClass} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {CAMERA_TYPES.map(t => <option key={t} value={t}>{t === "PTZ" ? "PTZ (Pan-Tilt-Zoom)" : t}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Exact location *</label>
            <input className={inputClass} maxLength={200} placeholder="e.g. Corner of Avenue 3, facing the park" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            {formErrors.location && <p className="text-xs text-red-600">{formErrors.location}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {editTarget === "new" && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Current status</label>
                <select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {CAMERA_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Last serviced</label>
              <input type="date" className={inputClass} max={new Date().toISOString().slice(0, 10)} value={form.last_maintenance} onChange={e => setForm({ ...form, last_maintenance: e.target.value })} />
              {formErrors.last_maintenance && <p className="text-xs text-red-600">{formErrors.last_maintenance}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea rows={3} maxLength={1000} className={inputClass} placeholder="Vendor, DVR channel, warranty, anything useful" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            {formErrors.notes && <p className="text-xs text-red-600">{formErrors.notes}</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Camera"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!statusTarget} onClose={() => setStatusTarget(null)} title={`Update ${statusTarget ? cameraCode(statusTarget) : ""} status`}>
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">{statusTarget?.name} · {statusTarget?.location}</p>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select className={inputClass} value={statusForm.status} onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
              {CAMERA_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Note</label>
            <textarea
              rows={3} maxLength={500} className={inputClass} value={statusForm.note}
              onChange={e => setStatusForm({ ...statusForm, note: e.target.value })}
              placeholder={statusForm.status === "Working" ? "e.g. Power adapter replaced" : "e.g. No video since last night, cable looks cut"}
            />
            <p className="text-xs text-gray-400">Residents see this note next to the camera.</p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setStatusTarget(null)}>Cancel</Button>
            <Button type="submit" disabled={busyId === statusTarget?.id}>Save Status</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!historyTarget} onClose={() => setHistoryTarget(null)} title={`${historyTarget ? cameraCode(historyTarget) : ""} history`}>
        <p className="text-sm text-gray-600 mb-4">{historyTarget?.name} · {phaseName(historyTarget?.phase)}, {historyTarget?.location}</p>
        {historyTarget?.notes && <p className="text-sm text-gray-600 mb-4 whitespace-pre-line bg-gray-50 rounded-lg p-3">{historyTarget.notes}</p>}
        {historyLoading && <p className="py-6 text-center text-gray-500 text-sm">Loading history…</p>}
        {!historyLoading && history.length === 0 && <p className="py-6 text-center text-gray-500 text-sm">No status changes recorded yet.</p>}
        <ol className="space-y-3">
          {history.map(h => (
            <li key={h.id} className="border-l-2 border-gray-200 pl-3">
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_BADGE[h.status]}>{h.status}</Badge>
                <span className="text-xs text-gray-500">{format(new Date(h.created_at), "dd MMM yyyy, h:mm a")}</span>
              </div>
              {h.note && <p className="mt-1 text-sm text-gray-700 break-words">{h.note}</p>}
              <p className="text-xs text-gray-400">by {h.changed_by_name} · {ROLE_LABEL[h.changed_by_role] || h.changed_by_role}</p>
            </li>
          ))}
        </ol>
      </Modal>

    </div>
  );
}
