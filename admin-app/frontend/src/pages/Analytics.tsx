import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Users, CreditCard } from "lucide-react";
import Card from "../components/ui/Card";
import { formatCurrency } from "../lib/utils";

export default function Analytics() {
  const [loading] = useState(false);

  // Mock data for charts
  const metrics = [
    {
      title: "Total Revenue",
      value: "$127,560",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Active Loans",
      value: "342",
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
      color: "text-primary-600",
    },
    {
      title: "New Customers",
      value: "1,234",
      change: "+23.1%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Default Rate",
      value: "2.4%",
      change: "-0.5%",
      trend: "down",
      icon: TrendingDown,
      color: "text-red-600",
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
        <h2 className="text-3xl font-bold text-gray-900">Analytics & Reports</h2>
        <p className="text-gray-600 mt-1">
          Detailed insights and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.color}`}>
                <metric.icon className="w-8 h-8" />
              </div>
              <span
                className={`text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Credit Distribution by Score
          </h3>
          <div className="space-y-4">
            {[
              { range: "750+", percentage: 35, color: "bg-green-500" },
              { range: "700-749", percentage: 28, color: "bg-primary-500" },
              { range: "650-699", percentage: 22, color: "bg-yellow-500" },
              { range: "600-649", percentage: 10, color: "bg-orange-500" },
              { range: "Below 600", percentage: 5, color: "bg-red-500" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.range}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Loan Disbursement
          </h3>
          <div className="space-y-3">
            {[
              { month: "October", amount: 125400 },
              { month: "September", amount: 98750 },
              { month: "August", amount: 112300 },
              { month: "July", amount: 87650 },
              { month: "June", amount: 95200 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-700">{item.month}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">94.5%</p>
            <p className="text-sm text-gray-600 mt-1">Approval Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">$2.4M</p>
            <p className="text-sm text-gray-600 mt-1">Total Disbursed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">$450K</p>
            <p className="text-sm text-gray-600 mt-1">Outstanding Balance</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">97.6%</p>
            <p className="text-sm text-gray-600 mt-1">Repayment Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

