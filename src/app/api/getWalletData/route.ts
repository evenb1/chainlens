import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  "https://methodical-serene-wind.solana-mainnet.quiknode.pro/8f63c36a1ecd61a5962f323693564b86fb31ba36",
  "confirmed"
);

const TOKEN_LIST_URL = "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json";
let tokenList: any[] = [];

// Load token metadata into memory
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

    // Load token list
    await loadTokenList();

    // Fetch SOL balance
    const lamports = await connection.getBalance(publicKey);
    const solBalance = lamports / 1e9;

    // Fetch token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    // Parse and enrich tokens
    const tokens = tokenAccounts.value.map((account) => {
      const mintAddress = account.account.data.parsed.info.mint;
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount || 0;

      const metadata = tokenList.find((token) => token.address === mintAddress);
      return {
        mintAddress,
        amount,
        tokenName: metadata?.name || "Unknown Token",
        tokenIcon: metadata?.logoURI || "/placeholder-icon.png",
        price: metadata?.price || 0, // Fetch from a price API if needed
      };
    });

    // Sort tokens by balance
    const sortedTokens = tokens.sort((a, b) => b.amount - a.amount);

    return new Response(
      JSON.stringify({
        solBalance,
        tokens: sortedTokens,
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
