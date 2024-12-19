import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  "https://methodical-serene-wind.solana-mainnet.quiknode.pro/8f63c36a1ecd61a5962f323693564b86fb31ba36",
  "confirmed"
);

const TOKEN_LIST_URL = "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json";
let tokenList: any[] = [];

// Load token metadata into memory
async function loadTokenList() {
  try {
    if (tokenList.length === 0) {
      console.log("Fetching token list...");
      const response = await fetch(TOKEN_LIST_URL);
      tokenList = await response.json();
      console.log("Token list fetched. Length:", tokenList.length);
    }
  } catch (err) {
    console.error("Error fetching token list:", err);
    throw new Error("Failed to load token list.");
  }
}

export async function GET(req: Request) {
  try {
    console.log("Request received...");
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      console.error("Wallet address is missing.");
      return new Response(
        JSON.stringify({ error: "Wallet address is required." }),
        { status: 400 }
      );
    }

    const publicKey = new PublicKey(walletAddress);
    console.log("PublicKey created:", publicKey.toBase58());

    // Load token list
    console.log("Loading token list...");
    await loadTokenList();

    // Fetch SOL Balance
    console.log("Fetching SOL balance...");
    const lamports = await connection.getBalance(publicKey);
    const solBalance = lamports / 1e9;
    console.log("SOL balance:", solBalance);

    // Fetch Token Accounts
    console.log("Fetching token accounts...");
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    if (!tokenAccounts || !tokenAccounts.value) {
      console.error("No token accounts found.");
      return new Response(
        JSON.stringify({
          solBalance,
          tokens: [],
        }),
        { status: 200 }
      );
    }

    // Parse and Enrich Tokens
    console.log("Parsing tokens...");
    const tokens = tokenAccounts.value.map((account) => {
      const mintAddress = account.account.data.parsed.info.mint;
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount || 0;

      const metadata = tokenList.find((token) => token.address === mintAddress);
      return {
        mintAddress,
        amount,
        tokenName: metadata?.name || "Unknown Token",
        tokenIcon: metadata?.logoURI || "/placeholder-icon.png",
        price: metadata?.price || 0,
      };
    });

    // Sort Tokens by Balance
    const sortedTokens = tokens.sort((a, b) => b.amount - a.amount);
    console.log("Tokens sorted:", sortedTokens);

    return new Response(
      JSON.stringify({
        solBalance,
        tokens: sortedTokens,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch wallet data." }),
      { status: 500 }
    );
  }
}
