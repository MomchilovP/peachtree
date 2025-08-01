import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - PeachTree Bank",
  description: "Login or register for PeachTree Bank",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
