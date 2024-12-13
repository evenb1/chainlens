import React, { useState } from "react";
import { Wallet } from "lucide-react"; // Icon library (you can replace it if needed)

const HomePage = () => {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (wallet.trim()) {
      setLoading(true);
      // Add logic to handle wallet submission
      setTimeout(() => setLoading(false), 1500); // Simulate loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex items-center justify-center">
      <div className="glass p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
        <h1 className="text-3xl font-extrabold text-violet-400 mb-4">
          Meme Coin Sentiment Analyzer
        </h1>
        <p className="text-gray-300 mb-6">
          Analyze wallet activity and social trends of meme coins in real-time.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="flex items-center bg-neutral-800 p-2 rounded-md w-full">
            
        </form>
      </div>
    </div>
  );
};

export default HomePage;
