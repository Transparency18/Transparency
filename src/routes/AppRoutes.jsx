import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { CctvManagementPage } from "../pages/CctvManagementPage";
import { VisitorManagementPage } from "../pages/VisitorManagementPage";
import { SecurityPage } from "../pages/SecurityPage";
import { PaymentsPage } from "../pages/PaymentsPage";
import { ExpensesPage } from "../pages/ExpensesPage";
import { AnnouncementsPage } from "../pages/AnnouncementsPage";
import { InfrastructurePage } from "../pages/InfrastructurePage";
import { VehiclesPage } from "../pages/VehiclesPage";
import { PatrolsPage } from "../pages/PatrolsPage";
import { AssociationPage } from "../pages/AssociationPage";
import { ServicesPage } from "../pages/ServicesPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { UserManagementPage } from "../pages/UserManagementPage";
import { GuardsPage } from "../pages/GuardsPage";
import { ClosedHousesPage } from "../pages/ClosedHousesPage";
import { ResidentBusinessesPage } from "../pages/ResidentBusinessesPage";
import { VolunteersPage } from "../pages/VolunteersPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="cctv" element={<CctvManagementPage />} />
        <Route path="infrastructure" element={<InfrastructurePage />} />
        <Route path="visitors" element={<VisitorManagementPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="guards" element={<GuardsPage />} />
        <Route path="patrols" element={<PatrolsPage />} />
        <Route path="association" element={<AssociationPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="closed-houses" element={<ClosedHousesPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="businesses" element={<ResidentBusinessesPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="volunteers" element={<VolunteersPage />} />
      </Route>
    </Routes>
  );
}
