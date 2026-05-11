"use client";

import Link from "next/link";

export default function MoreInfoSection({ onClose, showHeader = false }) {
  const exchanges = [
    {
      title: "Go to Menu > My Orders > Exchange",
      description: "Select the time slot for exchange",
      icon: "🧾",
    },
    {
      title: "Delivery agent will deliver the new product",
      description: "And pick up the old one",
      icon: "🚚",
    },
    {
      title: "No additional payment needed",
      description: "Exchange completed at your doorstep",
      icon: "✅",
    },
  ];

  const returns = [
    {
      title: "Go to Menu > My Orders > Return",
      description: "Select the time slot and mode for return",
      icon: "🧾",
    },
    {
      title: "Delivery agent will pick up the product",
      description: "Please keep product and packaging ready",
      icon: "📦",
    },
    {
      title: "Refund will be processed in 7–14 days",
      description: "After the quality check",
      icon: "₹",
    },
  ];

  const StepList = ({ title, steps }) => {
    return (
      <div className="mt-6">
        <h2 className="text-center text-sm font-extrabold tracking-wide text-gray-800">{title}</h2>

        <div className="mt-5 space-y-5">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {index + 1}
                </div>
                {index !== steps.length - 1 && <div className="mt-2 w-px flex-1 bg-gray-200" />}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold leading-snug text-gray-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-lg">
                    {step.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-white">
      {showHeader ? (
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-700 hover:bg-gray-100"
              aria-label="Close"
            >
              ×
            </Link>

            <div className="flex-1 text-center">
              <h1 className="text-lg font-extrabold text-gray-900">Easy Exchange & Return</h1>
              <p className="mt-1 text-xs tracking-widest text-gray-500">HOW IT WORKS?</p>
            </div>

            <div className="h-10 w-10" />
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-xl px-5 py-6">
        <StepList title="EASY EXCHANGES" steps={exchanges} />
        <StepList title="EASY RETURNS" steps={returns} />

        <div className="mt-8 border-t pt-4">
          <p className="text-sm font-semibold text-gray-800">Note:</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            The product should not be damaged and the price tags should be intact. T&C applicable.
          </p>
        </div>

        {typeof onClose === "function" ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="block w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <Link
              href="/"
              className="block w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
