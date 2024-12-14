"use client";
import React, { useState } from "react";

interface WalletBalance {
  mintAddress: string;
  amount: number;
}

interface WalletTransaction {
  signature: string;
  slot: number;
}

interface WalletData {
  balances: WalletBalance[];
  transactions: WalletTransaction[];
}

export default function WalletInput() {
  const [wallet, setWallet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(`/api/getWalletData?walletAddress=${wallet}`);
      if (response.status === 404) {
        throw new Error("Wallet not found. Please check the address.");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch wallet data due to server issues.");
      }

      const result: WalletData = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
        <>
          <div className="mt-6 p-4 bg-neutral-800 rounded-md shadow-lg overflow-x-auto">
            <h2 className="text-lg font-bold text-violet-400 mb-4">Wallet Balances</h2>
            {data.balances.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-4 text-slate-400">Token Address</th>
                    <th className="py-2 px-4 text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.balances.map((balance, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 px-4 text-white">{balance.mintAddress}</td>
                      <td className="py-2 px-4 text-white">{balance.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-slate-400">No token balances found for this wallet.</p>
            )}
          </div>

          <div className="mt-6 p-4 bg-neutral-800 rounded-md shadow-lg overflow-x-auto">
            <h2 className="text-lg font-bold text-violet-400 mb-4">Recent Transactions</h2>
            {data.transactions.length > 0 ? (
              <ul className="space-y-2 text-white">
                {data.transactions.map((tx, index) => (
                  <li key={index} className="flex justify-between">
                    <span>Slot: {tx.slot}</span>
                    <a
                      href={`https://solscan.io/tx/${tx.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline"
                    >
                      View on Solscan
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-400">No recent transactions found for this wallet.</p>
            )}
          </div>
        </>
      )}

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-violet-400"></div>
        </div>
      )}
    </div>
  );
}
