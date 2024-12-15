import React from "react";
import Header from "./components/Header";
import WalletInput from "./components/WalletInput";
import { BackgroundBeamsWithCollision } from "./components/ui/background-beams-with-collision";

export default function Home() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="relative flex flex-col h-screen w-screen text-white">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          {/* Highlight Section */}
          <h2 className="text-2xl md:text-4xl lg:text-7xl font-bold text-black dark:text-white font-sans tracking-tight">
            What&apos;s cooler than Beams?{" "}
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span>Exploding beams.</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span>Exploding beams.</span>
              </div>
            </div>
          </h2>

          {/* Subtitle */}
          <p className="text-lg font-light text-slate-400 mt-4">
            Analyze wallet activity and social trends of meme coins in real-time.
          </p>

          {/* Wallet Input Section */}
          <div className="flex flex-col items-center justify-center mt-10">
            <WalletInput />
            <p className="text-sm text-slate-500 mt-4">
              Powered by advanced blockchain analytics
            </p>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
