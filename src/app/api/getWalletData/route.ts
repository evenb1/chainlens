import { Connection, PublicKey } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";

const connection = new Connection(
  "https://methodical-serene-wind.solana-mainnet.quiknode.pro/8f63c36a1ecd61a5962f323693564b86fb31ba36",
  "confirmed"
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API triggered");

  if (req.method !== "GET") {
    console.error("Invalid method:", req.method);
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    const { walletAddress } = req.query as { walletAddress?: string };

    if (!walletAddress || typeof walletAddress !== "string") {
      console.error("Invalid wallet address:", walletAddress);
      return res.status(400).json({ error: "Invalid wallet address." });
    }

    console.log("Wallet Address:", walletAddress);

    const publicKey = new PublicKey(walletAddress);

    // Fetch SOL balance
    let lamports;
    try {
      lamports = await connection.getBalance(publicKey);
      console.log("SOL Balance in lamports:", lamports);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return res.status(500).json({ error: "Error fetching SOL balance." });
    }

    // Fetch token accounts
    let tokenAccounts;
    try {
      tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      });
      console.log("Token Accounts:", tokenAccounts);
    } catch (error) {
      console.error("Error fetching token accounts:", error);
      return res.status(500).json({ error: "Error fetching token accounts." });
    }

    // Parse and return tokens
    const tokens = tokenAccounts.value.map((account) => {
      const mintAddress = account.account.data.parsed.info.mint;
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount || 0;
      return { mintAddress, amount };
    });

    console.log("Parsed Tokens:", tokens);

    return res.status(200).json({
      solBalance: lamports / 1e9,
      tokens,
    });
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: "Failed to fetch wallet data." });
  }
}
