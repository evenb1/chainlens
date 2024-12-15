import Footer from './components/Footer';
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'ChainLens',
  description: 'Track wallet activities and trends like never before.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className=''>
      <body className="relative h-screen w-screen ">
      {children}

      </body>
    </html>
  );
}
