"use client";

import "./globals.css";
import { WalletProvider } from "../components/providers/WalletProvider";
import { AdminProvider } from "../components/providers/AdminProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <WalletProvider>
          <AdminProvider>
            {children}
          </AdminProvider>
        </WalletProvider>
      </body>
    </html>
  );
}