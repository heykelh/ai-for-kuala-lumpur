import "./globals.css";
import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "AI for Kuala Lumpur",
  description: "Real-time AI urban intelligence platform",
  icons: {
    icon: "/pt96.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}