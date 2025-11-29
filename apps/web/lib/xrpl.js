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
