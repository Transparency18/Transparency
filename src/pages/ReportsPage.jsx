import { Card, CardHeader, CardTitle, CardContent } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Download } from "lucide-react";

export function ReportsPage() {
  const handleDownload = (type) => {
    alert(`Downloading ${type} report... (Demo functionality)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-500 mt-1">Generate and download community reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Financial Reports</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Download spreadsheets of all collections, pending dues, and expenses.</p>
            <Button className="w-full" variant="outline" icon={Download} onClick={() => handleDownload('Financial')}>Download CSV</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Visitor Logs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Export a complete log of all visitors and service providers.</p>
            <Button className="w-full" variant="outline" icon={Download} onClick={() => handleDownload('Visitor')}>Download CSV</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Security Incidents</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Detailed report of all raised security issues and resolutions.</p>
            <Button className="w-full" variant="outline" icon={Download} onClick={() => handleDownload('Security')}>Download PDF</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
