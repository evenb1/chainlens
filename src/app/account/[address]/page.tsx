"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader, Clipboard } from "lucide-react";
import Image from "next/image";

interface Token {
  mintAddress: string;
  amount: number;
  tokenName: string;
  tokenIcon: string;
  price: number;
}

interface WalletData {
  solBalance: number;
  tokens: Token[];
}

export default function AccountPage() {
  const { address } = useParams();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchWalletData = async () => {
    setLoading(true);
    setError("");
    setWalletData(null);

    try {
      const response = await fetch(`/api/getWalletData?walletAddress=${address}`);
      const data = await response.json();

      console.log("API Response:", data);

      if (response.ok) {
        setWalletData(data);
      } else {
        console.error("API Error:", data.error);
        setError(data.error || "Failed to fetch wallet data.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch wallet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchWalletData();
    } else {
      setError("Wallet address not provided.");
    }
  }, [address]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-violet-400 h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-gray-400">SOL Balance</h3>
          <p className="text-2xl font-bold">{walletData?.solBalance.toFixed(2)} SOL</p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-gray-400">Token Count</h3>
          <p className="text-2xl font-bold">{walletData?.tokens.length} Tokens</p>
        </div>
      </div>

      {/* Tokens */}
      <div className="bg-neutral-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Tokens</h2>
        {walletData?.tokens.length === 0 ? (
          <p className="text-gray-400">No tokens found.</p>
        ) : (
          walletData?.tokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-700"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={token.tokenIcon || "/default-token-icon.png"}
                  alt={token.tokenName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-bold">{token.tokenName}</p>
                  <p className="text-gray-400 text-sm">{token.mintAddress}</p>
                </div>
              </div>
              <div>
                <p className="font-bold">{token.amount.toFixed(6)}</p>
                <p className="text-gray-400 text-sm">
                  ~${((token.amount || 0) * (token.price || 0)).toFixed(2)} USD
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}