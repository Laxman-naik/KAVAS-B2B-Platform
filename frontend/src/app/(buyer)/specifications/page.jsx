"use client";

import SpecificationsSection from "@/components/buyer/SpecificationsSection";

const COLORS = {
  cream: "#FFF8EC",
  text: "#1A1A1A",
};

export default function SpecificationsPage() {
  return (
    <div className="min-h-screen" style={{ background: COLORS.cream, color: COLORS.text }}>
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <SpecificationsSection />
      </div>
    </div>
  );
}
