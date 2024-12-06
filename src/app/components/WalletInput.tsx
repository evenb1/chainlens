"use client";

import React, { useState } from "react";
import { Wallet } from "lucide-react";
import ReactPaginate from "react-paginate";

// Helper function to validate Solana wallet addresses
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

const WalletInput: React.FC = () => {
  const [wallet, setWallet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;

  const fetchWalletData = async () => {
    setLoading(true);
    setError(null);
    setTokenData(null);
    setTransactionData(null);

    try {
      // Fetch token balances
      const tokenResponse = await fetch("/api/solanaWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const tokens = await tokenResponse.json();

      // Fetch transactions
      const transactionResponse = await fetch("/api/solanaTransactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const transactions = await transactionResponse.json();

      // Handle responses
      if (tokenResponse.ok && transactionResponse.ok) {
        setTokenData(tokens);
        setTransactionData(transactions);
      } else {
        setError(
          tokens.message || transactions.message || "Failed to fetch wallet data."
        );
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !isValidSolanaAddress(wallet)) {
      setError("Invalid Solana wallet address.");
      return;
    }
    fetchWalletData();
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const paginatedTokens = tokenData?.tokens?.slice(
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
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {/* Display Token Data */}
      {tokenData && (
        <div className="mt-6 bg-neutral-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Tokens:</h2>
          {tokenData.tokens?.length > 0 ? (
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
              <ReactPaginate
                pageCount={Math.ceil(tokenData.tokens.length / itemsPerPage)}
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

      {/* Display Transaction Data */}
      {transactionData && (
        <div className="mt-6 bg-neutral-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Transactions:</h2>
          {transactionData.transactions?.length > 0 ? (
            <ul>
              {transactionData.transactions.map((tx: any, index: number) => (
                <li key={index} className="text-white mb-2">
                  Transaction: {tx.signature}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white mt-4">No transactions found for this wallet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletInput;
