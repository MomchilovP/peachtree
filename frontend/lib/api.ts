// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

export interface ApiError {
  detail: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  full_name?: string;
  balance: string; // Decimal as string
}

export interface BackendTransaction {
  id: number;
  date: string; // ISO datetime string
  contractor: string;
  type: 'sent' | 'received' | 'paid';
  amount: string; // Decimal as string
  user_id: number;
}

export interface CreateTransactionRequest {
  contractor: string;
  amount: string; // Decimal as string
  type?: 'sent' | 'received' | 'paid';
}

export interface UpdateTransactionRequest {
  type: 'sent' | 'received' | 'paid';
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${API_PREFIX}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.detail || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });
  }

  async register(username: string, password: string, fullName?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        full_name: fullName,
      }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Transaction endpoints
  async getTransactions(): Promise<BackendTransaction[]> {
    return this.request<BackendTransaction[]>('/transactions/');
  }

  async getTransaction(id: number): Promise<BackendTransaction> {
    return this.request<BackendTransaction>(`/transactions/${id}`);
  }

  async createTransaction(data: CreateTransactionRequest): Promise<BackendTransaction> {
    return this.request<BackendTransaction>('/transactions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: number, data: UpdateTransactionRequest): Promise<BackendTransaction> {
    return this.request<BackendTransaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
