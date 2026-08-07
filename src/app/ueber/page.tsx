// Über-Seite — Forschungskontext und die einzige Disclaimer-Box der App (Block 4).
//
// Bleibt Server-Component, weil sie `metadata` exportiert. Der gesamte sichtbare
// Text liegt in der Client-Unterkomponente UeberContent (F9-Muster wie bei
// /hinweis/[id]). Der Build-Zeitstempel wird als roher ISO-Wert durchgereicht und
// erst dort locale-abhängig formatiert.
import UeberContent from "./UeberContent";

// Zweisprachig-neutral: Metadata ist statisch und kann den Sprach-Context nicht
// lesen (siehe Entscheidung zu F9 im Abschlussbericht).
export const metadata = {
  title: "VitaLink",
};

export default function UeberPage() {
  return <UeberContent buildTime={process.env.NEXT_PUBLIC_BUILD_TIME ?? null} />;
}
