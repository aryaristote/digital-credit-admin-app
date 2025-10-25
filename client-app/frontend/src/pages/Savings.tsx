import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Minus, History } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { formatCurrency, formatDateTime } from "../lib/utils";
import api from "../lib/api";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export default function Savings() {
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const [accountRes, transactionsRes]: any = await Promise.all([
        api.get("/savings/account").catch(() => null),
        api.get("/savings/transactions").catch(() => ({ data: [] })),
      ]);

      if (accountRes) {
        setAccount(accountRes.data);
        setTransactions(transactionsRes.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch savings data", error);
    }
  };

  const createAccount = async () => {
    setIsLoading(true);
    try {
      await api.post("/savings/account", { initialDeposit: 0 });
      toast.success("Savings account created successfully");
      await fetchAccountData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const endpoint =
        activeTab === "deposit" ? "/savings/deposit" : "/savings/withdraw";
      await api.post(endpoint, {
        amount: parseFloat(data.amount),
        description: data.description,
      });
      toast.success(
        `${activeTab === "deposit" ? "Deposit" : "Withdrawal"} successful`
      );
      reset();
      await fetchAccountData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Create Your Savings Account</CardTitle>
            <CardDescription>
              Start saving today and earn interest on your deposits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={createAccount}
              className="w-full"
              isLoading={isLoading}
            >
              Create Savings Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Savings Account</h1>
        <p className="text-gray-600 mt-1">
          Manage your savings and transactions
        </p>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
          <div className="text-4xl font-bold text-primary-600 mt-2">
            {formatCurrency(account.balance)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Account: {account.accountNumber} • Interest Rate:{" "}
            {account.interestRate}%
          </p>
        </CardHeader>
      </Card>

      {/* Transaction Form */}
      <Card>
        <CardHeader>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "deposit" ? "primary" : "outline"}
              onClick={() => setActiveTab("deposit")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button
              variant={activeTab === "withdraw" ? "primary" : "outline"}
              onClick={() => setActiveTab("withdraw")}
            >
              <Minus className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message as string}
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Minimum amount is 0.01" },
              })}
            />
            <Input
              label="Description (Optional)"
              placeholder="Monthly savings"
              {...register("description")}
            />
            <Button type="submit" isLoading={isLoading}>
              {activeTab === "deposit" ? "Deposit" : "Withdraw"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            <CardTitle>Transaction History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">{txn.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(txn.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        txn.type === "deposit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.type === "deposit" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance: {formatCurrency(txn.balanceAfter)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
