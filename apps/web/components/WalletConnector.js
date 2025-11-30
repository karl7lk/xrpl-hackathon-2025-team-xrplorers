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
    return <div className="h-10 w-32 rounded-xl bg-purple-100 animate-pulse"></div>;
  }

  return (
    <div className="font-sans antialiased relative z-[60]">
      <xrpl-wallet-connector
        ref={walletConnectorRef}
        style={{
          // --- FORME ---
          "--xc-font-family": "'Inter', sans-serif",
          "--xc-border-radius": "12px", // Arrondi léger
          
          // --- COULEURS VIOLETTES (PrevHero) ---
          "--xc-primary-color": "#7c3aed",
          
          // Bouton Normal
          "--xc-button-background-color": "#7c3aed", // Violet
          "--xc-button-text-color": "#ffffff",       // Blanc
          "--xc-button-border-color": "transparent",
          
          // Bouton Survol (Hover)
          "--xc-button-hover-background-color": "#6d28d9", // Violet plus foncé
          "--xc-button-hover-text-color": "#ffffff",
          "--xc-button-hover-border-color": "transparent",

          // Menu Popup
          "--xc-modal-background-color": "#ffffff",
          "--xc-modal-text-color": "#0f172a",
          "--xc-modal-border-radius": "20px",
        }}
        primary-wallet="xaman"
      />
    </div>
  );
}