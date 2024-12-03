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
    <div className="bg-transparent p-6 rounded-lg ">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter wallet address"
          className="flex-1 p-2 text-xl rounded-md px-5 bg-neutral-800  text-white focus:outline-none"
        />
<button className="bg-violet-950 text-violet-400 border border-violet-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
  <span className="bg-violet-400 shadow-violet-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
Search
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
