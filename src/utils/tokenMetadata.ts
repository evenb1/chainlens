import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";

export const fetchTokenMetadata = async (): Promise<TokenInfo[]> => {
  try {
    const tokenListProvider = new TokenListProvider();
    const tokenList = await tokenListProvider.resolve();
    const tokens = tokenList.filterByChainId(101).getList(); // 101 = Solana Mainnet
    return tokens;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return [];
  }
};
