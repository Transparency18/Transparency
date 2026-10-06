import { authRequest } from "./authService";

// All registered users except the caller, newest first (volunteers only).
export async function getUsers() {
  const { users } = await authRequest("/api/users");
  return users;
}

// role: "member" | "volunteer" | "guard" (volunteers only).
export function changeUserRole(id, role) {
  return authRequest(`/api/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

// Deletes a user's account, profile and photo (volunteers only).
export function deleteUser(id) {
  return authRequest(`/api/users/${id}`, { method: "DELETE" });
}
