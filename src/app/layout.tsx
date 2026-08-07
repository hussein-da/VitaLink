import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import DeviceFrame from "@/components/DeviceFrame";
import BottomNav from "@/components/BottomNav";
import SwipeNav from "@/components/SwipeNav";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Route-Metadata ist statisch und serverseitig; sie kann den clientseitigen
// Sprach-Context prinzipiell nicht lesen. Daher bewusst zweisprachig-neutral:
// Der Titel ist der Produktname (sprachneutral), die Beschreibung fuehrt beide
// Sprachen. Der Nicht-Medizinprodukt-Hinweis steht dadurch in BEIDEN Sprachen
// und behaelt seine Schutzwirkung (L5).
export const metadata: Metadata = {
  title: "VitaLink",
  description:
    "Forschungsprototyp (Master MTI, HRW): erklärbare Vorsorge-Hinweise aus ePA und Wearable. Kein Medizinprodukt. · Research prototype: explainable preventive-care insights from electronic patient record and wearable data. Not a medical device.",
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

// Blockierendes Inline-Skript: setzt data-theme UND lang/data-lang vor dem ersten
// Paint (verhindert Farb- und Sprachflackern).
// In try/catch – bei jedem Fehler faellt es auf "light" und Deutsch zurueck, ohne
// den Paint zu blockieren.
//
// ACHTUNG - ZWILLINGSLOGIK: Die Sprachvalidierung unten ist wortgleich mit
// readStoredLanguage() in src/context/SettingsContext.tsx. Dieses Skript kann kein
// Modul importieren, weil es synchron im <head> laufen muss. Laufen beide Fassungen
// auseinander, entsteht genau das Sprachflackern, das sie verhindern sollen.
// Jede Aenderung hier MUSS dort nachgezogen werden und umgekehrt.
//
// lang/data-lang tragen die AUFGELOESTE Locale (de/en); bei tr/ar steht dort "en",
// passend zum tatsaechlich gerenderten Sprachstand (siehe resolveLocale).
const themeInitScript = `(function(){try{var s=localStorage.getItem('vitalink.settings.v1');var t='system';var l='de';if(s){var p=JSON.parse(s);if(p.theme==='light'||p.theme==='dark'||p.theme==='system')t=p.theme;if(p.language==='de'||p.language==='en'||p.language==='tr'||p.language==='ar')l=p.language;}var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');var loc=l==='de'?'de':'en';document.documentElement.lang=loc;document.documentElement.setAttribute('data-lang',loc);}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.lang='de';document.documentElement.setAttribute('data-lang','de');}})();`;

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
            <main className="flex flex-1 flex-col overflow-y-auto">
              <SwipeNav>{children}</SwipeNav>
            </main>
            <BottomNav />
          </DeviceFrame>
        </SettingsProvider>
      </body>
    </html>
  );
}
