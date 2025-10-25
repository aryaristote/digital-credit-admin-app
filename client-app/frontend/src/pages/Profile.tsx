import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response: any = await api.put("/users/profile", data);
      updateUser(response.data);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "First name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
              />
              <Input
                label="Last Name"
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
              />
            </div>

            <Input label="Email" type="email" disabled {...register("email")} />

            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Credit Score:</span>
              <span className="font-medium">{user?.creditScore || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Role:</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
