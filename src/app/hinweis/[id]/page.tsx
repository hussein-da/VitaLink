import { hinweise } from "@/data/hinweise";
import HinweisDetail from "./HinweisDetail";

export function generateStaticParams() {
  return hinweise.map((h) => ({ id: h.id }));
}

export default function HinweisPage({ params }: { params: { id: string } }) {
  return <HinweisDetail id={params.id} />;
}
