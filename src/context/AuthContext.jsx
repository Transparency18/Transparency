import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, onSessionChange, login as apiLogin, logout as apiLogout } from '../services/authService';

const AuthContext = createContext();

export const ROLES = {
  VOLUNTEER: "Volunteer",
  GUARD: "Security Guard",
  MEMBER: "Member"
};

// profiles.role in the database -> role used across the app
const ROLE_BY_DB_VALUE = {
  member: ROLES.MEMBER,
  volunteer: ROLES.VOLUNTEER,
  guard: ROLES.GUARD,
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getSession);
  const user = session?.user ?? null;
  const role = ROLE_BY_DB_VALUE[user?.role] ?? ROLES.MEMBER;

  // Follow logins/logouts in other tabs; otherwise this tab would keep showing the old
  // user while its requests go out with the other tab's token.
  useEffect(() => onSessionChange(setSession), []);

  // Volunteers can switch phase; members always see their own phase.
  const [selectedPhase, setPhase] = useState(() => {
    return localStorage.getItem('Transparency_demo_phase') || 'All';
  });
  const phase = role === ROLES.MEMBER ? (user?.phase ?? 'All') : selectedPhase;

  const [sector, setSector] = useState(() => {
    return localStorage.getItem('Transparency_demo_sector') || 's2';
  });

  useEffect(() => {
    localStorage.setItem('Transparency_demo_phase', selectedPhase);
  }, [selectedPhase]);

  useEffect(() => {
    localStorage.setItem('Transparency_demo_sector', sector);
  }, [sector]);

  const login = async (phone, password) => {
    const newSession = await apiLogin(phone, password);
    setSession(newSession);
    return newSession;
  };

  const logout = () => {
    apiLogout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, role, ROLES, phase, setPhase, sector, setSector }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

