const Footer: React.FC = () => {
    return (
      <footer className="mt-8 p-4 bg-neutral-800 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} ChainLens. All rights reserved.</p>
        <p className="mt-2">
          Built by <a href="https://github.com/evenb1" className="text-violet-500 hover:underline">Even Russom</a>
        </p>
      </footer>
    );
  };
  
  export default Footer;
  