"use client";

import React, { useState, useEffect } from "react";
import { fetchTokenMetadata } from "@/utils/tokenMetadata";
import { Clipboard, Loader, ImageIcon } from "lucide-react"; // Icons for design
import Image from "next/image";
import { isWalletAddress } from "@/utils/detectAddress";

// Types
interface Token {
  mintAddress: string;
  amount?: number;
  tokenName?: string;
  tokenIcon?: string;
  liquidity?: string;
  marketCap?: string;
  holders?: number;
  age?: string;
  percentChange?: string;
}

interface WalletData {
  balance?: number;
  tokens: Token[];
}

export default function WalletInput() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string>("");
  const [isToken, setIsToken] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a valid wallet or token address.");
      return;
    }
  
    setLoading(true);
    setError("");
    setData(null);
    setCurrentPage(1);
  
    try {
      if (isWalletAddress(input)) {
        // It's a wallet address
        setIsToken(false);
        const response = await fetch(`/api/getWalletData?walletAddress=${input}`);
        if (!response.ok) throw new Error("Failed to fetch wallet data.");
  
        const walletData = await response.json();
  
        // Fetch token metadata and enrich data
        const tokenMetadata = await fetchTokenMetadata();
        const enrichedTokens = walletData.tokens.map((token: any) => {
          const metadata = tokenMetadata.find((t) => t.address === token.mintAddress);
          return {
            ...token,
            tokenName: metadata?.name || "Unknown Token",
            tokenIcon: metadata?.logoURI || "/placeholder-icon.png",
          };
        });
  
        // Sort tokens from highest to lowest balance
        const sortedTokens = enrichedTokens.sort((a: Token, b: Token) => b.amount! - a.amount!);
  
        setData({ balance: walletData.balance, tokens: sortedTokens });
      } else {
        // It's a token address
        setIsToken(true);
        const response = await fetch(`/api/getTokenData?tokenAddress=${input}`);
        if (!response.ok) throw new Error("Failed to fetch token data.");
  
        const tokenData = await response.json();
        setData({ tokens: [tokenData] }); // Wrap in an array for consistency
      }
    } catch (err: any) {
      setError(err.message || "Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // Pagination logic
  const totalPages = data?.tokens ? Math.ceil(data.tokens.length / itemsPerPage) : 0;
  const paginatedTokens = data?.tokens?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter wallet or token address"
          className="flex-1 p-3 rounded-md bg-neutral-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-violet-950 text-violet-400 border border-violet-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Loading */}
      {loading && <Loader className="animate-spin h-10 w-10 mx-auto text-violet-400" />}

      {/* Wallet Address */}
      {data && !isToken && (
        <div className="bg-neutral-800 p-6 rounded-md shadow-lg">
          <h2 className="text-xl text-violet-400 mb-4">SOL Balance: {data.balance?.toFixed(6)} SOL</h2>
          <h3 className="text-lg text-slate-400 mb-2">Token Balances</h3>
          <ul>
            {paginatedTokens?.map((token, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <Image
                    src={token.tokenIcon || "/placeholder-icon.png"}
                    alt={token.tokenName || "Token"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-white">{token.tokenName}</p>
                    <p className="text-xs text-gray-500">{token.mintAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white">{token.amount?.toFixed(6)}</p>
                  <Clipboard
                    className="text-gray-500 hover:text-violet-400 cursor-pointer"
                    onClick={() => copyToClipboard(token.mintAddress)}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
    className="text-white px-4 py-2 bg-violet-500 rounded-md disabled:opacity-50"
  >
    Previous
  </button>
  <span className="text-white">
    Page {currentPage} of {totalPages || 1}
  </span>
  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
    className="text-white px-4 py-2 bg-violet-500 rounded-md disabled:opacity-50"
  >
    Next
  </button>
</div>

        </div>
      )}

      {/* Token Address */}
      {data && isToken && (
  <div className="bg-neutral-800 p-6 rounded-md shadow-lg text-center">
    <Image
      src={data.tokens[0]?.tokenIcon || "/placeholder-icon.png"}
      alt={data.tokens[0]?.tokenName || "Token"}
      width={64}
      height={64}
      className="rounded-full mx-auto mb-4"
    />
    <h2 className="text-2xl text-violet-400 mb-2">
      {data.tokens[0]?.tokenName || "Token Details"}
    </h2>
    <ul className="text-white space-y-2">
      <li>Liquidity: ${data.tokens[0]?.liquidity || "N/A"}</li>
      <li>Market Cap: ${data.tokens[0]?.marketCap || "N/A"}</li>
      <li>Holders: {data.tokens[0]?.holders || "N/A"}</li>
      <li>Age: {data.tokens[0]?.age || "N/A"}</li>
      <li>% Change: {data.tokens[0]?.percentChange || "N/A"}</li>
    </ul>
  </div>
)}

    </div>
  );
}
