import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TinyLink | Lightning-fast URL shortener",
  description:
    "TinyLink is a tiny-but-mighty URL shortener powered by Next.js, TailwindCSS, and Neon Postgres.",
  metadataBase: new URL(process.env.BASE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "TinyLink",
    description: "Shorten links, track clicks, and manage redirects with ease.",
    url: process.env.BASE_URL ?? "http://localhost:3000",
    siteName: "TinyLink",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-white antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.25),_transparent_55%)]">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-10">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
