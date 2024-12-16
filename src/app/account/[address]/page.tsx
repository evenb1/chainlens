"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Clipboard, Loader, CheckCircle } from "lucide-react";
import Image from "next/image";

// Types
interface Token {
  mintAddress: string;
  amount: number;
  tokenName: string;
  tokenIcon: string;
}

interface WalletData {
  balance: number;
  tokens: Token[];
}

export default function AccountPage() {
  const { address } = useParams();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getWalletData?walletAddress=${address}`);
        const data = await response.json();
        setWalletData(data);
      } catch {
        setWalletData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const paginatedTokens = walletData?.tokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-black min-h-screen text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Account</h1>
          <p className="flex items-center gap-2 text-gray-400">
            {address}
            <Clipboard
              className="cursor-pointer hover:text-violet-400"
              onClick={() => navigator.clipboard.writeText(address as string)}
            />
          </p>
        </div>
      </div>

      {/* Overview */}
      {loading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin text-violet-400 h-10 w-10" />
        </div>
      ) : walletData ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-gray-400">SOL Balance</h3>
            <p className="text-2xl font-bold">{walletData.balance} SOL</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-gray-400">Token Balance</h3>
            <p className="text-2xl font-bold">{walletData.tokens.length} Tokens</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Failed to load data.</p>
      )}

      {/* Tokens */}
      <div className="bg-neutral-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Tokens</h2>
        {paginatedTokens?.map((token, index) => (
          <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-700">
            <Image
              src={token.tokenIcon || "/placeholder-icon.png"}
              alt={token.tokenName}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="font-bold">{token.tokenName || "Unknown Token"}</p>
              <p className="text-gray-400 text-sm">{token.mintAddress}</p>
            </div>
            <p className="font-bold">{token.amount.toFixed(2)}</p>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-violet-600 rounded hover:bg-violet-500 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil((walletData?.tokens.length || 1) / itemsPerPage)}
          </span>
          <button
            disabled={currentPage * itemsPerPage >= (walletData?.tokens.length || 0)}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-violet-600 rounded hover:bg-violet-500 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
