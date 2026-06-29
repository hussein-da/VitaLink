import Link from "next/link";

/**
 * Persistenter, dezenter Hinweis: kein Medizinprodukt / synthetische Daten.
 * Erfüllt Leitplanke #2 (Disclaimer auf jedem Hauptscreen) und verlinkt auf
 * /ueber, wo die vollständige Projekt-/Disclaimer-Box steht (macht /ueber
 * zugleich ohne Umweg über die Einstellungen erreichbar).
 */
export default function MedicalDisclaimer() {
  return (
    <Link
      href="/ueber"
      aria-label="Über VitaLink: Forschungs-Demonstrator, kein Medizinprodukt, synthetische Daten"
      className="block px-4 py-1.5 text-center text-[11px] leading-tight text-muted"
    >
      Forschungs-Demonstrator · Kein Medizinprodukt · Synthetische Daten
    </Link>
  );
}
