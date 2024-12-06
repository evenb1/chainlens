"use client";

import { Wallet } from "lucide-react";
import React, { useState } from "react";

const WalletInput: React.FC = () => {
  const [wallet, setWallet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || wallet.length !== 44) {
      setError("Invalid Solana wallet address. Please enter a valid address.");
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
        setData(result);
      } else {
        setError(result.message || "Failed to fetch wallet data.");
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 via-indigo-600 to-blue-500 p-6 rounded-lg shadow-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 items-center justify-center"
      >
        <div className="relative w-full">
          <Wallet className="absolute left-3 top-3 h-6 w-6 text-indigo-400" />
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full p-3 pl-10 text-lg rounded-md bg-neutral-900 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-gradient-to-r from-purple-400 via-indigo-500 to-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`relative inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-bold shadow-md transition-all duration-300 hover:brightness-125 active:scale-95 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span
            className={`absolute inset-0 w-full h-full bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 opacity-10 rounded-lg transition-all duration-500 ${
              loading ? "animate-pulse" : ""
            }`}
          ></span>
          {loading ? "Loading..." : "Track Wallet"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-400 font-medium">{error}</p>}

      {data && (
        <div className="mt-6 bg-neutral-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Wallet Data:</h2>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2">Name</th>
                <th className="border border-gray-700 p-2">Symbol</th>
                <th className="border border-gray-700 p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.tokens.map((token: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-700 p-2">{token.tokenName}</td>
                  <td className="border border-gray-700 p-2">{token.tokenSymbol}</td>
                  <td className="border border-gray-700 p-2">
                    {token.tokenAmount.uiAmount || 0}
                  </td>
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
