"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "./providers/WalletProvider";

export function WalletConnector() {
  const { walletManager } = useWallet();
  const walletConnectorRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const registerWebComponent = async () => {
      try {
        const { WalletConnectorElement } = await import("xrpl-connect");
        if (!customElements.get("xrpl-wallet-connector")) {
          customElements.define("xrpl-wallet-connector", WalletConnectorElement);
        }
      } catch (error) {
        console.error("Failed to register wallet connector:", error);
      }
    };

    registerWebComponent();
  }, []);

  useEffect(() => {
    if (isClient && walletConnectorRef.current && walletManager) {
      walletConnectorRef.current.setWalletManager(walletManager);
    }
  }, [isClient, walletManager]);

  if (!isClient) {
    return <div className="h-10 w-32 rounded-full bg-slate-800/50 animate-pulse"></div>;
  }

  return (
    <div className="font-sans antialiased relative z-[60]">
      <xrpl-wallet-connector
        ref={walletConnectorRef}
        style={{
          // --- FORME & TYPO (Style Apple Pill) ---
          "--xc-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          "--xc-border-radius": "9999px",
          
          // --- BOUTON (Normal) ---
          "--xc-button-background-color": "rgba(255, 255, 255, 0.05)", 
          "--xc-button-border-color": "rgba(255, 255, 255, 0.1)",
          "--xc-button-text-color": "#f8fafc",
          
          // --- BOUTON (Hover) ---
          "--xc-button-hover-background-color": "rgba(255, 255, 255, 0.1)",
          "--xc-button-hover-border-color": "rgba(255, 255, 255, 0.2)",
          "--xc-button-hover-text-color": "#ffffff",

          // --- MENU DÉROULANT (Popup) ---
          "--xc-modal-background-color": "#0f172a", // Slate-950
          "--xc-modal-text-color": "#f8fafc",
          "--xc-modal-border": "1px solid rgba(255, 255, 255, 0.1)",
          "--xc-modal-border-radius": "16px",
          "--xc-modal-box-shadow": "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          "--xc-modal-z-index": "100", // Force le z-index interne
          
          // --- COULEURS D'ACCENTUATION ---
          "--xc-primary-color": "#0ea5e9", // Sky-500
          "--xc-color-error": "#f43f5e",
        }}
        primary-wallet="xaman"
      />
    </div>
  );
}