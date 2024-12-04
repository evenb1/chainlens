"use client";

import React, { useState } from "react";

const WalletInput: React.FC = () => {
  const [wallet, setWallet] = useState<string>("");
  const [tokens, setTokens] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || wallet.length !== 44) {
      setError("Invalid wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/solanaWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      const result = await response.json();

      if (response.ok) {
        setTokens(result || []);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch wallet data.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter Solana wallet address"
          className="flex-1 p-2 rounded-md bg-neutral-800 text-white focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      {tokens.length > 0 && (
        <div className="mt-6 text-white">
          <h2 className="font-bold text-lg mb-4">Wallet Tokens:</h2>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2">Name</th>
                <th className="border border-gray-700 p-2">Symbol</th>
                <th className="border border-gray-700 p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index}>
                  <td className="border border-gray-700 p-2">{token.tokenName}</td>
                  <td className="border border-gray-700 p-2">{token.tokenSymbol}</td>
                  <td className="border border-gray-700 p-2">{token.tokenAmount.uiAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WalletInput;
