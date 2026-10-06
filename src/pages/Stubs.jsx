export function PlaceholderPage({ title }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">This module is under construction.</p>
      </div>
    </div>
  );
}

export const InfrastructurePage = () => <PlaceholderPage title="Infrastructure & Street Lights" />;
export const PatrolsPage = () => <PlaceholderPage title="Patrol Management" />;
export const VehiclesPage = () => <PlaceholderPage title="Vehicle Management" />;
export const AssociationPage = () => <PlaceholderPage title="Association Management" />;
export const PaymentsPage = () => <PlaceholderPage title="Payment Tracking" />;
export const ExpensesPage = () => <PlaceholderPage title="Expense Tracking" />;
export const ServicesPage = () => <PlaceholderPage title="Service Providers" />;
export const AnnouncementsPage = () => <PlaceholderPage title="Announcements & Notifications" />;
export const ReportsPage = () => <PlaceholderPage title="Reports & Analytics" />;
export const SettingsPage = () => <PlaceholderPage title="System Settings" />;
