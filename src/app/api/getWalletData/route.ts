import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  "https://methodical-serene-wind.solana-mainnet.quiknode.pro/8f63c36a1ecd61a5962f323693564b86fb31ba36",
  "confirmed"
);
const TOKEN_METADATA_URL = "https://api.coingecko.com/api/v3/simple/price"; // Replace with QuickNode or other APIs


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

    // 1. Fetch SOL Balance
    const balance = await connection.getBalance(publicKey);

    

    // 3. Fetch Metadata for Tokens (Token Names and Icons)
    const tokenMetadata = await fetch("https://token-list-api.solana.com").then((res) =>
      res.json()
    );

    tokens = tokens.map((token) => {
      const metadata = tokenMetadata.find((t: any) => t.address === token.mintAddress);
      return {
        ...token,
        tokenName: metadata?.name || "Unknown Token",
        tokenIcon: metadata?.logoURI || "/placeholder-icon.png",
      };
    });

    // 4. Fetch USD Prices for Tokens (Optional: Using CoinGecko API)
    const tokenPriceResponse = await fetch(
      `${TOKEN_METADATA_URL}?ids=solana&vs_currencies=usd`
    );
    const priceData = await tokenPriceResponse.json();
    const solPrice = priceData.solana.usd;

    // 5. Fetch Recent Transactions
    const transactions = await connection.getConfirmedSignaturesForAddress2(publicKey, {
      limit: 5,
    });

    return new Response(
      JSON.stringify({
        balance: balance / 1e9, // Convert lamports to SOL
        solPrice: solPrice,
        tokens: tokens,
        transactions: transactions.map((tx) => ({
          signature: tx.signature,
          blockTime: new Date(tx.blockTime! * 1000).toLocaleString(),
        })),
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
