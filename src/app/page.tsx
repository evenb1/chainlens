import React from "react";
import Header from "./components/Header";
import WalletInput from "./components/WalletInput";

export default function Home() {
  return (
    <div className="relative h-screen w-screen">
        <Header/>
      {/* Main Content */}
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-5xl font-bold mb-4">Welcome to ChainLens</h1>
        <p className="text-lg text-gray-200 mb-10">Track wallet activities and trends </p>
        <WalletInput/>
      </div>
    </div>
  );
}
