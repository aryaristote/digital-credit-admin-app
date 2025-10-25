import { Bell } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getInitials } from "../../lib/utils";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.firstName}!
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white bg-primary-600 rounded-full">
            {user && getInitials(user.firstName, user.lastName)}
          </div>
        </div>
      </div>
    </header>
  );
}
