import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  VOLUNTEER: "Volunteer",
  GUARD: "Security Guard",
  RESIDENT: "Resident"
};

export const AuthProvider = ({ children }) => {
  // Try to load role from localStorage, default to Super Admin
  const [role, setRole] = useState(() => {
    return localStorage.getItem('Transparency_demo_role') || ROLES.VOLUNTEER;
  });

  const [phase, setPhase] = useState(() => {
    return localStorage.getItem('Transparency_demo_phase') || 'All';
  });

  const [sector, setSector] = useState(() => {
    return localStorage.getItem('Transparency_demo_sector') || 's2';
  });

  useEffect(() => {
    localStorage.setItem('Transparency_demo_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('Transparency_demo_phase', phase);
  }, [phase]);

  useEffect(() => {
    localStorage.setItem('Transparency_demo_sector', sector);
  }, [sector]);

  return (
    <AuthContext.Provider value={{ role, setRole, ROLES, phase, setPhase, sector, setSector }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
