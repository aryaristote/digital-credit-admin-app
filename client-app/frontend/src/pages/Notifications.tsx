import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatRelativeTime } from "../lib/utils";
import { toast } from "sonner";
import api from "../lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response: any = await api.get("/notifications");
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Marked as read");
    } catch (error: any) {
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error: any) {
      toast.error("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error: any) {
      toast.error("Failed to mark all as read");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your account activity
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={
                !notification.isRead ? "border-primary-200 bg-primary-50" : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {notification.type}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
