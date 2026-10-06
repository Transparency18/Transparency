import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/common/Sidebar";
import { Header } from "../components/common/Header";
import { cn } from "../utils/cn";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", sidebarOpen ? "lg:pl-64" : "pl-0")}>
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
