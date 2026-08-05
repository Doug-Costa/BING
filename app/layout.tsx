import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: { default: "Bingo Show", template: "%s | Bingo Show" },
  description: "Bingo online com sorteios ao vivo e prêmios incríveis.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Bingo Show" }
};

export const viewport: Viewport = { themeColor: "#061b54", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><AppProvider>{children}</AppProvider>  <SpeedInsights/>  <Analytics /> </body>
    </html>
  );
}
