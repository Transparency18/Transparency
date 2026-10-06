import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { Shield } from "lucide-react";
import { navItems } from "../../routes/navItems";

export function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const { role } = useAuth();

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-blue-600 shrink-0">
          <Shield className="w-8 h-8 text-white mr-3" />
          <span className="text-xl font-bold text-white tracking-tight">URG Transparency</span>
        </div>

        <div className="overflow-y-auto flex-1 py-4">
          <nav className="space-y-1 px-3">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-blue-700" : "text-gray-500")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
