import Link from "next/link"; // Import Link from Next.js
import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="flex gap-8 items-center text-slate-300 px-14 py-6 bg-transparent">
      {/* Brand Logo and Name */}
      <Link href="/" className="flex items-center  text-2xl font-bold">
        <Image src="/froggie.png" alt="logo" height={50} width={50} />
        <Image src="/chainlens.png" alt="logo" height={100} width={140} className="mt-2"/>
      </Link>

      {/* Navigation */}
      <nav className="flex space-x-6">
        <Link href="/trending" className="pt-3 font-bold  text-base hover:text-violet-400 transition-colors">
          Trending Tokens
        </Link>
      </nav>
    </header>
  );
};

export default Header;
