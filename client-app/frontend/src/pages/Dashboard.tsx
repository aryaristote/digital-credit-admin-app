import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, CreditCard, TrendingUp, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { useAuthStore } from "../store/authStore";
import {
  formatCurrency,
  getCreditScoreColor,
  getCreditScoreLabel,
} from "../lib/utils";
import api from "../lib/api";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    savingsBalance: 0,
    activeCreditRequests: 0,
    totalSaved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [savingsRes, creditRes]: any = await Promise.all([
          api.get("/savings/balance").catch(() => ({ data: { balance: 0 } })),
          api.get("/credit/requests").catch(() => ({ data: [] })),
        ]);

        const activeCredits = Array.isArray(creditRes.data)
          ? creditRes.data.filter((c: any) => c.status === "active").length
          : 0;

        setStats({
          savingsBalance: savingsRes.data.balance || 0,
          activeCreditRequests: activeCredits,
          totalSaved: savingsRes.data.balance || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your financial account</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Savings Balance
            </CardTitle>
            <Wallet className="w-5 h-5 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.savingsBalance)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Credits
            </CardTitle>
            <CreditCard className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.activeCreditRequests}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ongoing credit requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Credit Score
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getCreditScoreColor(
                user?.creditScore || 0
              )}`}
            >
              {user?.creditScore || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getCreditScoreLabel(user?.creditScore || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/savings"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Wallet className="w-8 h-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Savings</h3>
                  <p className="text-sm text-gray-500">
                    Deposit or withdraw funds
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>

            <Link
              to="/credit/request"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Request Credit</h3>
                  <p className="text-sm text-gray-500">Apply for a new loan</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
