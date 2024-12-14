import { Connection, PublicKey } from "@solana/web3.js";

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const publicKey = new PublicKey(walletAddress);

    // Fetch token balances
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      });
  
      const balances = tokenAccounts.value.map((account) => {
        const tokenInfo = account.account.data.parsed.info.tokenAmount;
        const mintAddress = account.account.data.parsed.info.mint;
        return {
          mintAddress,
          amount: tokenInfo.uiAmount || 0,
        };
      });
  
      // Fetch recent transactions
      const transactions = await connection.getConfirmedSignaturesForAddress2(publicKey, { limit: 5 });
  
      res.status(200).json({ balances, transactions });
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch wallet data" });
    }
}
