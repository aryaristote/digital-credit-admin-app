import { useEffect, useState } from "react";
import { Users, CreditCard, TrendingUp, AlertCircle, BarChart3, PieChart } from "lucide-react";
import Card from "../components/ui/Card";
import api from "../lib/api";
import { formatCurrency } from "../lib/utils";
import { toast } from "sonner";

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
      console.log("🔄 [DASHBOARD] Fetching dashboard stats...");
      const response = await api.get("/analytics/dashboard");
      console.log("✅ [DASHBOARD] Response received:", response.data);
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
      console.log("📊 [DASHBOARD] Stats set successfully");
    } catch (error: any) {
      console.error("❌ [DASHBOARD] Failed to fetch dashboard stats:", error);
      console.error("❌ [DASHBOARD] Error response:", error.response?.data);
      console.error("❌ [DASHBOARD] Error status:", error.response?.status);
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard statistics"
      );
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
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyDisbursementCard />
        <CreditDistributionCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceSummaryCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}

// Monthly Loan Disbursement Card Component
function MonthlyDisbursementCard() {
  const [data, setData] = useState<Array<{ month: string; amount: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/analytics/monthly-disbursement");
        setData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch monthly disbursement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Monthly Loan Disbursement
        </h3>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data available</div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.month}</span>
                <span className="font-medium">{formatCurrency(item.amount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Credit Distribution by Score Card Component
function CreditDistributionCard() {
  const [data, setData] = useState<Array<{ range: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/analytics/credit-distribution");
        const distribution = response.data || [];
        const total = distribution.reduce((sum: number, item: any) => sum + item.count, 0);
        const withPercentage = distribution.map((item: any) => ({
          ...item,
          percentage: total > 0 ? (item.count / total) * 100 : 0,
        }));
        setData(withPercentage);
      } catch (error) {
        console.error("Failed to fetch credit distribution:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Credit Distribution by Score
        </h3>
        <PieChart className="w-5 h-5 text-gray-400" />
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data available</div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.range}</span>
                <span className="font-medium">
                  {item.count} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Performance Summary Card Component
function PerformanceSummaryCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/analytics/performance-summary");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch performance summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Performance Summary
        </h3>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !data ? (
        <div className="text-center py-8 text-gray-500">No data available</div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Credits Approved (This Month)</span>
            <span className="font-semibold text-gray-900">{data.creditsApprovedThisMonth}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount Disbursed (This Month)</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(data.amountDisbursedThisMonth)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Credit Score</span>
            <span className="font-semibold text-gray-900">
              {Math.round(data.averageCreditScore)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Repayment Rate</span>
            <span className="font-semibold text-green-600">
              {data.repaymentRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active Loans</span>
            <span className="font-semibold text-blue-600">{data.totalActiveLoans}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Completed Loans</span>
            <span className="font-semibold text-green-600">{data.totalCompletedLoans}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

// Recent Activity Card Component
function RecentActivityCard() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/analytics/recent-activity?limit=5");
        setActivities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No recent activity</div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-xs text-gray-500">{activity.action}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  activity.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : activity.status === "active"
                    ? "bg-blue-100 text-blue-800"
                    : activity.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
