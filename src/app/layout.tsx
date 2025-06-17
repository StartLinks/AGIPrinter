import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./fonts.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGIPrinter",
  description: "AGIPrinter is a tool for generating images from bonjour.",
  icons: {
    icon: '/ico.svg',
    shortcut: '/ico.svg',
    apple: '/ico.svg',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
