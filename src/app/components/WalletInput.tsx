"use client";
import React, { useState } from "react";

export default function WalletInput() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!wallet.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      // Call backend API (replace `/api/getWalletData` with your endpoint)
      const response = await fetch(`/api/getWalletData?walletAddress=${wallet}`);
      if (!response.ok) throw new Error("Failed to fetch wallet data");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Invalid wallet address or failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter wallet address"
          className="flex-1 p-3 px-5 text-lg rounded-md bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
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

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display Results */}
      {data && (
        <div className="mt-6 p-4 bg-neutral-800 rounded-md shadow-lg">
          <h2 className="text-lg font-bold text-violet-400">Wallet Data</h2>
          <ul className="mt-2 space-y-2 text-white">
            {data.balances.map((balance: any, index: number) => (
              <li key={index} className="flex justify-between">
                <span>{balance.mintAddress}</span>
                <span>{balance.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
