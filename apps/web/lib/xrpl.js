export async function submitPreventionAction(walletManager, accountInfo, actionId) {
  if (!walletManager) throw new Error("Wallet Manager not available");
  if (!accountInfo?.address) throw new Error("Wallet address missing");

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

  const res = await walletManager.signAndSubmit(tx);

  console.log("RAW RESULT =>", res);

  // 1. Crossmark format
  if (res?.tx_json?.hash) return res.tx_json.hash;

  // 2. XRPL-Connect v2 format
  if (res?.result?.tx_json?.hash) return res.result.tx_json.hash;

  // 3. XUMM style
  if (res?.hash) return res.hash;

  // 4. GEMWALLET format (the missing one)
  if (res?.response?.tx_json?.hash) return res.response.tx_json.hash;

  throw new Error("Transaction rejected or no hash found in response");
}

/**
 * Fetch existing PrevHero prevention certificates for an account by reading
 * past transactions (looks for MemoType "prevhero" and memo data containing an actionId).
 * Returns a list of { actionId, txHash, date }.
 */
export async function fetchPreventionCertificatesFromChain(accountAddress, opts = {}) {
  if (!accountAddress) throw new Error("Wallet address missing");

  // Default to XRPL Testnet; allow override for other networks.
  const websocketUrl =
    opts.websocketUrl || "wss://s.altnet.rippletest.net:51233";

  // Lazy-load xrpl to avoid SSR issues.
  const { Client } = await import("xrpl");

  const client = new Client(websocketUrl);
  await client.connect();

  try {
    const response = await client.request({
      command: "account_tx",
      account: accountAddress,
      ledger_index_min: -1,
      ledger_index_max: -1,
      binary: false,
      limit: opts.limit || 200,
    });

    const results = [];

    for (const entry of response.result.transactions || []) {
      const tx = entry.tx;
      if (!tx?.Memos || !Array.isArray(tx.Memos)) continue;

      const memo = tx.Memos.find((m) => {
        const memoTypeHex = m?.Memo?.MemoType;
        if (!memoTypeHex) return false;
        const memoType = Buffer.from(memoTypeHex, "hex").toString("utf8");
        return memoType.toLowerCase() === "prevhero";
      });

      if (!memo?.Memo?.MemoData) continue;

      try {
        const memoDataJson = Buffer.from(memo.Memo.MemoData, "hex").toString("utf8");
        const parsed = JSON.parse(memoDataJson);
        if (parsed?.actionId && tx?.hash) {
          results.push({
            actionId: parsed.actionId,
            txHash: tx.hash,
            date: tx.date
              ? new Date((tx.date + 946684800) * 1000).toISOString() // Ripple epoch to ISO
              : new Date().toISOString(),
          });
        }
      } catch (e) {
        // Ignore malformed memo data.
        continue;
      }
    }

    return results;
  } finally {
    client.disconnect();
  }
}
