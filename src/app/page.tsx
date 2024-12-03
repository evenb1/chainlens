import React from "react";

export default function Home() {
  return (
    <div className="relative h-screen w-screen bg-black">
      {/* Background Layers */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-5xl font-bold mb-4">Welcome to ChainLens</h1>
        <p className="text-lg text-gray-400">Track wallet activities and trends like never before.</p>
      </div>
    </div>
  );
}
