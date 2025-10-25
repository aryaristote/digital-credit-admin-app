import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { getCreditScoreLabel, getCreditScoreColor } from "../lib/utils";
import api from "../lib/api";

interface CreditRequestForm {
  requestedAmount: number;
  termMonths: number;
  purpose: string;
}

export default function CreditRequest() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreditRequestForm>();

  const requestedAmount = Number(watch("requestedAmount")) || 0;
  const termMonths = Number(watch("termMonths")) || 12;

  // Calculate estimated interest rate based on credit score
  const estimateInterestRate = (score: number) => {
    if (score >= 750) return 5.0;
    if (score >= 700) return 7.5;
    if (score >= 650) return 10.0;
    if (score >= 600) return 15.0;
    return 20.0;
  };

  const interestRate = estimateInterestRate(user?.creditScore || 0);
  const totalRepayable = requestedAmount * (1 + interestRate / 100);
  const monthlyPayment = totalRepayable / termMonths;

  const onSubmit = async (data: CreditRequestForm) => {
    setIsLoading(true);
    try {
      await api.post("/credit/request", data);
      toast.success("Credit request submitted successfully");
      navigate("/credit");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/credit")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request Credit</h1>
          <p className="text-gray-600 mt-1">Apply for a new loan</p>
        </div>
      </div>

      {/* Credit Score Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Credit Score</CardTitle>
          <CardDescription>
            Your credit score determines your eligibility and interest rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-4xl font-bold ${getCreditScoreColor(
                  user?.creditScore || 0
                )}`}
              >
                {user?.creditScore || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {getCreditScoreLabel(user?.creditScore || 0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Estimated Interest Rate</p>
              <p className="text-2xl font-bold text-primary-600">
                {interestRate}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>
            Enter the details of your credit request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Requested Amount"
              type="number"
              step="100"
              placeholder="5000"
              error={errors.requestedAmount?.message}
              {...register("requestedAmount", {
                required: "Amount is required",
                min: { value: 100, message: "Minimum amount is $100" },
                max: { value: 100000, message: "Maximum amount is $100,000" },
              })}
            />

            <Input
              label="Loan Term (months)"
              type="number"
              placeholder="12"
              error={errors.termMonths?.message}
              {...register("termMonths", {
                required: "Term is required",
                min: { value: 1, message: "Minimum term is 1 month" },
                max: { value: 60, message: "Maximum term is 60 months" },
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose (Optional)
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="e.g., Home renovation, Business investment"
                {...register("purpose")}
              />
            </div>

            {/* Loan Summary */}
            {requestedAmount > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <h4 className="font-medium text-gray-900">Loan Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-medium">
                      ${requestedAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">{interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Term:</span>
                    <span className="font-medium">{termMonths} months</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-medium">
                      Total Repayable:
                    </span>
                    <span className="font-bold text-primary-600">
                      ${totalRepayable.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Monthly Payment:</span>
                    <span className="font-medium">
                      ${monthlyPayment.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/credit")}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
