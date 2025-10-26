import { useEffect, useState } from "react";
import { Check, X, Clock, Eye } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../lib/api";
import { formatCurrency, formatDateTime } from "../lib/utils";
import { toast } from "sonner";

interface CreditRequest {
  id: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    creditScore: number;
  };
  requestedAmount: number;
  approvedAmount: number;
  interestRate: number;
  termMonths: number;
  status: string;
  purpose: string;
  rejectionReason: string;
  createdAt: string;
}

export default function CreditApprovals() {
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");

  useEffect(() => {
    fetchCreditRequests();
  }, []);

  const fetchCreditRequests = async () => {
    try {
      console.log("🔄 [CREDIT] Fetching credit requests...");
      const response = await api.get("/credit/all");
      console.log("✅ [CREDIT] Response received:", response.data);
      // Backend returns paginated response: { data: [...], total, page, totalPages }
      const requestsData = response.data.data || response.data || [];
      console.log(
        "💳 [CREDIT] Credit requests:",
        requestsData.length,
        "requests"
      );
      setRequests(requestsData);
    } catch (error: any) {
      console.error("❌ [CREDIT] Failed to fetch credit requests:", error);
      console.error("❌ [CREDIT] Error response:", error.response?.data);
      console.error("❌ [CREDIT] Error status:", error.response?.status);
      toast.error(
        error.response?.data?.message || "Failed to fetch credit requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await api.put(`/credit/${requestId}/approve`);
      toast.success("Credit request approved successfully");
      fetchCreditRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setProcessingId(requestId);
    try {
      await api.put(`/credit/${requestId}/reject`, { reason });
      toast.success("Credit request rejected");
      fetchCreditRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    if (filter === "approved") {
      // Show both approved and active statuses for "approved" filter
      return req.status === "approved" || req.status === "active";
    }
    return req.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      active: "bg-primary-100 text-primary-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
        <h2 className="text-3xl font-bold text-gray-900">Credit Approvals</h2>
        <p className="text-gray-600 mt-1">
          Review and approve pending credit requests
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({requests.length})
          </Button>
          <Button
            variant={filter === "pending" ? "primary" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
          >
            <Clock className="w-4 h-4 mr-1" />
            Pending ({requests.filter((r) => r.status === "pending").length})
          </Button>
          <Button
            variant={filter === "approved" ? "primary" : "outline"}
            onClick={() => setFilter("approved")}
            size="sm"
          >
            <Check className="w-4 h-4 mr-1" />
            Approved (
            {
              requests.filter(
                (r) => r.status === "approved" || r.status === "active"
              ).length
            }
            )
          </Button>
          <Button
            variant={filter === "rejected" ? "primary" : "outline"}
            onClick={() => setFilter("rejected")}
            size="sm"
          >
            <X className="w-4 h-4 mr-1" />
            Rejected ({requests.filter((r) => r.status === "rejected").length})
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusBadge(request.status)}
                  <span className="text-sm text-gray-500">
                    {formatDateTime(request.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">
                      {request.user?.firstName} {request.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Credit Score</p>
                    <p className="font-semibold text-lg text-gray-900">
                      {request.user?.creditScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requested Amount</p>
                    <p className="font-semibold text-lg text-gray-900">
                      {formatCurrency(request.requestedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Term</p>
                    <p className="font-medium text-gray-900">
                      {request.termMonths} months
                    </p>
                  </div>
                </div>

                {request.purpose && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Purpose</p>
                    <p className="text-gray-900">{request.purpose}</p>
                  </div>
                )}

                {request.status === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Approved Amount:</span>{" "}
                      {formatCurrency(request.approvedAmount)} at{" "}
                      {request.interestRate}% interest
                    </p>
                  </div>
                )}

                {request.status === "rejected" && request.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Rejection Reason:</span>{" "}
                      {request.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {request.status === "pending" && (
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    isLoading={processingId === request.id}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(request.id)}
                    isLoading={processingId === request.id}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <div className="text-center py-12 text-gray-500">
              No {filter !== "all" && filter} credit requests found
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
