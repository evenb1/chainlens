import './globals.css';
import React from 'react';

export const metadata = {
  title: 'ChainLens',
  description: 'Track wallet activities and trends like never before.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='bg-neutral-950'>
      <body className="relative h-screen w-screen text-slate-300 bg-neutral-950 bg-customGradient ">
      {children}
      </body>
    </html>
  );
}
