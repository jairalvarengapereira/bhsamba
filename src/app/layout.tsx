import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BHSamba - O Melhor Samba de Belo Horizonte",
  description: "Grupo de samba BHSamba - Shows, agenda e muito mais em Belo Horizonte, MG",
  keywords: "samba, BHSamba, Belo Horizonte, shows, música ao vivo",
  openGraph: {
    title: "BHSamba - O Melhor Samba de Belo Horizonte",
    description: "Shows, agenda e divulgação do grupo BHSamba",
    locale: "pt_BR",
    siteName: "BHSamba",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}