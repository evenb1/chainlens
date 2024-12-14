import { Connection, PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get("walletAddress");
  
  function isValidWalletAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const publicKey = new PublicKey(walletAddress);

    // Fetch token balances
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    const balances = tokenAccounts.value.map((account: { account: AccountInfo<ParsedAccountData> }) => {
      const tokenInfo = account.account.data.parsed.info.tokenAmount;
      const mintAddress = account.account.data.parsed.info.mint;
      return {
        mintAddress,
        amount: tokenInfo.uiAmount || 0,
        decimals: tokenInfo.decimals || 0,
      };
    });

    // Fetch recent transactions
    const transactionSignatures = await connection.getConfirmedSignaturesForAddress2(publicKey, {
      limit: 5, // Fetch the latest 5 transactions
    });

    const transactions = transactionSignatures.map((tx: { signature: string; slot: number }) => ({
      signature: tx.signature,
      slot: tx.slot,
    }));

    return NextResponse.json({ balances, transactions });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 });
  }
}
