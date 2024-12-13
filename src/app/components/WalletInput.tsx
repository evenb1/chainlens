"use client"
import React, { useState } from "react";

export default function WalletInput() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (wallet.trim()) {
      setLoading(true);
      // Simulate a search or API call
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <div className=" w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
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
          className={`bg-violet-950 text-violet-400 border border-violet-400 px-4 py-3 rounded-md font-medium transition-all hover:brightness-125 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Analyze"}
        </button>
      </form>
    </div>
  );
}
