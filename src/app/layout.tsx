import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EVG - Estevão Venancio Garcia | Personal Broker",
  description: "High-end real estate representation with purpose, strategy, and excellence.",
  icons: {
    icon: 'https://i.imgur.com/6dHb7s4.png',
    shortcut: 'https://i.imgur.com/6dHb7s4.png',
    apple: 'https://i.imgur.com/6dHb7s4.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://i.imgur.com" />
      </head>
      <body
        className={`${cinzel.variable} ${montserrat.variable} antialiased bg-[#0a0a0a] text-[#EDEDED] font-body`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
