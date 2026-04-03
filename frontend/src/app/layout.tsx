import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

export const metadata: Metadata = {
  title: "Areco - Desafio Técnico",
  description: "Desafio Técnico de Integração SQL e IA",
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-screen bg-slate-50 antialiased">
        <Navbar />
        {/* Usamos a tag <main> para ser semântico conforme discutimos */}
        <main className="grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}