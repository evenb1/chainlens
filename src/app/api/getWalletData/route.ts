import { Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

const METADATA_PROGRAM_ID = new PublicKey("MetaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

async function getMetadata(tokenMintAddress: string, connection: Connection) {
  const [metadataAddress] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      new PublicKey(tokenMintAddress).toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  const metadataAccount = await connection.getAccountInfo(metadataAddress);
  if (!metadataAccount) {
    return null;
  }

  const metadata = metadataAccount.data.toString("utf-8");
  return JSON.parse(metadata); // Adjust parsing based on metadata format
}
async function fetchTokenMetadata(mintAddress: string) {
  const response = await fetch("https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json");
  const tokenList = await response.json();
  const token = tokenList.tokens.find((t: any) => t.address === mintAddress);
  return token ? { name: token.name, symbol: token.symbol, logoURI: token.logoURI } : null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get("address");

  if (!walletAddress) {
    return NextResponse.json({ error: "Address is required." }, { status: 400 });
  }

  const connection = new Connection("https://api.mainnet-beta.solana.com");

  try {
    const publicKey = new PublicKey(walletAddress);

    // Fetch SPL token balances
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    const balances = await Promise.all(
      tokenAccounts.value.map(async (account) => {
        const tokenInfo = account.account.data.parsed.info.tokenAmount;
        const mintAddress = account.account.data.parsed.info.mint;

        // Fetch token metadata (try Token Metadata Program first)
        let metadata = await getMetadata(mintAddress, connection);

        // Fallback to public token list if metadata is missing
        if (!metadata) {
          metadata = await fetchTokenMetadata(mintAddress);
        }

        return {
          mintAddress,
          amount: tokenInfo.uiAmount || 0,
          decimals: tokenInfo.decimals,
          tokenName: metadata?.name || "Unknown Token",
          tokenIcon: metadata?.logoURI || "/placeholder-icon.png", // Default icon
        };
      })
    );

    return NextResponse.json({
      balances,
      solBalance: (await connection.getBalance(publicKey)) / 1e9, // Convert lamports to SOL
    });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json({ error: "Failed to fetch wallet data." }, { status: 500 });
  }
}
