// Sensordaten-Übersicht — bleibt Server-Component, weil sie `searchParams` liest.
// Der gesamte sichtbare Text (und der Aufbau der Wert-Sektionen) liegt in der
// Client-Unterkomponente WerteContent — Muster wie /ueber (page.tsx + UeberContent.tsx).
import WerteContent from "./WerteContent";

export default function WertePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const from = typeof searchParams?.from === "string" ? searchParams.from : undefined;
  return <WerteContent from={from} />;
}
