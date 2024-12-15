export async function GET(req: Request) {
    try {
      // Fetch trending tokens from CoinGecko
      const trendingResponse = await fetch("https://api.coingecko.com/api/v3/search/trending");
      const trendingData = await trendingResponse.json();
  
      // Fetch detailed market data for trending tokens
      const coinIds = trendingData.coins.map((coin: any) => coin.item.id).join(",");
      const marketResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`
      );
      const marketData = await marketResponse.json();
  
    
    }
  }
  