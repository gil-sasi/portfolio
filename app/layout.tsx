import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "../components/ClientWrapper";
import TrackVisit from "../components/TrackVisit";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Create and manage your portfolio with ease.",
  icons: {
    icon: "/icon/icon.png",
    apple: "/icon/icon.png",
  },
  openGraph: {
    title: "My Portfolio",
    description: "This is Gil Sasi portfolio enjoy your stay",
    url: "https://gil-sasi.com",
    siteName: "My Portfolio",
    images: [
      {
        url: "/icon/icon.png",
        width: 1200,
        height: 630,
        alt: "My Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/icon/icon.png" />
        <link rel="apple-touch-icon" href="/icon/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Portfolio</title>
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased bg-gray-900 text-white
        `}
      >
        <TrackVisit /> {/* Log visit on load */}
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
