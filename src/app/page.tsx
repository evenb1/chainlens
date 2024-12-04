import React from "react";
import Header from "./components/Header";
import WalletInput from "./components/WalletInput";

export default function Home() {
  return (
    <div className="relative h-screen  w-screen">
        <Header/>
      {/* Main Content */}
      <div className="flex flex-col p-20 items-center h-full">
        <h1 className="text-5xl font-bold mb-2 ">Welcome to ChainLens</h1>
        <p className="text-lg font-light text-gray-400 pb-16">Track wallet activities and trends </p>
        <WalletInput/>
      </div>
    </div>
  );
}
