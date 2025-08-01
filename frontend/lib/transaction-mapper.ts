import type { BackendTransaction } from './api';

// Frontend transaction type
export type Transaction = {
  id: string;
  date: string;
  contractor: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  status: "sent" | "paid" | "received";
  typeTransaction?: "online transfer" | "card payment" | "transaction";
};

// New transaction type for creating transactions
export type NewTransaction = {
  toAccount: string; // This will be mapped to 'contractor' in backend
  amount: number;
  transactionType: 'sent' | 'received' | 'paid';
};

// Map backend transaction to frontend transaction
export function mapBackendToFrontend(backendTransaction: BackendTransaction): Transaction {
  return {
    id: backendTransaction.id.toString(),
    date: new Date(backendTransaction.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD
    contractor: backendTransaction.contractor,
    amount: parseFloat(backendTransaction.amount),
    fromAccount: 'Your Account', // Always from current user's account
    toAccount: backendTransaction.contractor, // Backend contractor becomes frontend toAccount
    status: backendTransaction.type,
    typeTransaction: 'transaction',
  };
}

// Map frontend new transaction to backend create request
export function mapFrontendToBackend(frontendTransaction: NewTransaction) {
  return {
    contractor: frontendTransaction.toAccount, // Frontend toAccount becomes backend contractor
    amount: frontendTransaction.amount.toFixed(2), // Convert to decimal string
    type: frontendTransaction.transactionType, // Use the specified transaction type
  };
}

// Convert frontend status to backend type
export function mapStatusToBackend(status: "sent" | "paid" | "received") {
  return status; 
}
