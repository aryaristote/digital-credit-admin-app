import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, AlertCircle, CheckCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
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

  useEffect(() => {
    fetchCreditRequests();
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
                    <div className="mt-4">
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
                  )}

                  {request.status === "rejected" && request.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong>{" "}
                        {request.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                    <span>Requested: {formatDate(request.createdAt)}</span>
                    {request.dueDate && (
                      <span>Due: {formatDate(request.dueDate)}</span>
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
