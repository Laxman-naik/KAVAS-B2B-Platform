"use client";

export default function ProductDetailsSection({ product }) {
  const description =
    product?.description || "No product description available.";

  const highlights = Array.isArray(product?.highlights)
    ? product.highlights
    : [];

  return (
    <section className="w-full rounded-sm border border-[#E5E5E5] bg-white p-6">
      <h2 className="text-[22px] font-bold text-[#0B1F3A]">
        Product Details
      </h2>

      <p className="mt-4 text-sm leading-7 text-[#4B5563]">
        {description}
      </p>

      {highlights.length > 0 && (
        <ul className="mt-5 list-disc space-y-3 pl-5 text-sm text-[#374151]">
          {highlights.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}