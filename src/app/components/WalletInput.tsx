"use client";

import React, { useState } from "react";

interface WalletBalance {
  mintAddress: string;
  amount: number;
  decimals: number;
  tokenName?: string;
  tokenIcon?: string;
}

interface WalletData {
  balances: WalletBalance[];
  solBalance: number;
  message?: string;
}

export default function WalletInput() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Address is required.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);
    setCurrentPage(1);

    try {
      const response = await fetch(`/api/getWalletData?address=${input}`);
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || "Failed to fetch data.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = data?.balances ? Math.ceil(data.balances.length / itemsPerPage) : 0;
  const paginatedBalances = data?.balances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex px-24  items-center gap-2 mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter wallet or token address"
          className="flex-1 p-3 rounded-md px-5 w-2/3 bg-neutral-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500"
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

      {loading && (
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-violet-500"></div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {data && data.balances.length > 0 && (
        <div className="bg-neutral-800 p-6 rounded-md shadow-lg">
          <h2 className="text-xl text-violet-400 font-bold mb-4">Wallet Data</h2>
          <p className="text-white mb-4">SOL Balance: {data.solBalance.toFixed(6)} SOL</p>
          <h3 className="text-lg text-slate-400 font-bold mb-2">Tokens</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-4 text-slate-400">Token</th>
                <th className="py-2 px-4 text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBalances?.map((token: WalletBalance, index: number) => (
  <tr key={index} className="border-b border-gray-700">
    <td className="py-2 px-4 flex items-center gap-2 text-white">
      <img
        src={token.tokenIcon}
        alt={token.tokenName}
        className="w-6 h-6 rounded-full"
        onError={(e) => (e.currentTarget.src = "/placeholder-icon.png")} // Fallback for broken images
      />
      <div className="flex flex-col">
        <span>{token.tokenName}</span>
        <span className="text-xs text-gray-500">
          {token.mintAddress.slice(0, 4)}...{token.mintAddress.slice(-4)}
        </span>
      </div>
    </td>
    <td className="py-2 px-4 text-white">{token.amount.toFixed(6)}</td>
  </tr>
))}

            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-white">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {data && data.message && (
        <p className="text-center text-slate-400 mt-6">{data.message}</p>
      )}
    </div>
  );
}
