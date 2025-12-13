import "./globals.css";

export const metadata = {
  title: "Petshop",
  description: "Front-end da aplicação",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
