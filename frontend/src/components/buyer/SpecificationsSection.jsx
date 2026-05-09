"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const COLORS = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

const SpecRow = ({ label, value, isLast }) => (
  <div
    className={`flex items-center justify-between gap-6 px-4 py-3 text-sm ${isLast ? "" : "border-b"}`}
    style={{ borderColor: COLORS.border }}
  >
    <span className="font-semibold" style={{ color: COLORS.text }}>
      {label}
    </span>
    <span className="text-right" style={{ color: COLORS.text, opacity: 0.75 }}>
      {value || "—"}
    </span>
  </div>
);

export default function SpecificationsSection() {
  const [expanded, setExpanded] = useState(false);

  const specs = useMemo(
    () => [
      { label: "Driver Size", value: "40mm Dynamic Driver" },
      { label: "Frequency Response", value: "20Hz – 20kHz" },
      { label: "Impedance", value: "32Ω" },
      { label: "Sensitivity", value: "108 ± 3dB" },
      { label: "Connectivity", value: "Bluetooth 5.3, AUX" },
      { label: "Wireless Range", value: "Up to 10 m" },
      { label: "Microphone", value: "Built-in MEMS Mic" },
      { label: "Noise Cancellation", value: "Active Noise Cancellation (ANC)" },
      { label: "Battery Life (ANC On)", value: "Up to 30 Hours" },
      { label: "Battery Life (ANC Off)", value: "Up to 60 Hours" },
      { label: "Charging Time", value: "~2 Hours" },
      { label: "Charging Port", value: "USB Type-C" },
      { label: "Weight", value: "0.65 kg" },
      { label: "Country of Origin", value: "China" },
    ],
    []
  );

  const visibleSpecs = useMemo(() => (expanded ? specs : specs.slice(0, 12)), [expanded, specs]);

  const colA = useMemo(() => visibleSpecs.slice(0, Math.ceil(visibleSpecs.length / 2)), [visibleSpecs]);
  const colB = useMemo(() => visibleSpecs.slice(Math.ceil(visibleSpecs.length / 2)), [visibleSpecs]);

  return (
    <section className="rounded-sm border" style={{ borderColor: COLORS.border, background: COLORS.white }}>
      <div className="p-6">
        <h2 className="text-base font-bold" style={{ color: COLORS.text }}>
          Specifications
        </h2>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-sm border" style={{ borderColor: COLORS.border, background: COLORS.white }}>
            {colA.map((row, idx) => (
              <SpecRow key={row.label} label={row.label} value={row.value} isLast={idx === colA.length - 1} />
            ))}
          </div>

          <div className="rounded-sm border" style={{ borderColor: COLORS.border, background: COLORS.white }}>
            {colB.map((row, idx) => (
              <SpecRow key={row.label} label={row.label} value={row.value} isLast={idx === colB.length - 1} />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 text-xs font-semibold"
            style={{ color: COLORS.primary }}
          >
            {expanded ? "Show Less" : "View All Specifications"}
            <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </section>
  );
}
