import type { Metadata } from "next";

// Google Fonts: Geist Sans and Geist Mono (used for clean modern typography)
import { Geist, Geist_Mono } from "next/font/google";

// Global Tailwind or CSS styles
import "./globals.css";

// Reusable Navbar shown on all pages
import Navbar from "../components/Navbar";

// Load and assign Geist Sans as a CSS variable
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load and assign Geist Mono (monospace font) as a CSS variable
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for SEO and social media preview (Open Graph)
export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Create and manage your portfolio with ease.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "My Portfolio",
    description: "Create and manage your portfolio with ease.",
    url: "https://my-portfolio.com",
    siteName: "My Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// Root layout component that wraps all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} 
          antialiased 
          bg-gray-900 text-white
        `}
      >
        {/* Global Navbar shown on every page */}
        <Navbar />

        {/* Dynamic page content rendered below */}
        <main>{children}</main>
      </body>
    </html>
  );
}
