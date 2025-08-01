import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedLayout } from "@/components/protected-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PeachTree Bank - Transaction Management",
  description: "Professional banking transaction management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
