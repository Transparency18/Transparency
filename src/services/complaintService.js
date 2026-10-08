import { authRequest } from "./authService";

// Keep in sync with Backend/routes/complaints.js.
export const COMPLAINT_CATEGORIES = [
  "Suspicious Activity", "Trespassing", "Theft", "Vandalism", "Noise / Disturbance",
  "Infrastructure Damage", "Street Light", "CCTV / Camera Fault", "Water / Drainage", "Garbage", "Other",
];
export const COMPLAINT_PRIORITIES = ["Low", "Medium", "High"];
export const COMPLAINT_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

const jsonBody = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// Members get their own complaints; guards and volunteers get all.
export async function getComplaints() {
  const { complaints } = await authRequest("/api/complaints");
  return complaints;
}

export async function createComplaint(data) {
  const { complaint } = await authRequest("/api/complaints", jsonBody("POST", data));
  return complaint;
}

// changes: { status?, reply?, priority? } (guards and volunteers)
export async function updateComplaint(id, changes) {
  const { complaint } = await authRequest(`/api/complaints/${id}`, jsonBody("PATCH", changes));
  return complaint;
}

// Volunteers only.
export function deleteComplaint(id) {
  return authRequest(`/api/complaints/${id}`, { method: "DELETE" });
}
