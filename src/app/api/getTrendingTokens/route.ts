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
  
      // Combine trending and market data
      const tokens = trendingData.coins.map((coin: any) => {
        const marketInfo = marketData.find((m: any) => m.id === coin.item.id);
        return {
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          address: coin.item.id, // Placeholder for token address
          logo: coin.item.thumb,
          rank: marketInfo?.market_cap_rank || null,
          price: marketInfo?.current_price || 0,
          marketCap: marketInfo?.market_cap || 0,
          volume: marketInfo?.total_volume || 0,
          liquidity: marketInfo?.total_volume || 0, // Approximate liquidity
          age: `${Math.floor(Math.random() * 60)} days`, // Placeholder for age
          change_24h: marketInfo?.price_change_percentage_24h || 0,
        };
      });
  
      return new Response(JSON.stringify(tokens), { status: 200 });
    } catch (error) {
      console.error("Error fetching trending tokens:", error);
      return new Response(
        JSON.stringify({ error: "Unable to fetch trending tokens." }),
        { status: 500 }
      );
    }
  }
  