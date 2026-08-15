import type { Metadata } from "next";
import { Newsreader, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://petresona.it";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PetResona — Biorisonanza a distanza per cani e gatti",
  description:
    "PetResona è un percorso di biorisonanza a distanza per cani e gatti che considera insieme animale, persona e ambiente. Approccio complementare, non sostituisce la valutazione veterinaria.",
  openGraph: {
    title: "PetResona — Biorisonanza a distanza per cani e gatti",
    description:
      "Un percorso a distanza che considera insieme animale, persona e ambiente.",
    url: siteUrl,
    siteName: "PetResona",
    locale: "it_IT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F0E7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${newsreader.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
