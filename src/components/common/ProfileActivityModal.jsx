import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Modal } from "./Modal";
import { Badge } from "./Badge";
import { User, Phone, Mail, MapPin, Home, CalendarDays, AlertTriangle, CheckCircle, Video, VideoOff } from "lucide-react";
import { useAuth, ROLES } from "../../context/AuthContext";
import { phases } from "../../data/mockData";
import { getComplaints } from "../../services/complaintService";
import { getCameras, cameraCode } from "../../services/cameraService";

const STATUS_BADGE = { "Open": "danger", "In Progress": "warning", "Resolved": "success", "Closed": "default" };
const CAMERA_BADGE = { "Working": "success", "Not Working": "danger", "Under Maintenance": "warning" };
const phaseName = (id) => phases.find(p => p.id === id)?.name || id;

// Users who register without an email get a placeholder address; don't show it.
const realEmail = (email) => (email && !email.endsWith("@resident.app") ? email : null);

export function ProfileActivityModal({ isOpen, onClose }) {
  const { user, role } = useAuth();
  const isMember = role === ROLES.MEMBER;
  const [complaints, setComplaints] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isOpen || !user) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        // Members get only their phase's cameras from the API; staff get all.
        const [allComplaints, allCameras] = await Promise.all([getComplaints(), getCameras()]);
        if (cancelled) return;
        setComplaints(allComplaints.filter(c => c.reported_by === user.id));
        setCameras(allCameras);
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const details = [
    { icon: Phone, label: "Mobile", value: user.phone },
    { icon: Mail, label: "Email", value: realEmail(user.email) },
    { icon: MapPin, label: "Phase", value: user.phase ? phaseName(user.phase) : null },
    { icon: Home, label: "Villa", value: user.villa_no },
    { icon: CalendarDays, label: "Member since", value: user.created_at ? format(new Date(user.created_at), "dd MMM yyyy") : null },
  ].filter(d => d.value);

  const openComplaints = complaints.filter(c => c.status === "Open" || c.status === "In Progress").length;
  const workingCameras = cameras.filter(c => c.status === "Working").length;
  const downCameras = cameras.filter(c => c.status !== "Working");
  const stats = [
    { label: "Complaints Reported", value: complaints.length, icon: AlertTriangle, tone: "bg-red-50 border-red-100 text-red-500" },
    { label: "Still Open", value: openComplaints, icon: CheckCircle, tone: "bg-orange-50 border-orange-100 text-orange-500" },
    { label: isMember ? "Cameras in My Phase" : "Cameras Working", value: isMember ? cameras.length : `${workingCameras} / ${cameras.length}`, icon: Video, tone: "bg-blue-50 border-blue-100 text-blue-500" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile">
      <div className="space-y-6">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          {user.photo_url ? (
            <img src={user.photo_url} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
              <User className="w-8 h-8" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 font-medium">{role}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.map(d => (
            <div key={d.label} className="flex items-start gap-2 text-sm">
              <d.icon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
              <div className="min-w-0">
                <dt className="text-xs text-gray-500">{d.label}</dt>
                <dd className="font-medium text-gray-900 break-words">{d.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {loading && <p className="text-center text-sm text-gray-500 py-4">Loading your activity…</p>}
        {!loading && loadError && <p className="text-center text-sm text-red-600 py-4">{loadError}</p>}

        {!loading && !loadError && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(s => (
                <div key={s.label} className={`rounded-lg p-3 text-center border ${s.tone}`}>
                  <s.icon className="w-5 h-5 mx-auto mb-1" />
                  <h4 className="text-xl font-bold text-gray-900">{s.value}</h4>
                  <p className="text-xs text-gray-600 font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-2">My Complaints</h3>
              {complaints.length === 0 ? (
                <p className="text-sm text-gray-500">You haven't reported any issues yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                  {complaints.slice(0, 5).map(c => (
                    <li key={c.id} className="p-3 text-sm flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">#{c.ticket_no} {c.category}</p>
                        <p className="text-gray-600 truncate">{c.description}</p>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</p>
                      </div>
                      <Badge variant={STATUS_BADGE[c.status]} className="self-start shrink-0">{c.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
              {complaints.length > 5 && (
                <Link to="/security" onClick={onClose} className="text-xs text-blue-600 hover:underline mt-2 inline-block">See all {complaints.length} complaints</Link>
              )}
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {isMember ? `Cameras in ${phaseName(user.phase)}` : "Cameras Needing Attention"}
              </h3>
              {cameras.length === 0 ? (
                <p className="text-sm text-gray-500">No cameras have been added{isMember ? " in your phase" : ""} yet.</p>
              ) : (
                <>
                  {isMember && (
                    <p className="text-sm text-gray-600 mb-2">{workingCameras} of {cameras.length} working.</p>
                  )}
                  {(isMember ? cameras : downCameras).length === 0 ? (
                    <p className="text-sm text-gray-500 inline-flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" />All cameras are working.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg max-h-56 overflow-y-auto">
                      {(isMember ? cameras : downCameras).map(cam => (
                        <li key={cam.id} className="p-3 text-sm flex justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">
                              {cam.status !== "Working" && <VideoOff className="w-3.5 h-3.5 inline mr-1 text-red-500" />}
                              {cam.name} <span className="text-xs font-mono text-gray-400">{cameraCode(cam)}</span>
                            </p>
                            <p className="text-gray-600">{isMember ? cam.location : `${phaseName(cam.phase)} · ${cam.location}`}</p>
                            {cam.status_note && <p className="text-xs text-gray-500">{cam.status_note}</p>}
                          </div>
                          <Badge variant={CAMERA_BADGE[cam.status]} className="self-start shrink-0">{cam.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              <Link to="/cctv" onClick={onClose} className="text-xs text-blue-600 hover:underline mt-2 inline-block">Open CCTV Cameras</Link>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
}
