import "./globals.css";
import { Orbitron } from "next/font/google";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});



export const metadata = {
  title: "Petshop",
  description: "Front-end da aplicação",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#0B0E11] text-gray-200 min-h-screen`}>{children}</body>
    </html>
  );
}
