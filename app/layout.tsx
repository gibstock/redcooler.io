import Providers from '@/utils/provider';
import React from 'react';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';
import { Montserrat } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'Redcooler.net — Motivation awaits',
  description: 'Community Writing',
};

const montserrat = Montserrat({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} bg-white dark:bg-dark-black`}>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
