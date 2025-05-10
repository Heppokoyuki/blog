import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import MountainLogo from "@/components/MountainLogo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "へっぽこ山行記",
  description: "山のブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center text-2xl font-bold hover:text-gray-600 transition-colors">
              <MountainLogo />
              へっぽこ山行記
            </Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-100 mt-8">
          <div className="container mx-auto px-4 py-6 text-center">
            <p>&copy; 2025 へっぽこ山行記</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
