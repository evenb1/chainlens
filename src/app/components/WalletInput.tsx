"use client"; // Required for client-side interactivity in Next.js

import React, { useState } from "react";

const WalletInput: React.FC = () => {
  const [wallet, setWallet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      alert("Please enter a wallet address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/fetchWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        alert(result.message || "Failed to fetch wallet data.");
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      alert("An error occurred. Please try again.");
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
          placeholder="Enter wallet address"
          className="flex-1 p-2 rounded-md bg-neutral-800 text-white focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Loading..." : "Track"}
        </button>
      </form>
      {data && (
        <div className="mt-6 text-white">
          <h2 className="font-bold text-lg">Wallet Data:</h2>
          <pre className="text-sm bg-neutral-800 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WalletInput;
