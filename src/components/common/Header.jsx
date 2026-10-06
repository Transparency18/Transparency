import { useState } from "react";
import { Bell, Menu, User } from "lucide-react";
import { useAuth, ROLES } from "../../context/AuthContext";
import { ProfileActivityModal } from "./ProfileActivityModal";
import { phases } from "../../data/mockData";

export function Header({ setSidebarOpen }) {
  const { role, setRole, phase, setPhase, sector, setSector } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-2 lg:ml-0 hidden sm:block">
            Community Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2">
            {/* Phase Switcher */}
            {role === ROLES.VOLUNTEER && (
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 hidden sm:flex">
                <span className="text-xs text-gray-500 mr-2 font-medium uppercase tracking-wider">Phase:</span>
                <select 
                  className="bg-transparent text-xs sm:text-sm font-medium text-gray-900 outline-none cursor-pointer"
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                >
                  <option value="All">All Phases</option>
                  {phases.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
            


            {/* Role Switcher for Demo */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5">
              <span className="hidden sm:inline text-xs text-gray-500 mr-2 font-medium uppercase tracking-wider">Demo:</span>
              <select 
                className="bg-transparent text-xs sm:text-sm font-medium text-gray-900 outline-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {Object.values(ROLES).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div 
            className="flex items-center space-x-2 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg p-1 pr-2 transition-colors"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-gray-700">Sudeep</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          </div>
        </div>
      </header>

      <ProfileActivityModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        userName="Sudeep" 
        role={role} 
      />
    </>
  );
}

