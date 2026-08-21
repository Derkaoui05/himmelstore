"use client";

import { useState } from "react";

interface OlfactoryPyramidProps {
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
}

export default function OlfactoryPyramid({
  topNotes = [],
  heartNotes = [],
  baseNotes = [],
}: OlfactoryPyramidProps) {
  const [activeTier, setActiveTier] = useState<"head" | "heart" | "base" | null>(null);

  const hasNotes =
    (topNotes && topNotes.length > 0) ||
    (heartNotes && heartNotes.length > 0) ||
    (baseNotes && baseNotes.length > 0);

  if (!hasNotes) {
    return null;
  }

  const tiers = [
    {
      id: "head" as const,
      title: "Notes de Tête",
      subtitle: "Première impression",
      duration: "5 à 15 min",
      description: "Les notes les plus volatiles et pétillantes, perçues dès la première vaporisation.",
      notes: topNotes,
      icon: "✨",
      color: "from-amber-100/40 via-amber-50/20 to-transparent",
      borderColor: "border-amber-200/80 hover:border-gold",
      activeBg: "bg-amber-50/80 border-gold shadow-sm",
    },
    {
      id: "heart" as const,
      title: "Notes de Cœur",
      subtitle: "Personnalité & signature",
      duration: "2 à 4 heures",
      description: "Le cœur battant du parfum qui dévoile sa véritable identité olfactive.",
      notes: heartNotes,
      icon: "🌹",
      color: "from-amber-200/40 via-amber-100/20 to-transparent",
      borderColor: "border-amber-300/80 hover:border-gold",
      activeBg: "bg-amber-100/50 border-gold shadow-sm",
    },
    {
      id: "base" as const,
      title: "Notes de Fond",
      subtitle: "Sillage profond & sillage",
      duration: "4 à 8+ heures",
      description: "Les notes riches et persistantes qui fixent le parfum et créent son empreinte inoubliable.",
      notes: baseNotes,
      icon: "🪵",
      color: "from-amber-300/40 via-amber-200/20 to-transparent",
      borderColor: "border-amber-400/80 hover:border-gold",
      activeBg: "bg-amber-200/40 border-gold shadow-sm",
    },
  ];

  return (
    <div className="mt-10 rounded-2xl border border-stone-200/80 bg-gradient-to-b from-[#FCFBF8] to-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/70 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">
            Structure Olfactive
          </span>
          <h3 className="font-heading text-xl font-semibold text-stone-900 sm:text-2xl">
            Pyramide Olfactive
          </h3>
        </div>
        <span className="text-xs text-stone-500 font-medium">
          Survolez pour explorer l'évolution
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {tiers.map((tier) => {
          const isActive = activeTier === tier.id;
          const hasTierNotes = tier.notes && tier.notes.length > 0;

          if (!hasTierNotes) return null;

          return (
            <div
              key={tier.id}
              onMouseEnter={() => setActiveTier(tier.id)}
              onMouseLeave={() => setActiveTier(null)}
              className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                isActive ? tier.activeBg : `bg-white/80 ${tier.borderColor}`
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-sm">
                    {tier.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold tracking-wide text-stone-900">
                      {tier.title}
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      {tier.subtitle}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-3 w-3 text-gold-dark"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {tier.duration}
                </span>
              </div>

              {/* Note pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {tier.notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg border border-stone-200/90 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 shadow-2xs transition-all duration-200 group-hover:border-gold/60 group-hover:text-gold-dark hover:scale-105"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Explanatory detail on hover */}
              <p className="mt-3 text-[11px] leading-relaxed text-stone-500">
                {tier.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
