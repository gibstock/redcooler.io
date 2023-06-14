import Providers from "@/utils/provider";
import React from 'react';
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";
import './globals.css'



export const metadata = {
  title: 'Redcooler.io',
  description: 'Community Writing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
