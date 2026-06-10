import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RL Leaderboard",
  description: "強化学習モデルの自動評価・ランキングプラットフォーム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-200 px-6 py-4 flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            RL Leaderboard
          </Link>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Rankings
            </Link>
            <Link href="/history" className="hover:text-gray-900 transition-colors">
              History
            </Link>
          </nav>
        </header>
        <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">{children}</main>
        <footer className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400 text-center">
          RL Leaderboard — Evaluated on BipedalWalker-v3 · 10 episodes
        </footer>
      </body>
    </html>
  );
}
