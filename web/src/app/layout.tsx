import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/polyfills";
import { SolanaProvider } from "@/components/SolanaProvider";
import { OracleHeader } from "@/components/OracleHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Narrative Oracle | Intelligence Protocol",
  description: "Detecting the future before it benchmarks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SolanaProvider>
          <OracleHeader />
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
