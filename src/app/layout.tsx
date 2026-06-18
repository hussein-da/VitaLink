import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Fraunces } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import DeviceFrame from "@/components/DeviceFrame";
import Disclaimer from "@/components/Disclaimer";

// Body: gut lesbare humanistische Grotesk. Display: charaktervolle, seriöse Serif.
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "VorSicht - erklärbare Vorsorge-Hinweise (Demonstrator)",
  description:
    "Forschungs-Demonstrator (Master HCI, HRW): erklärbare, nutzergerechte Vorsorge-Hinweise aus synthetischen Daten. Kein Medizinprodukt.",
  manifest: "/manifest.json",
  applicationName: "VorSicht",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VorSicht",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e5c57",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${sourceSans.variable} ${fraunces.variable}`}>
      <body>
        <SettingsProvider>
          <DeviceFrame>
            <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
            <Disclaimer />
          </DeviceFrame>
        </SettingsProvider>
      </body>
    </html>
  );
}
