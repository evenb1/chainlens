"use client";

import React, { useEffect, useState } from "react";
import { Copy, Home, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  logo: string;
  rank: number | null;
  price: number;
  marketCap: number;
  volume: number;
  liquidity: number;
  age: string;
  change_24h: number;
}

export default function Trending() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const fetchTrendingTokens = async () => {
    try {
      const response = await fetch("/api/getTrendingTokens");
      const data = await response.json();
      if (response.ok) {
        setTokens(data);
      } else {
        setError(data.error || "Failed to fetch trending tokens.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTokens();

    const interval = setInterval(() => fetchTrendingTokens(), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="p-11">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Trending Tokens</h1>
        <Link
          href="/"
          className="flex items-center text-white rounded-md hover:text-violet-600 transition mr-10"
        >
          <Home className="w-5 h-5 mr-2" />
          Home
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-neutral-700 rounded-md px-4 py-2 mb-6">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search tokens by name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-violet-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tokens Table */}
      {!loading && !error && filteredTokens.length > 0 && (
        <div className="overflow-x-auto bg-neutral-800 rounded-md shadow-lg p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-4 text-slate-400 text-left">Token</th>
                <th className="py-2 px-4 text-slate-400 text-right">Price (USD)</th>
                <th className="py-2 px-4 text-slate-400 text-right">Market Cap</th>
                <th className="py-2 px-4 text-slate-400 text-right">Liquidity</th>
                <th className="py-2 px-4 text-slate-400 text-right">Volume (24h)</th>
                <th className="py-2 px-4 text-slate-400 text-right">Age</th>
                <th className="py-2 px-4 text-slate-400 text-right">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 px-4 flex items-center gap-4 text-white">
                    <img
                      src={token.logo}
                      alt={token.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="flex items-center gap-2">
                        {token.name}{" "}
                        <Copy
                          className="w-4 h-4 cursor-pointer text-slate-400 hover:text-violet-500"
                          onClick={() => copyToClipboard(token.address)}
                        />
                      </p>
                      <p className="text-xs text-gray-500">{token.symbol.toUpperCase()}</p>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-right text-white">${token.price.toFixed(6)}</td>
                  <td className="py-2 px-4 text-right text-white">${token.marketCap.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right text-white">${token.liquidity.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right text-white">${token.volume.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right text-white">{token.age}</td>
                  <td
                    className={`py-2 px-4 text-right ${
                      token.change_24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {token.change_24h.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredTokens.length === 0 && (
        <p className="text-slate-400 text-center mt-6">No tokens match your search.</p>
      )}
    </div>
  );
}
