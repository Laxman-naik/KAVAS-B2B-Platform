"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const COLORS = {
  primary: "#0B1F3A",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

const SpecRow = ({ label, value, isLast }) => (
  <div
    className={`flex items-center justify-between gap-6 px-4 py-3 text-sm ${
      isLast ? "" : "border-b"
    }`}
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

export default function SpecificationsSection({ specifications = [] }) {
  const [expanded, setExpanded] = useState(false);

  const specs = useMemo(() => {
    if (!Array.isArray(specifications)) return [];

    return specifications
      .map((item) => ({
        label: item.label || item.name || item.key,
        value: item.value,
      }))
      .filter((item) => item.label && item.value);
  }, [specifications]);

  const visibleSpecs = expanded ? specs : specs.slice(0, 12);

  const colA = visibleSpecs.slice(0, Math.ceil(visibleSpecs.length / 2));
  const colB = visibleSpecs.slice(Math.ceil(visibleSpecs.length / 2));

  if (!specs.length) {
    return (
      <section
        className="rounded-sm border p-6"
        style={{ borderColor: COLORS.border, background: COLORS.white }}
      >
        <h2 className="text-base font-bold" style={{ color: COLORS.text }}>
          Specifications
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          No specifications available.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-sm border"
      style={{ borderColor: COLORS.border, background: COLORS.white }}
    >
      <div className="p-6">
        <h2 className="text-base font-bold" style={{ color: COLORS.text }}>
          Specifications
        </h2>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-sm border" style={{ borderColor: COLORS.border }}>
            {colA.map((row, idx) => (
              <SpecRow
                key={`${row.label}-${idx}`}
                label={row.label}
                value={row.value}
                isLast={idx === colA.length - 1}
              />
            ))}
          </div>

          <div className="rounded-sm border" style={{ borderColor: COLORS.border }}>
            {colB.map((row, idx) => (
              <SpecRow
                key={`${row.label}-${idx}`}
                label={row.label}
                value={row.value}
                isLast={idx === colB.length - 1}
              />
            ))}
          </div>
        </div>

        {specs.length > 12 && (
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 text-xs font-semibold"
              style={{ color: COLORS.primary }}
            >
              {expanded ? "Show Less" : "View All Specifications"}
              <ChevronDown
                className={`h-4 w-4 transition ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}