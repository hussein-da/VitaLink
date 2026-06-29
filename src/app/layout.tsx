import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import DeviceFrame from "@/components/DeviceFrame";
import BottomNav from "@/components/BottomNav";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VitaLink - erklärbare Vorsorge-Hinweise",
  description:
    "Forschungsprototyp (Master MTI, HRW): erklärbare, nutzergerechte Vorsorge-Hinweise aus ePA und Wearable. Kein Medizinprodukt.",
  manifest: "/manifest.json",
  applicationName: "VitaLink",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VitaLink",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00897B",
};

// Blockierendes Inline-Skript: setzt data-theme vor dem ersten Paint (verhindert Flackern).
// In try/catch – bei jedem Fehler faellt es auf "light" zurueck ohne den Paint zu blockieren.
const themeInitScript = `(function(){try{var s=localStorage.getItem('vitalink.settings.v1');var t='system';if(s){var p=JSON.parse(s);if(p.theme==='light'||p.theme==='dark'||p.theme==='system')t=p.theme;}var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={sourceSans.variable} suppressHydrationWarning>
      <head>
        {/* Muss vor jedem anderen Skript und vor dem ersten Paint laufen (kein defer/async). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SettingsProvider>
          <DeviceFrame>
            <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
            <BottomNav />
          </DeviceFrame>
        </SettingsProvider>
      </body>
    </html>
  );
}
