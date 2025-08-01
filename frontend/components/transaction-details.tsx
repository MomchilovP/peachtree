"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTransactions } from "./transaction-provider";

interface TransactionDetailsProps {
  transactionId: string;
}

export function TransactionDetails({ transactionId }: TransactionDetailsProps) {
  const { getTransactionById, updateTransactionStatus } = useTransactions();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transaction = getTransactionById(transactionId);

  if (!transaction) {
    return (
      <Card className="w-full pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Transaction not found</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"; // Will be styled green
      case "received":
        return "secondary"; // Will be styled yellow
      case "sent":
        return "destructive"; // Will be styled red
      default:
        return "outline";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (
      newStatus === "sent" ||
      newStatus === "paid" ||
      newStatus === "received"
    ) {
      setIsUpdating(true);
      setError(null);
      
      try {
        await updateTransactionStatus(transaction.id, newStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update transaction');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleBackToList = () => {
    router.push("/");
  };

  return (
    <Card className="w-full pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r pt-6 from-emerald-50 to-teal-50 border-b">
        <CardTitle className="text-emerald-800">Transaction Details</CardTitle>
        <CardDescription className="text-emerald-600">
          Transaction ID: {transaction.id}
        </CardDescription>
      </CardHeader>
      <div className="flex items-center ml-3 space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToList}
          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </div>
      <CardContent className="space-y-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg border border-emerald-100">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Amount
                </TableCell>
                <TableCell className="text-base">
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Date
                </TableCell>
                <TableCell className="text-base">
                  {formatDate(transaction.date)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Contractor
                </TableCell>
                <TableCell className="text-base">
                  {transaction.contractor}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Transaction Type
                </TableCell>
                <TableCell className="text-base">
                  {transaction.typeTransaction}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Status
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(transaction.status)}
                    className={
                      transaction.status === "paid"
                        ? "bg-green-100 text-green-800 border-green-200 text-sm"
                        : transaction.status === "received"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200 text-sm"
                        : "bg-red-100 text-red-800 border-red-200 text-sm"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label htmlFor="status-select" className="text-sm font-medium">
            Update Status
          </Label>
          <Select value={transaction.status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger
              id="status-select"
              className="w-full md:w-[200px] border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sent" className="text-red-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Sent</span>
                </div>
              </SelectItem>
              <SelectItem value="paid" className="text-green-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Paid</span>
                </div>
              </SelectItem>
              <SelectItem value="received" className="text-yellow-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Received</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
