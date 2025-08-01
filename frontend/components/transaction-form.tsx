"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTransactions,
} from "@/components/transaction-provider";
import { type NewTransaction } from "@/lib/transaction-mapper";

export function TransactionForm() {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState<NewTransaction>({
    toAccount: "",
    amount: 0,
    transactionType: "sent",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.toAccount && formData.amount > 0) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        await addTransaction(formData);
        setFormData({ toAccount: "", amount: 0, transactionType: "sent" });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create transaction');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (
    field: keyof NewTransaction,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r pt-6 from-emerald-50 to-teal-50 border-b">
        <CardTitle className="text-emerald-800">New Transaction</CardTitle>
        <CardDescription className="text-emerald-600">
          Send money from your account to another account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fromAccount">From Account</Label>
            <Input
              id="fromAccount"
              placeholder="Your Account"
              value="Your Account"
              disabled={true}
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toAccount">To Account / Recipient Username</Label>
            <Input
              id="toAccount"
              placeholder="Enter recipient username (must be exact)"
              value={formData.toAccount}
              onChange={(e) => handleInputChange("toAccount", e.target.value)}
              disabled={isSubmitting}
              required
              className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500">
              Enter the exact username of the recipient to transfer funds
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select
              value={formData.transactionType}
              onValueChange={(value) => 
                handleInputChange("transactionType", value as "sent" | "received" | "paid")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sent">Send Money</SelectItem>
                <SelectItem value="paid">Pay Bill</SelectItem>
                <SelectItem value="received">Receive Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount || ""}
              onChange={(e) =>
                handleInputChange(
                  "amount",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              disabled={isSubmitting}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2.5"
          >
            {isSubmitting ? "Creating Transaction..." : "Send Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
