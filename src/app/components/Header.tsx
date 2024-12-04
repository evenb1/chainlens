import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center text-slate-200 p-6 bg-none">
      <div className="text-2xl font-bold">ChainLens</div>
      <nav className="flex space-x-6">
        <a href="/" className="hover:text-blue-400 transition-colors">Dashboard</a>
        <a href="/social" className="hover:text-blue-400 transition-colors">Social Trends</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Settings</a>
      </nav>
    </header>
  );
};

export default Header;
