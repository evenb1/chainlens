import React from "react";
import Header from "./components/Header";
import WalletInput from "./components/WalletInput";

export default function Home() {
  return (
    <div className="relative h-screen  w-screen">
        <Header/>
      {/* Main Content */}
      <div className="flex flex-col p-20 items-center h-full">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">Welcome to ChainLens</h1>
        <p className="text-lg font-light text-slate-500 pb-16">Track wallet activities and trends </p>
        <WalletInput/>
      </div>
    </div>
  );
}
