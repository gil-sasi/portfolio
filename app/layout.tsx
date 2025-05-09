import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Import ClientWrapper with Redux + Navbar
import ClientWrapper from "../components/ClientWrapper";

// SEO Metadata
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

// Root Layout
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
          antialiased bg-gray-900 text-white
        `}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
