"use client";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";

import { JetBrains_Mono, Outfit } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jetbrainsMono.variable} ${outfit.variable}`}>
      <body className="bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] min-h-screen text-gray-200 antialiased">
        <UserProvider>
          {children}
          <Toaster position="top-right" />
        </UserProvider>
      </body>
    </html>
  );
}
