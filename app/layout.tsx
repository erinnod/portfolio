import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  weight: ["400", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Erin Nodland — AI workflows that ship",
  description:
    "Software developer at Shoothill building AI agents and automation workflows that run in production.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
