"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How accurate are your surveys?",
    a: "We use geophysical methods and GIS mapping to increase groundwater detection accuracy significantly before drilling.",
  },
  {
    q: "How long does a survey take?",
    a: "Most site surveys are completed within a single day depending on location size.",
  },
  {
    q: "When do I receive results?",
    a: "Reports are typically delivered within 24–48 hours after the survey.",
  },
  {
    q: "Do you operate outside Harare?",
    a: "Yes, we cover all regions in Zimbabwe with custom pricing.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-6 md:px-10 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">FAQ</h2>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="border rounded-2xl p-4 cursor-pointer shadow-sm"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <h3 className="font-semibold text-lg">{item.q}</h3>

              {open === i && (
                <p className="mt-2 text-gray-600">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}