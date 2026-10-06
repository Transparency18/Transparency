import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Shield, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { phases } from "../data/mockData";

export function GuardsPage() {
  const [guards, setGuards] = useState([]);
  const { phase } = useAuth();

  useEffect(() => {
    const allUsers = localDb.getUsers();
    setGuards(allUsers.filter(u => u.role === 'Guard'));
  }, []);

  const filteredGuards = guards.filter(u => phase === 'All' || u.phase === phase || !u.phase);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Guards</h2>
          <p className="text-gray-500 mt-1">View active security personnel and shifts</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Guard Schedule & Directory</CardTitle>
        </CardHeader>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Guard Name</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Shift Timing</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Phase</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuards.map(guard => (
              <tr key={guard.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 font-medium">
                  <div className="flex items-center">
                    {guard.photo ? (
                      <img src={guard.photo} alt={guard.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                        <Shield className="w-4 h-4" />
                      </div>
                    )}
                    {guard.name}
                  </div>
                </td>
                <td className="py-3 px-6 text-sm">
                  <Badge variant={guard.shift === 'Day' ? 'warning' : (guard.shift === 'Night' ? 'default' : 'primary')}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {guard.shift} Shift
                  </Badge>
                </td>
                <td className="py-3 px-6 text-sm">
                  {phases.find(p => p.id === guard.phase)?.name || guard.phase}
                  
                </td>
                <td className="py-3 px-6 text-sm">{guard.contact}</td>
              </tr>
            ))}
            {filteredGuards.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">No guards assigned to this phase.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
