/**
 * submitPreventionAction
 * PrevHero XRPL Helper — Universal Compatible Version
 *
 * - Works with: Crossmark, XUMM, GemWallet, WalletConnect
 * - Uses AccountSet + Memo (recommended for on-chain proofs)
 * - No Amount required
 * - No Destination required
 * - Avoids self-payment errors (tecNO_EFFECT)
 * - Returns a clean txHash for certificate history
 */

export async function submitPreventionAction(walletManager, accountInfo, actionId) {
  if (!walletManager) throw new Error("Wallet Manager not available");
  if (!accountInfo?.address) throw new Error("Wallet address missing");

  // XRPL "Proof Transaction" — safest and most compatible type
  const tx = {
    TransactionType: "AccountSet",
    Account: accountInfo.address,
    Memos: [
      {
        Memo: {
          MemoType: Buffer.from("prevhero", "utf8").toString("hex"),
          MemoData: Buffer.from(JSON.stringify({ actionId }), "utf8").toString("hex"),
        },
      },
    ],
  };

  // --- Sign & Submit ---
  const res = await walletManager.signAndSubmit(tx);

  // ------------------------
  //   NORMALIZE ALL FORMATS
  // ------------------------

  // 1. Crossmark returns { tx_json: { hash } }
  if (res?.tx_json?.hash) return res.tx_json.hash;

  // 2. XRPL-Connect v2 returns { result: { tx_json: { hash } } }
  if (res?.result?.tx_json?.hash) return res.result.tx_json.hash;

  // 3. XUMM-style (rare in your setup but supported)
  if (res?.hash) return res.hash;

  throw new Error("Transaction rejected or no hash found in response");
}
