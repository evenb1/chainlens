import React from "react";
import Header from "./components/Header";
import WalletInput from "./components/WalletInput";

export default function Home() {
  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-black via-violet-900 to-black text-white">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-28 p-6">
        {/* Title */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
          Welcome to ChainLens
        </h1>
        {/* Subtitle */}
        <p className="text-lg font-light text-slate-400 mt-4">
          Analyze wallet activity and social trends of meme coins in real-time.
        </p>
        
        {/* Wallet Input Section */}
        <div className="flex flex-col items-center justify-between mt-10">
          <WalletInput />
          {/* Additional Links or Features (Optional) */}
          <p className="text-sm text-slate-500">
            Powered by advanced blockchain analytics
          </p>
        </div>
      </div>
    </div>
  );
}
