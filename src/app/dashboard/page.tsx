"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import HinweisCard from "@/components/HinweisCard";
import { hinweiseSortiert } from "@/data/hinweise";
import { vorname } from "@/data/profile";

export default function DashboardPage() {
  return (
    <div>
      <AppHeader
        title={`Hallo ${vorname}`}
        brand
        right={
          <Link
            href="/einstellungen"
            aria-label="Einstellungen"
            className="tap flex items-center justify-center rounded-lg text-muted hover:text-primary"
          >
            <Settings2 aria-hidden size={22} />
          </Link>
        }
      />

      <div className="space-y-4 px-4 py-5">
        <p className="text-muted">
          Hier sind deine aktuellen Vorsorge-Hinweise. Jeder Hinweis ist begruendet, quellenbelegt
          und du kannst ihm widersprechen.
        </p>

        {hinweiseSortiert.map((h) => (
          <HinweisCard key={h.id} hinweis={h} />
        ))}
      </div>
    </div>
  );
}
