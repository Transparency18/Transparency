import { API_URL } from "../config";

const SESSION_KEY = "Transparency_session";

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error("Cannot reach the server. Please check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong. Please try again.");
    error.status = res.status;
    error.fieldErrors = data.errors || {};
    throw error;
  }
  return data;
}

const jsonPost = (body) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// formData: name, email, phone, phase, villaNo, password, photo (optional File)
export function register(formData) {
  return request("/api/auth/register", { method: "POST", body: formData });
}

export async function login(email, password) {
  const session = await request("/api/auth/login", jsonPost({ email, password }));
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    return session?.user ? session : null;
  } catch {
    return null;
  }
}

// Calls a protected endpoint. Access tokens expire after ~1 hour, so on a 401
// it swaps the refresh token for a new pair once and retries.
export async function authRequest(path, options = {}) {
  const session = getSession();
  if (!session) throw Object.assign(new Error("Please log in."), { status: 401 });

  const send = (token) =>
    request(path, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });

  try {
    return await send(session.token);
  } catch (err) {
    if (err.status !== 401 || !session.refreshToken) throw err;
    const fresh = await request("/api/auth/refresh", jsonPost({ refreshToken: session.refreshToken }));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, ...fresh }));
    return send(fresh.token);
  }
}
