"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  useTransactions,
} from "@/components/transaction-provider";
import { type Transaction } from "@/lib/transaction-mapper";

type SortField = "date" | "contractor" | "amount";
type SortDirection = "asc" | "desc";

export function TransactionList() {
  const { transactions, loading, error } = useTransactions();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    router.push(`/transaction/${transaction.id}`);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter(
      (transaction) =>
        transaction.contractor
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.date.includes(searchTerm)
    );

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "contractor":
          aValue = a.contractor.toLowerCase();
          bValue = b.contractor.toLowerCase();
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, searchTerm, sortField, sortDirection]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r pt-6 from-emerald-50 to-teal-50 border-b">
        <CardTitle className="text-emerald-800">Transaction History</CardTitle>
        <CardDescription className="text-emerald-600">
          View and manage your transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex items-center space-x-2 pb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-500" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              disabled={loading}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading transactions...
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("date")}
                      className="h-auto p-0 font-semibold"
                      disabled={loading}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("contractor")}
                      className="h-auto p-0 font-semibold"
                      disabled={loading}
                    >
                      Contractor
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("amount")}
                      className="h-auto p-0 font-semibold"
                      disabled={loading}
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.contractor}
                      {transaction.typeTransaction && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({transaction.typeTransaction.trim()})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(transaction.status)}
                        className={
                          transaction.status === "paid"
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : transaction.status === "received"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAndSortedTransactions.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found matching your search.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
