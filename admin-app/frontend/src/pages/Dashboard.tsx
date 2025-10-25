import { useEffect, useState } from "react";
import { Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import Card from "../components/ui/Card";
import api from "../lib/api";
import { formatCurrency } from "../lib/utils";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingCreditRequests: number;
  totalCreditDisbursed: number;
  totalSavings: number;
  recentUsers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingCreditRequests: 0,
    totalCreditDisbursed: 0,
    totalSavings: 0,
    recentUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/analytics/dashboard");
      const data = response.data;
      
      // Map the nested backend response to flat structure
      setStats({
        totalUsers: data.users?.total || 0,
        activeUsers: data.users?.active || 0,
        recentUsers: data.users?.newThisMonth || 0,
        pendingCreditRequests: data.credits?.pending || 0,
        totalCreditDisbursed: data.financials?.totalDisbursed || 0,
        totalSavings: data.financials?.totalSavings || 0,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      change: `+${stats.recentUsers} this month`,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: TrendingUp,
      color: "bg-green-500",
      change: "Currently active",
    },
    {
      title: "Pending Credits",
      value: stats.pendingCreditRequests,
      icon: AlertCircle,
      color: "bg-yellow-500",
      change: "Awaiting approval",
    },
    {
      title: "Total Disbursed",
      value: formatCurrency(stats.totalCreditDisbursed),
      icon: CreditCard,
      color: "bg-purple-500",
      change: "All time",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">
          Monitor key metrics and system performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-gray-600">
            <p className="text-sm">No recent activity to display</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Server</span>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Background Jobs</span>
              <span className="text-sm font-medium text-green-600">Running</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

