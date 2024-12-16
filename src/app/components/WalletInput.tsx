"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function WalletInput() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a valid wallet or token address.");
      return;
    }

    setLoading(true);
    setError("");

    // Navigate to the account details page
    router.push(`/account/${input}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter wallet or token address"
          className="flex-1 p-3 rounded-md bg-neutral-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500"
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
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
