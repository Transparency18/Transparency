import { useState, useEffect } from "react";
import { localDb } from "../services/localDb";
import { Card, CardHeader, CardTitle } from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import { phases } from "../data/mockData";
import { User } from "lucide-react";

export function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const { phase } = useAuth();

  useEffect(() => {
    const allUsers = localDb.getUsers();
    setVolunteers(allUsers.filter(u => u.role === 'Volunteer'));
  }, []);

  const filteredVolunteers = volunteers.filter(u => phase === 'All' || u.phase === phase || !u.phase);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Volunteers</h2>
          <p className="text-gray-500 mt-1">Directory of community volunteers and committee members</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Volunteer Directory</CardTitle>
        </CardHeader>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Name</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Phase</th>
              <th className="py-3 px-6 text-xs text-gray-500 uppercase">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.map(volunteer => (
              <tr key={volunteer.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 font-medium">
                  <div className="flex items-center">
                    {volunteer.photo ? (
                      <img src={volunteer.photo} alt={volunteer.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    {volunteer.name}
                  </div>
                </td>
                <td className="py-3 px-6 text-sm">
                  {phases.find(p => p.id === volunteer.phase)?.name || volunteer.phase}
                  
                </td>
                <td className="py-3 px-6 text-sm">{volunteer.contact}</td>
              </tr>
            ))}
            {filteredVolunteers.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">No volunteers assigned to this phase.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
