import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    console.log("🚀 [LOGIN] Starting login attempt");
    console.log("📧 [LOGIN] Email:", data.email);
    console.log("🔐 [LOGIN] Password length:", data.password.length);

    setIsLoading(true);

    try {
      console.log("📡 [LOGIN] Making API call to /auth/login");
      console.log("🌐 [LOGIN] Base URL:", api.defaults.baseURL);
      console.log("📦 [LOGIN] Request data:", {
        email: data.email,
        password: "***",
      });

      const response = await api.post("/auth/login", data);

      console.log("✅ [LOGIN] Response received");
      console.log("📥 [LOGIN] Response status:", response.status);
      console.log("📥 [LOGIN] Response data:", response.data);

      const { accessToken, refreshToken, user } = response.data;

      console.log(
        "🔑 [LOGIN] Access token received:",
        accessToken ? "Yes" : "No"
      );
      console.log(
        "🔄 [LOGIN] Refresh token received:",
        refreshToken ? "Yes" : "No"
      );
      console.log("👤 [LOGIN] User data:", user);

      setAuth(accessToken, refreshToken, user);
      console.log("💾 [LOGIN] Auth data saved to store");

      toast.success("Login successful!");
      console.log("✅ [LOGIN] Login successful, navigating to dashboard");
      navigate("/");
    } catch (error: any) {
      console.error("❌ [LOGIN] Login failed");
      console.error("❌ [LOGIN] Error object:", error);
      console.error("❌ [LOGIN] Error message:", error.message);
      console.error("❌ [LOGIN] Error code:", error.code);
      console.error("❌ [LOGIN] Error response:", error.response);
      console.error("❌ [LOGIN] Error status:", error.response?.status);
      console.error("❌ [LOGIN] Error data:", error.response?.data);
      console.error("❌ [LOGIN] Is Network Error:", !error.response);
      console.error("❌ [LOGIN] Is Timeout:", error.code === "ECONNABORTED");
      console.error("❌ [LOGIN] Request config:", error.config);

      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      console.error("⚠️ [LOGIN] Showing error to user:", errorMessage);

      toast.error(errorMessage);
    } finally {
      console.log("🏁 [LOGIN] Login attempt finished");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Admin access only</p>
        </div>
      </Card>
    </div>
  );
}
