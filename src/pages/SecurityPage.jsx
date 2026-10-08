import { useState, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { phases } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { MessageSquare, Search, Plus, AlertTriangle, CheckCircle, Clock, ShieldAlert, Trash2, MapPin, RefreshCw } from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES,
  getComplaints, createComplaint, updateComplaint, deleteComplaint,
} from "../services/complaintService";

// Statuses each role can set (matches the backend rules).
const STATUS_OPTIONS = {
  [ROLES.GUARD]: ["Open", "In Progress", "Resolved"],
  [ROLES.VOLUNTEER]: COMPLAINT_STATUSES,
};
const STATUS_BADGE = { "Open": "danger", "In Progress": "warning", "Resolved": "success", "Closed": "default" };
const PRIORITY_BADGE = { High: "danger", Medium: "warning", Low: "info" };
const ROLE_LABEL = { member: "Member", guard: "Security Guard", volunteer: "Volunteer" };

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white";
const phaseName = (id) => phases.find(p => p.id === id)?.name || id;

export function SecurityPage() {
  const { role, user, logout } = useAuth();
  const { addToast } = useToast();
  const isMember = role === ROLES.MEMBER;
  const isVolunteer = role === ROLES.VOLUNTEER;
  const isStaff = !isMember;

  const emptyForm = { category: "", priority: "Medium", phase: user?.phase || "", location: "", description: "" };

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [view, setView] = useState("all"); // "all" | "mine"
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [busyId, setBusyId] = useState(null);

  const handleError = (err) => {
    if (err.status === 401) return logout();
    addToast(err.message, "error");
  };

  const loadComplaints = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setComplaints(await getComplaints());
    } catch (err) {
      if (err.status === 401) return logout();
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
    const reloadOnReturn = () => document.visibilityState === "visible" && loadComplaints();
    document.addEventListener("visibilitychange", reloadOnReturn);
    return () => document.removeEventListener("visibilitychange", reloadOnReturn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceComplaint = (updated) =>
    setComplaints(prev => prev.map(c => (c.id === updated.id ? updated : c)));

  const handleReport = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.category) errors.category = "Select a category.";
    if (isStaff && !form.phase) errors.phase = "Select a phase.";
    if (form.description.trim().length < 5) errors.description = "Describe the issue (at least 5 characters).";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const created = await createComplaint({ ...form, description: form.description.trim(), location: form.location.trim() });
      setComplaints(prev => [created, ...prev]);
      setIsReportOpen(false);
      setForm(emptyForm);
      addToast(`Complaint #${created.ticket_no} submitted.`, "success");
    } catch (err) {
      setFormErrors(err.fieldErrors || {});
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = async (c, changes, message) => {
    setBusyId(c.id);
    try {
      replaceComplaint(await updateComplaint(c.id, changes));
      if (message) addToast(message, "success");
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    await handleChange(replyTarget, { reply: replyText }, "Reply saved.");
    setReplyTarget(null);
    setReplyText("");
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete complaint #${c.ticket_no} (${c.category})? This cannot be undone.`)) return;
    setBusyId(c.id);
    try {
      await deleteComplaint(c.id);
      setComplaints(prev => prev.filter(x => x.id !== c.id));
      addToast(`Complaint #${c.ticket_no} deleted.`, "success");
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  // Members receive only their phase's complaints (plus their own) from the API.
  const scoped = view === "mine" ? complaints.filter(c => c.reported_by === user?.id) : complaints;
  const query = searchTerm.trim().toLowerCase();
  const filtered = scoped.filter(c => {
    const matchesSearch = !query || [c.category, c.description, c.location, c.reporter_name, c.reporter_villa, `#${c.ticket_no}`]
      .some(v => v && String(v).toLowerCase().includes(query));
    const matchesStatus = statusFilter === "All"
      || (statusFilter === "Active" ? ["Open", "In Progress"].includes(c.status) : c.status === statusFilter);
    const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;
    const matchesPhase = phaseFilter === "All" || c.phase === phaseFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesPhase;
  });

  const count = (statuses) => scoped.filter(c => statuses.includes(c.status)).length;
  const stats = [
    { label: "Open", value: count(["Open"]), icon: AlertTriangle, tone: "bg-red-100 text-red-600" },
    { label: "In Progress", value: count(["In Progress"]), icon: Clock, tone: "bg-orange-100 text-orange-600" },
    { label: "Resolved", value: count(["Resolved", "Closed"]), icon: CheckCircle, tone: "bg-green-100 text-green-600" },
    { label: "Total Reported", value: scoped.length, icon: ShieldAlert, tone: "bg-blue-100 text-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complaints</h2>
          <p className="text-gray-500 mt-1">
            {isMember
              ? `Issues reported in ${phaseName(user?.phase)}: report one and track what's being done`
              : "Track, respond to and resolve issues reported in the community"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={RefreshCw} onClick={loadComplaints} disabled={loading}>Refresh</Button>
          <Button icon={Plus} onClick={() => { setForm(emptyForm); setFormErrors({}); setIsReportOpen(true); }}>Report Issue</Button>
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
            <div className="flex items-center gap-3">
              <CardTitle>
                {view === "mine" ? "Reported by Me" : isMember ? `${phaseName(user?.phase)} Complaints` : "All Complaints"}
              </CardTitle>
              <div className="flex rounded-lg border border-gray-200 p-0.5 text-sm">
                {[["all", "All"], ["mine", "Mine"]].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className={`px-3 py-1 rounded-md font-medium ${view === key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search #, category, villa, name"
                  className={`${inputClass} pl-9 sm:w-60`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="Active">Open + In Progress</option>
                <option value="All">All Status</option>
                {COMPLAINT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className={inputClass} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
                {COMPLAINT_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {isStaff && (
                <select className={inputClass} value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
                  <option value="All">All Phases</option>
                  {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              )}
            </div>
          </div>
        </CardHeader>

        <div className="divide-y divide-gray-100">
          {loading && <p className="py-10 text-center text-gray-500">Loading complaints…</p>}
          {!loading && loadError && <p className="py-10 text-center text-red-600">{loadError}</p>}
          {!loading && !loadError && filtered.length === 0 && (
            <p className="py-10 text-center text-gray-500">
              {scoped.length === 0
                ? (view === "mine" ? "You haven't reported any issues yet." : isMember ? "No complaints in your phase yet." : "No complaints have been reported yet.")
                : "No complaints match these filters."}
            </p>
          )}

          {!loading && !loadError && filtered.map(c => (
            <div key={c.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">#{c.ticket_no}</span>
                    <span className="font-semibold text-gray-900">{c.category}</span>
                    <Badge variant={STATUS_BADGE[c.status]}>{c.status}</Badge>
                    <Badge variant={PRIORITY_BADGE[c.priority]} className="text-[10px]">{c.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-line break-words">{c.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center"><MapPin className="w-3 h-3 mr-1" />{phaseName(c.phase)}{c.location ? ` · ${c.location}` : ""}</span>
                    <span>
                      By {c.reported_by === user?.id ? "you" : c.reporter_name}
                      {c.reporter_villa ? ` (Villa ${c.reporter_villa})` : ""} · {ROLE_LABEL[c.reporter_role] || c.reporter_role}
                    </span>
                    <span className="inline-flex items-center" title={format(new Date(c.created_at), "dd MMM yyyy, h:mm a")}>
                      <Clock className="w-3 h-3 mr-1" />{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {c.reply && (
                    <div className="mt-3 bg-blue-50 border-l-2 border-blue-500 p-2.5 text-sm text-gray-700 rounded-r">
                      <span className="font-semibold text-blue-800">{c.replied_by_name || "Reply"}: </span>
                      {c.reply}
                    </div>
                  )}
                </div>

                {isStaff && (
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      aria-label="Status"
                      className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white disabled:opacity-50"
                      value={c.status}
                      disabled={busyId === c.id || (!isVolunteer && c.status === "Closed")}
                      onChange={(e) => handleChange(c, { status: e.target.value }, `#${c.ticket_no} marked ${e.target.value}.`)}
                    >
                      {(STATUS_OPTIONS[role].includes(c.status) ? STATUS_OPTIONS[role] : [c.status, ...STATUS_OPTIONS[role]])
                        .map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {isVolunteer && (
                      <select
                        aria-label="Priority"
                        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white disabled:opacity-50"
                        value={c.priority}
                        disabled={busyId === c.id}
                        onChange={(e) => handleChange(c, { priority: e.target.value }, `#${c.ticket_no} priority set to ${e.target.value}.`)}
                      >
                        {COMPLAINT_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    )}
                    <button
                      onClick={() => { setReplyTarget(c); setReplyText(c.reply || ""); }}
                      disabled={busyId === c.id}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                      title={c.reply ? "Edit reply" : "Reply"}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    {isVolunteer && (
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={busyId === c.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Delete complaint"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Report an Issue">
        <form onSubmit={handleReport} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select</option>
                {COMPLAINT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {formErrors.category && <p className="text-xs text-red-600">{formErrors.category}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Priority *</label>
              <select className={inputClass} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {COMPLAINT_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {isMember ? (
            <p className="text-sm text-gray-500">Phase: <span className="font-medium text-gray-800">{phaseName(user?.phase)}</span></p>
          ) : (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phase *</label>
              <select className={inputClass} value={form.phase} onChange={e => setForm({ ...form, phase: e.target.value })}>
                <option value="">Select</option>
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {formErrors.phase && <p className="text-xs text-red-600">{formErrors.phase}</p>}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Exact location</label>
            <input className={inputClass} maxLength={200} placeholder="e.g. Near Gate 2, opposite villa A-110" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description *</label>
            <textarea rows={4} maxLength={2000} className={inputClass} placeholder="What happened, and when?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            {formErrors.description && <p className="text-xs text-red-600">{formErrors.description}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsReportOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit Complaint"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!replyTarget} onClose={() => setReplyTarget(null)} title={`Reply to #${replyTarget?.ticket_no ?? ""}`}>
        <form onSubmit={handleReplySubmit} className="space-y-4">
          <p className="text-sm text-gray-600">{replyTarget?.category}: {replyTarget?.description}</p>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Your reply</label>
            <textarea rows={4} maxLength={2000} className={inputClass} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="The reporter will see this under their complaint." />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setReplyTarget(null)}>Cancel</Button>
            <Button type="submit" disabled={busyId === replyTarget?.id}>Save Reply</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
