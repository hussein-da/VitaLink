import { hinweisIds } from "@/data/hinweise";
import HinweisDetail from "./HinweisDetail";

// hinweisIds ist bewusst locale-unabhaengig: generateStaticParams laeuft zur
// Build-Zeit und darf nicht von der (clientseitigen) Sprachwahl abhaengen.
export function generateStaticParams() {
  return hinweisIds.map((id) => ({ id }));
}

export default function HinweisPage({ params }: { params: { id: string } }) {
  return <HinweisDetail id={params.id} />;
}
