// src/app/layout.tsx
'use client';
import './globals.css';
import { UserProvider } from '@/context/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] min-h-screen text-gray-200 antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
