import Link from "next/link"; // Import Link from Next.js
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center text-slate-200 p-6 bg-none">
      {/* Brand Name */}
      <div className="text-2xl font-bold">ChainLens</div>

      {/* Navigation */}
      <nav className="flex space-x-6">
        {/* Link to Trending Page */}
        <Link href="/trending">
          <span className="py-2 font-medium hover:text-violet-400">Trending Tokens</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
