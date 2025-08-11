'use client';

import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PopupMessage from '@/components/popup';
import { PopupProvider } from '@/context/popup_ctx';
import { AuthProvider } from '@/context/auth_ctx';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
        <title>Logreact</title>
        <meta name='description' content='New open-source correlator' />
      </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <PopupProvider>
            <Sidebar />
            <Header />
            
            <section className="home-section font-[family-name:var(--font-geist-sans)] bg-gray-900 text-white">
              {children}
            </section>
            <PopupMessage />
          </PopupProvider>
        </AuthProvider>
        </body>
      </html>
  );
}
