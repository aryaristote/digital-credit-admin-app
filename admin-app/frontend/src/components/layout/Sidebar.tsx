import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  BarChart3,
} from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/users", icon: Users, label: "User Management" },
  { path: "/credit-approvals", icon: CreditCard, label: "Credit Approvals" },
  { path: "/transactions", icon: Receipt, label: "Transactions" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">DC</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Digital Credit</h2>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

