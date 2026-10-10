import { ROLES } from "../context/AuthContext";
import {
  LayoutDashboard, Shield, Video, MapPin,
  Users, Car, Building, IndianRupee,
  Wallet, Wrench, Bell, FileText, Settings, UserCog, Store
} from "lucide-react";

// Pages and the roles allowed to open them. Used by the sidebar and the route guard.
export const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: Object.values(ROLES) },
  { name: "Complaints", path: "/security", icon: Shield, roles: [ROLES.VOLUNTEER, ROLES.GUARD, ROLES.MEMBER] },
  { name: "CCTV Cameras", path: "/cctv", icon: Video, roles: Object.values(ROLES) },
  { name: "Street Lights", path: "/infrastructure", icon: MapPin, roles: [ROLES.VOLUNTEER] },
  { name: "Visitors", path: "/visitors", icon: Users, roles: [ROLES.GUARD, ROLES.VOLUNTEER] },
  { name: "Vehicles", path: "/vehicles", icon: Car, roles: [ROLES.GUARD, ROLES.VOLUNTEER] },
  { name: "Security Guards", path: "/guards", icon: Shield, roles: Object.values(ROLES) },
  { name: "Volunteers", path: "/volunteers", icon: Users, roles: Object.values(ROLES) },
  { name: "Guard Rounds", path: "/patrols", icon: Shield, roles: [ROLES.VOLUNTEER, ROLES.GUARD] },
  { name: "Association", path: "/association", icon: Building, roles: [ROLES.VOLUNTEER] },
  { name: "Payments", path: "/payments", icon: IndianRupee, roles: [ROLES.VOLUNTEER, ROLES.MEMBER] },
  { name: "Expenses", path: "/expenses", icon: Wallet, roles: [ROLES.VOLUNTEER] },
  { name: "Closed Houses", path: "/closed-houses", icon: Building, roles: Object.values(ROLES) },
  { name: "Services", path: "/services", icon: Wrench, roles: Object.values(ROLES) },
  { name: "Resident Businesses", path: "/businesses", icon: Store, roles: Object.values(ROLES) },
  { name: "Announcements", path: "/announcements", icon: Bell, roles: Object.values(ROLES) },
  { name: "Reports", path: "/reports", icon: FileText, roles: [ROLES.VOLUNTEER] },
  { name: "Settings", path: "/settings", icon: Settings, roles: [ROLES.VOLUNTEER] },
  { name: "Users", path: "/users", icon: UserCog, roles: [ROLES.VOLUNTEER] },
];

// Nav item that owns a URL path, e.g. "/cctv/123" -> CCTV Cameras.
export function findNavItem(pathname) {
  return navItems.find((item) =>
    item.path === "/" ? pathname === "/" : pathname === item.path || pathname.startsWith(item.path + "/")
  );
}
