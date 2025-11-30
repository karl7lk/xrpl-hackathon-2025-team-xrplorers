// apps/web/app/layout.js

"use client";

import "./globals.css";
import { WalletProvider } from "../components/providers/WalletProvider";
import { AdminProvider } from "../components/providers/AdminProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* CHANGEMENT ICI : 
         Remplacement de 'bg-gray-50' par 'bg-[#FDF8F6]' 
         pour éviter les coupures blanches/grises lors du scroll.
      */}
      <body className="bg-[#FDF8F6]">
        <WalletProvider>
          <AdminProvider>
            {children}
          </AdminProvider>
        </WalletProvider>
      </body>
    </html>
  );
}