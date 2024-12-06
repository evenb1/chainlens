"use client";

import { Wallet } from "lucide-react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";

// Helper function to validate Solana wallet addresses
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

const WalletInput: React.FC = () => {
  const [wallet, setWallet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate wallet address
    if (!wallet || !isValidSolanaAddress(wallet)) {
      setError("Invalid Solana wallet address. Please enter a valid address.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

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

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const paginatedTokens = data?.tokens?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="bg-transparent p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Wallet className="mr-2 h-8 w-8 text-purple-400" />

        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter wallet address"
          className="flex-1 p-2 text-xl rounded-md px-5 bg-neutral-800 text-white focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-violet-950 text-violet-400 border border-violet-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="bg-violet-400 shadow-violet-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {/* Display Data */}
      {data && (
        <div className="mt-6 bg-neutral-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Wallet Data:</h2>
          {data.tokens?.length > 0 ? (
            <>
              <table className="w-full text-left border-collapse border border-gray-700">
                <thead>
                  <tr>
                    <th className="border border-gray-700 p-2">Name</th>
                    <th className="border border-gray-700 p-2">Symbol</th>
                    <th className="border border-gray-700 p-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTokens?.map((token: any, index: number) => (
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
              {/* Pagination */}
              <ReactPaginate
                pageCount={Math.ceil(data.tokens.length / itemsPerPage)}
                onPageChange={handlePageChange}
                containerClassName="flex justify-center mt-4 space-x-2 text-white"
                activeClassName="font-bold"
                pageClassName="px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700"
              />
            </>
          ) : (
            <p className="text-white mt-4">No tokens found for this wallet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletInput;
