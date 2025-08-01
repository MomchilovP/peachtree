"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { TransactionProvider } from "@/components/transaction-provider";
import { TransactionForm } from "@/components/transaction-form";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isAuthPage) {
        router.push("/login");
      } else if (user && isAuthPage) {
        router.push("/");
      }
    }
  }, [user, isLoading, isAuthPage, router]);

  // Show loading screen during initial authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render auth pages without the main layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Don't render main content if user is not authenticated and not on auth page
  if (!user) {
    return null;
  }

  // Render main application layout for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pb-6">
        <TransactionProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - Transaction Form (always visible) */}
            <div className="lg:col-span-1">
              <TransactionForm />
            </div>

            {/* Right side - Dynamic content from pages */}
            <div className="lg:col-span-2">{children}</div>
          </div>
        </TransactionProvider>
      </main>
    </div>
  );
}
