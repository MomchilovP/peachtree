"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { 
  mapBackendToFrontend, 
  mapFrontendToBackend, 
  mapStatusToBackend,
  type Transaction,
  type NewTransaction 
} from "@/lib/transaction-mapper";

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: NewTransaction) => Promise<void>;
  updateTransactionStatus: (
    id: string,
    status: "sent" | "paid" | "received"
  ) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const refreshTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendTransactions = await apiClient.getTransactions();
      const frontendTransactions = backendTransactions.map(mapBackendToFrontend);
      setTransactions(frontendTransactions);
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        setError('Please log in to view transactions');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      }
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (newTransaction: NewTransaction) => {
    try {
      setError(null);
      const backendRequest = mapFrontendToBackend(newTransaction);
      const backendTransaction = await apiClient.createTransaction(backendRequest);
      const frontendTransaction = mapBackendToFrontend(backendTransaction);
      setTransactions((prev) => [frontendTransaction, ...prev]);
      
      // Refresh user balance after successful transaction
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      throw err; // Re-throw so the form can handle the error
    }
  };

  const updateTransactionStatus = async (
    id: string,
    status: "sent" | "paid" | "received"
  ) => {
    try {
      setError(null);
      const backendStatus = mapStatusToBackend(status);
      const backendTransaction = await apiClient.updateTransaction(
        parseInt(id), 
        { type: backendStatus }
      );
      const frontendTransaction = mapBackendToFrontend(backendTransaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? frontendTransaction : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      throw err; // Re-throw so the component can handle the error
    }
  };

  const getTransactionById = (id: string) => {
    return transactions.find((t) => t.id === id);
  };

  // Load transactions on mount
  useEffect(() => {
    refreshTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        addTransaction,
        updateTransactionStatus,
        getTransactionById,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
