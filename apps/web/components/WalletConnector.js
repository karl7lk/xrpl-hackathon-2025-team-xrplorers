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
    <div className="relative z-[60]">
      {/* SOLUTION "FORCE BRUTE" 
          1. On utilise <style jsx global> pour injecter le CSS partout.
          2. On met une couleur UNIE (#7c3aed) car les gradients ne marchent pas ici.
          3. On ajoute !important pour écraser le style par défaut.
      */}
      <style jsx global>{`
        xrpl-wallet-connector {
          display: inline-block !important;
          --xc-button-background-color: #7c3aed !important; /* Violet PrevHero */
          --xc-button-hover-background-color: #6d28d9 !important;
          --xc-button-text-color: #ffffff !important;
          --xc-button-border-radius: 12px !important;
          --xc-primary-color: #7c3aed !important;
          --xc-modal-background-color: #ffffff !important;
          --xc-modal-text-color: #0f172a !important;
        }
      `}</style>

      <xrpl-wallet-connector
        ref={walletConnectorRef}
        primary-wallet="xaman"
      />
    </div>
  );
}