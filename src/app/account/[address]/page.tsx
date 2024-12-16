"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";

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
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch(`/api/getWalletData?walletAddress=${address}`);
        if (!response.ok) throw new Error("Failed to fetch wallet data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (address) fetchWalletData();
  }, [address]);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Account Details</h1>
        <p className="text-gray-400">{address}</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin h-12 w-12 text-violet-400" />
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Wallet Data */}
      {data && (
        <div className="space-y-6">
          {/* SOL Balance */}
          <div className="bg-neutral-800 p-6 rounded-md shadow-md">
            <h2 className="text-gray-400">SOL Balance</h2>
            <p className="text-3xl font-bold">{data.balance.toFixed(2)} SOL</p>
          </div>

          {/* Tokens */}
          <div className="bg-neutral-800 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Token Balances</h2>
            <ul>
              {data.tokens.map((token, index) => (
                <li key={index} className="flex items-center gap-4 mb-3">
                  <Image
                    src={token.tokenIcon || "/placeholder-icon.png"}
                    alt="Token Icon"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-bold">{token.tokenName}</p>
                    <p className="text-gray-400">{token.amount.toFixed(6)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
