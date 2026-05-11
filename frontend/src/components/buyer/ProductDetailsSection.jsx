"use client";

export default function ProductDetailsSection() {
  return (
    <section className="w-full rounded-sm border border-[#E5E5E5] bg-white p-6">
      <h2 className="text-[22px] font-bold text-[#0B1F3A]">Product Details</h2>

      <p className="mt-4 text-sm leading-7 text-[#4B5563]">
        SoundX Pro 1000 delivers an immersive audio experience with advanced Active Noise Cancellation, deep bass, and crystal clear sound.
      </p>

      <ul className="mt-5 list-disc space-y-3 pl-5 text-sm text-[#374151]">
        <li>40mm dynamic drivers for powerful sound</li>
        <li>Active Noise Cancellation blocks background noise</li>
        <li>Up to 60 hours battery life (ANC off)</li>
        <li>Bluetooth 5.3 for stable and fast connectivity</li>
        <li>Built-in MEMS microphone for clear calls</li>
        <li>Foldable design with soft cushioned earcups for all-day comfort</li>
      </ul>
    </section>
  );
}
