import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  "https://methodical-serene-wind.solana-mainnet.quiknode.pro/8f63c36a1ecd61a5962f323693564b86fb31ba36",
  "confirmed"
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required." }),
        { status: 400 }
      );
    }

    const publicKey = new PublicKey(walletAddress);

    // 1. Fetch SOL balance
    const balance = await connection.getBalance(publicKey);

    // 2. Fetch Token Accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    if (!tokenAccounts || !tokenAccounts.value) {
      console.log("No tokens found for wallet:", walletAddress);
      return new Response(
        JSON.stringify({
          balance: balance / 1e9,
          tokens: [],
        }),
        { status: 200 }
      );
    }

    // 3. Parse Token Data
    const tokens = tokenAccounts.value.map((account) => {
      const mintAddress = account.account.data.parsed.info.mint;
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount || 0;

      return {
        mintAddress,
        amount,
      };
    });

    return new Response(
      JSON.stringify({
        balance: balance / 1e9, // Convert lamports to SOL
        tokens,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch wallet data." }),
      { status: 500 }
    );
  }
}
