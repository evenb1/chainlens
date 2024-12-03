import './globals.css';
import React from 'react';

export const metadata = {
  title: 'ChainLens',
  description: 'Track wallet activities and trends like never before.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
