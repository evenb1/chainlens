import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  "https://methodical-serene-wind.solana-mainnet.quiknode.pro/8f63c36a1ecd61a5962f323693564b86fb31ba36",
  "confirmed"
);

// Solana Token List (fetch dynamically or use a local cached version)
const TOKEN_LIST_URL = "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json";
;
let tokenList: any[] = [];

// Load token list into memory
async function loadTokenList() {
  if (tokenList.length === 0) {
    const response = await fetch(TOKEN_LIST_URL);
    tokenList = await response.json();
  }
}

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

    // Load Token List
    await loadTokenList();

    // Fetch SOL Balance
    const balance = await connection.getBalance(publicKey);

    // Fetch Token Accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    // Parse Tokens and Enrich with Metadata
    let tokens = tokenAccounts.value.map((account) => {
      const mintAddress = account.account.data.parsed.info.mint;
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount || 0;

      // Match with token list
      const metadata = tokenList.find((token) => token.address === mintAddress);

      return {
        mintAddress,
        amount,
        tokenName: metadata?.name || "Unknown Token",
        tokenIcon: metadata?.logoURI || "/placeholder-icon.png",
        price: metadata?.price || 0, // You can integrate CoinGecko for real-time price
      };
    });

    // Sort Tokens by Balance Descending
    tokens = tokens.sort((a, b) => b.amount - a.amount);

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
