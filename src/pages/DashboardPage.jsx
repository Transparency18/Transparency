import { useState, useEffect } from "react";
import {
  Users, Car, ShieldAlert, VideoOff, ShieldCheck, IndianRupee, Lightbulb, TrendingUp, Wrench, Footprints
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { dashboardService } from "../services/dashboardService";
import { Badge } from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export function DashboardPage() {
  const { phase } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, issuesData, announcementsData] = await Promise.all([
          dashboardService.getStats(phase),
          dashboardService.getRecentIssues(phase),
          dashboardService.getAnnouncements()
        ]);
        setStats(statsData);
        setRecentIssues(issuesData);
        setRecentAnnouncements(announcementsData);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [phase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpiData = [
    { title: "Security Guards", value: stats.totalGuards, icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-100", link: "/guards" },
    { title: "CCTV Faults", value: stats.camerasNotWorking, icon: VideoOff, color: "text-orange-600", bg: "bg-orange-100", link: "/cctv" },
    { title: "Active Issues", value: stats.activeSecurityIssues, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-100", link: "/security" },
    { title: "Vehicles Today", value: stats.vehiclesToday, icon: Car, color: "text-indigo-600", bg: "bg-indigo-100", link: "/vehicles" },
    { title: "Association mentainance Amount", value: `₹${stats.totalCollected.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-100", link: "/payments" },
    { title: "Expenses", value: `₹${stats.totalExpenses.toLocaleString()}`, icon: IndianRupee, color: "text-red-600", bg: "bg-red-100", link: "/expenses" },
    { title: "Balance", value: `₹${stats.savingsAmount.toLocaleString()}`, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-100", link: "/reports" },
    { title: "Volunteers", value: stats.totalVolunteers, icon: Users, color: "text-blue-600", bg: "bg-blue-100", link: "/volunteers" },
    { title: "Services", value: stats.totalServices, icon: Wrench, color: "text-cyan-600", bg: "bg-cyan-100", link: "/services" },
    { title: "Patrol Rounds", value: `${stats.patrolsCompleted} / ${stats.totalPatrols}`, icon: Footprints, color: "text-indigo-600", bg: "bg-indigo-100", link: "/patrols" },
    { title: "Visitors Today", value: stats.visitorsToday, icon: Users, color: "text-gray-600", bg: "bg-gray-100", link: "/visitors" },
    { title: "Street Lights", value: stats.streetLightsCount, icon: Lightbulb, color: "text-yellow-600", bg: "bg-yellow-100", link: "/infrastructure" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open": return <Badge variant="danger">Open</Badge>;
      case "In Progress": return <Badge variant="warning">In Progress</Badge>;
      case "Resolved": return <Badge variant="success">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Overview</h2>
          <p className="text-gray-500 mt-1">Summary of community activities, financials, and infrastructure.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {kpiData.map((kpi, i) => (
          <Link to={kpi.link} key={i}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-2.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm font-medium text-gray-500 leading-tight">{kpi.title}</p>
                  <h4 className="text-base sm:text-2xl font-bold text-gray-900">{kpi.value}</h4>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visitor Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.visitorTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CCTV Health</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.cctvTrend}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.cctvTrend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex space-x-4 mt-2">
              {stats.cctvTrend.map((entry, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Issues</CardTitle>
            <Badge variant="danger">Active: {stats.activeSecurityIssues}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {recentIssues.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">No recent issues found.</div>
              ) : (
                recentIssues.map(issue => (
                  <div key={issue.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900">{issue.description || issue.category}</h5>
                        <p className="text-sm text-gray-500 mt-1">{issue.phase} • Reported by {issue.reportedBy}</p>
                      </div>
                      {getStatusBadge(issue.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Announcements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {recentAnnouncements.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">No recent announcements.</div>
              ) : (
                recentAnnouncements.map(ann => (
                  <div key={ann.id} className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${ann.priority === 'High' ? 'border-red-500 bg-red-50/50' : 'border-blue-500'}`}>
                    <h5 className="font-medium text-gray-900">{ann.title}</h5>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ann.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(ann.date).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
