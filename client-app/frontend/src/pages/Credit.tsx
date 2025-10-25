import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { formatCurrency, formatDate } from "../lib/utils";
import api from "../lib/api";

interface CreditRequest {
  id: string;
  requestedAmount: number;
  approvedAmount: number;
  totalRepaid: number;
  interestRate: number;
  termMonths: number;
  status: string;
  purpose: string;
  rejectionReason: string;
  createdAt: string;
  dueDate: string;
}

export default function Credit() {
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [repayingId, setRepayingId] = useState<string | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [repaymentNotes, setRepaymentNotes] = useState("");
  const [savingsBalance, setSavingsBalance] = useState<number>(0);

  useEffect(() => {
    fetchCreditRequests();
    fetchSavingsBalance();
  }, []);

  const fetchCreditRequests = async () => {
    try {
      const response: any = await api.get("/credit/requests");
      setRequests(response.data || []);
    } catch (error) {
      console.error("Failed to fetch credit requests", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavingsBalance = async () => {
    try {
      const response: any = await api.get("/savings/account");
      setSavingsBalance(response.data.balance || 0);
    } catch (error) {
      console.error("Failed to fetch savings balance", error);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this credit request?")
    ) {
      return;
    }

    setDeletingId(requestId);
    try {
      await api.delete(`/credit/requests/${requestId}`);
      toast.success("Credit request deleted successfully");
      // Refresh the list
      await fetchCreditRequests();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete credit request"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleRepayment = async (
    requestId: string,
    remainingBalance: number
  ) => {
    const amount = parseFloat(repaymentAmount);

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > savingsBalance) {
      toast.error(
        `Insufficient funds. Your savings balance is ${formatCurrency(
          savingsBalance
        )}`
      );
      return;
    }

    if (amount > remainingBalance) {
      toast.error(
        `Amount cannot exceed remaining balance of ${formatCurrency(
          remainingBalance
        )}`
      );
      return;
    }

    setRepayingId(requestId);
    try {
      await api.post(`/credit/requests/${requestId}/repay`, {
        amount,
        notes: repaymentNotes || undefined,
      });
      toast.success("Payment successful!");
      setRepaymentAmount("");
      setRepaymentNotes("");
      // Refresh both credit requests and savings balance
      await fetchCreditRequests();
      await fetchSavingsBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setRepayingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
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
          <h1 className="text-3xl font-bold text-gray-900">
            Credit Management
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage your credit requests
          </p>
        </div>
        <Link to="/credit/request">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No credit requests yet</p>
            <Link to="/credit/request">
              <Button>Request Credit</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const totalOwed =
              request.approvedAmount * (1 + request.interestRate / 100);
            const remaining = totalOwed - request.totalRepaid;
            const progress = (request.totalRepaid / totalOwed) * 100;

            return (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <CardTitle className="text-lg">
                          {formatCurrency(request.requestedAmount)} Credit
                          Request
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {request.purpose || "No purpose specified"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Requested</p>
                      <p className="font-medium">
                        {formatCurrency(request.requestedAmount)}
                      </p>
                    </div>
                    {request.approvedAmount && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Approved</p>
                          <p className="font-medium">
                            {formatCurrency(request.approvedAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="font-medium">{request.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Term</p>
                          <p className="font-medium">
                            {request.termMonths} months
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {request.status === "active" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Repayment Progress</span>
                          <span className="font-medium">
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            Repaid: {formatCurrency(request.totalRepaid)}
                          </span>
                          <span>Remaining: {formatCurrency(remaining)}</span>
                        </div>
                      </div>

                      {/* Repayment Form */}
                      <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-primary-900 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Make a Payment
                          </h4>
                          <span className="text-sm text-gray-600">
                            Available:{" "}
                            <span className="font-semibold">
                              {formatCurrency(savingsBalance)}
                            </span>
                          </span>
                        </div>
                        <div className="space-y-3">
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={repaymentAmount}
                            onChange={(e) => setRepaymentAmount(e.target.value)}
                            min="0.01"
                            max={remaining}
                            step="0.01"
                          />
                          <Input
                            type="text"
                            placeholder="Notes (optional)"
                            value={repaymentNotes}
                            onChange={(e) => setRepaymentNotes(e.target.value)}
                          />
                          <Button
                            onClick={() =>
                              handleRepayment(request.id, remaining)
                            }
                            isLoading={repayingId === request.id}
                            className="w-full"
                          >
                            Pay{" "}
                            {repaymentAmount
                              ? formatCurrency(parseFloat(repaymentAmount))
                              : ""}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {request.status === "pending" && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>⏳ Pending Approval:</strong> Your credit request is under review. 
                        You will be able to make payments once it's approved by an administrator.
                      </p>
                    </div>
                  )}

                  {request.status === "rejected" && request.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong>{" "}
                        {request.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <div>Requested: {formatDate(request.createdAt)}</div>
                      {request.dueDate && (
                        <div>Due: {formatDate(request.dueDate)}</div>
                      )}
                    </div>
                    {(request.status === "pending" ||
                      request.status === "rejected") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(request.id)}
                        isLoading={deletingId === request.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
