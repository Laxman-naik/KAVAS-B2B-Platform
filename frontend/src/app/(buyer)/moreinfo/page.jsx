
"use client";

import Link from "next/link";

const MoreInfoPage = () => {

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
        <h2 className="text-center text-sm font-extrabold tracking-wide text-gray-800">
          {title}
        </h2>

        <div className="mt-5 space-y-5">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                {index !== steps.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg">
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
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-2xl text-gray-700"
            aria-label="Close"
          >
            ×
          </Link>

          <div className="text-center flex-1">
            <h1 className="text-lg font-extrabold text-gray-900">
              Easy Exchange & Return
            </h1>
            <p className="text-xs tracking-widest text-gray-500 mt-1">
              HOW IT WORKS?
            </p>
          </div>

          <div className="w-10 h-10" />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-6">
        <StepList title="EASY EXCHANGES" steps={exchanges} />
        <StepList title="EASY RETURNS" steps={returns} />

        <div className="mt-8 border-t pt-4">
          <p className="text-sm font-semibold text-gray-800">Note:</p>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            The product should not be damaged and the price tags should be intact.
            T&C applicable.
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="block w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoPage;
