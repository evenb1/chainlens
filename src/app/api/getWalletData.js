import { Connection, PublicKey } from "@solana/web3.js";

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const publicKey = new PublicKey(walletAddress);


}
