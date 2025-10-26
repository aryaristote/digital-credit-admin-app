import { useEffect, useState } from "react";
import { Download, Filter } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../lib/api";
import { formatCurrency, formatDateTime } from "../lib/utils";
import { toast } from "sonner";

interface Transaction {
  id: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal" | "credit_payment">("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      console.log("🔄 [TRANSACTIONS] Fetching transactions...");
      const response = await api.get("/transactions");
      console.log("✅ [TRANSACTIONS] Response received:", response.data);
      // Backend returns paginated response: { data: [...], total, page, totalPages }
      const transactionsData = response.data.data || response.data || [];
      console.log("💰 [TRANSACTIONS] Transactions:", transactionsData.length, "transactions");
      setTransactions(transactionsData);
    } catch (error: any) {
      console.error("❌ [TRANSACTIONS] Failed to fetch transactions:", error);
      console.error("❌ [TRANSACTIONS] Error response:", error.response?.data);
      console.error("❌ [TRANSACTIONS] Error status:", error.response?.status);
      toast.error(error.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (filter === "all") return true;
    return txn.type === filter;
  });

  const getTypeBadge = (type: string) => {
    const styles = {
      deposit: "bg-green-100 text-green-800",
      withdrawal: "bg-orange-100 text-orange-800",
      credit_payment: "bg-primary-100 text-primary-800",
      credit_disbursement: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          styles[type as keyof typeof styles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Transaction Monitoring
          </h2>
          <p className="text-gray-600 mt-1">
            View all system transactions and financial activities
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({transactions.length})
          </Button>
          <Button
            variant={filter === "deposit" ? "primary" : "outline"}
            onClick={() => setFilter("deposit")}
            size="sm"
          >
            Deposits ({transactions.filter((t) => t.type === "deposit").length})
          </Button>
          <Button
            variant={filter === "withdrawal" ? "primary" : "outline"}
            onClick={() => setFilter("withdrawal")}
            size="sm"
          >
            Withdrawals ({transactions.filter((t) => t.type === "withdrawal").length})
          </Button>
          <Button
            variant={filter === "credit_payment" ? "primary" : "outline"}
            onClick={() => setFilter("credit_payment")}
            size="sm"
          >
            Credit Payments ({transactions.filter((t) => t.type === "credit_payment").length})
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Date & Time
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Type
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {formatDateTime(txn.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {txn.user?.firstName} {txn.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{txn.user?.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getTypeBadge(txn.type)}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`font-semibold ${
                        txn.type === "deposit"
                          ? "text-green-600"
                          : txn.type === "withdrawal"
                          ? "text-red-600"
                          : "text-primary-600"
                      }`}
                    >
                      {txn.type === "deposit" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(txn.status)}</td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {txn.description || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

