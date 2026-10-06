import { Card, CardHeader, CardTitle, CardContent } from "../components/common/Card";
import { Button } from "../components/common/Button";

export function SettingsPage() {
  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully! (Demo functionality)");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Settings</h2>
          <p className="text-gray-500 mt-1">Configure global community parameters</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Community Name</label>
                <input type="text" className="w-full border rounded p-2" defaultValue="Sunset Valley Apartments" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                <input type="email" className="w-full border rounded p-2" defaultValue="admin@sunsetvalley.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Access Rules</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-approve frequent visitors</p>
                <p className="text-sm text-gray-500">Automatically grant access to known service providers</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Require OTP for exit</p>
                <p className="text-sm text-gray-500">Security guards must verify OTP before letting visitors exit</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
