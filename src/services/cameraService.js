import { authRequest } from "./authService";

// Keep in sync with Backend/routes/cameras.js.
export const CAMERA_TYPES = ["Bullet", "Dome", "PTZ", "Other"];
export const CAMERA_STATUSES = ["Working", "Not Working", "Under Maintenance"];

// camera_no 7 -> "CAM-007"
export const cameraCode = (camera) => `CAM-${String(camera.camera_no).padStart(3, "0")}`;

const jsonBody = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// All logged-in users see every camera.
export async function getCameras() {
  const { cameras } = await authRequest("/api/cameras");
  return cameras;
}

export async function getCameraHistory(id) {
  const { history } = await authRequest(`/api/cameras/${id}/history`);
  return history;
}

// Volunteers only. data: { name, phase, location, type, status?, last_maintenance?, notes? }
export async function createCamera(data) {
  const { camera } = await authRequest("/api/cameras", jsonBody("POST", data));
  return camera;
}

// Volunteers only. changes: { name?, phase?, location?, type?, last_maintenance?, notes? }
export async function updateCamera(id, changes) {
  const { camera } = await authRequest(`/api/cameras/${id}`, jsonBody("PATCH", changes));
  return camera;
}

// Volunteers only.
export async function setCameraStatus(id, status, note) {
  const { camera } = await authRequest(`/api/cameras/${id}/status`, jsonBody("POST", { status, note }));
  return camera;
}

// Volunteers only.
export function deleteCamera(id) {
  return authRequest(`/api/cameras/${id}`, { method: "DELETE" });
}
