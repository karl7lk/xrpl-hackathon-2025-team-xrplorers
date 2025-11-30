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
    return <div className="h-12 w-40 rounded-full bg-slate-200 animate-pulse"></div>;
  }

  return (
    <div className="relative z-[60]">
      {/* Plus aucune propriété style ici, tout est dans globals.css */}
      <xrpl-wallet-connector
        ref={walletConnectorRef}
        primary-wallet="xaman"
      />
    </div>
  );
}