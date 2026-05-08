import type { Metadata } from "next";
import { Unbounded, Epilogue } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

const epilogue = Epilogue({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Erin Nodland — Software Developer specialising in AI",
  description:
    "I design and build AI agents and automation workflows that solve real business problems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${epilogue.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
