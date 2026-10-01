import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const hanken = Hanken_Grotesk({
  weight: ["400", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const TITLE = "Erin Nodland — AI workflows that ship";
const DESCRIPTION =
  "Software developer at Shoothill building AI agents and automation workflows that run in production.";

export const metadata: Metadata = {
  // Link previews need absolute URLs. Vercel names the production domain, so a custom domain is picked up as-is.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3007",
  ),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/", siteName: "Erin Nodland", type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body suppressHydrationWarning>
        {children}
        {/* Cookieless page views; inert in dev and until Web Analytics is enabled on the Vercel project. */}
        <Analytics />
      </body>
    </html>
  );
}
