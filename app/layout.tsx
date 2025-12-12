import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getAllMessages } from "@/lib/i18n-server";
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
  title: "agital.soft",
  description: "agital.soft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = getAllMessages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider messages={messages}>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-10 pt-6">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
