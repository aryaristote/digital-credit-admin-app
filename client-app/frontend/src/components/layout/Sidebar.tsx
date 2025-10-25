import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Wallet,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";
import api from "../../lib/api";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Savings", href: "/savings", icon: Wallet },
  { name: "Credit", href: "/credit", icon: CreditCard },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export default function Sidebar() {
  const { logout, refreshToken } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", { refreshToken });
      logout();
      toast.success("Logged out successfully");
    } catch (error) {
      logout();
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Digital Credit</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-700 hover:bg-gray-50"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
