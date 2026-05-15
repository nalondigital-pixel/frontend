"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ServicesCarousel from "@/components/ServicesCarousel";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});

type Position = [number, number];

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    survey: "hydro",
  });

  const [location, setLocation] = useState<Position | null>(null);
  const [quote, setQuote] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrorMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isInHarare = (pos: Position) => {
    const [lat, lng] = pos;
    return lat >= -18.3 && lat <= -17.5 && lng >= 30.8 && lng <= 31.3;
  };

  const calculateQuote = (pos: Position): number | null => {
    if (!pos) return null;
    return isInHarare(pos) ? 80 : null;
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.name || !form.phone || !form.email) {
      setErrorMessage("Please complete all form fields.");
      return;
    }

    if (!location) {
      setErrorMessage("Please select a location first.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            survey: form.survey,
            latitude: location[0],
            longitude: location[1],
            estimated_quote: quote ?? 0,
          }),
        }
      );

      if (!response.ok) {
        setErrorMessage("Submission failed.");
        return;
      }

      setSuccessMessage("Booking successful!");
      setForm({ name: "", phone: "", email: "", survey: "hydro" });
      setLocation(null);
      setQuote(null);
    } catch {
      setErrorMessage("Server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* SUBTLE STRIPE BACKGROUND GLOW */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-200/30 blur-3xl rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-200/20 blur-3xl rounded-full" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">

          <img src="/logo.jpeg" className="h-14 w-auto" />

          <button
            onClick={() =>
              document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition"
          >
            Book Survey
          </button>

        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 pt-28 pb-20">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight max-w-4xl mx-auto">
          Find Water with <span className="text-teal-600">Precision</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          HydroQuil uses advanced geophysical surveying and GIS mapping to locate reliable groundwater sources.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-gray-900 text-white px-6 py-3 rounded-full hover:scale-105 transition">
            Get Started
          </button>

          <button className="border border-gray-300 px-6 py-3 rounded-full hover:border-gray-400 transition">
            View Map
          </button>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <ServicesCarousel />
      </section>

      {/* MAP */}
      <section id="map-section" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="border border-gray-100 rounded-3xl p-6 bg-white/70 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4">Select Location</h2>

          <MapPicker
            onSelect={(pos: Position) => {
              setLocation(pos);
              setQuote(calculateQuote(pos));
            }}
          />
        </div>
      </section>

      {/* QUOTE */}
      {location && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="border border-gray-100 rounded-2xl p-6">
            <h3 className="font-semibold">Estimated Quote</h3>
            <p className="text-3xl font-semibold mt-2">
              {quote === 80 ? "$80" : "Custom Quote Required"}
            </p>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            ["GIS Mapping", "Precise site selection using geospatial data"],
            ["Scientific Survey", "Advanced groundwater detection methods"],
            ["Instant Quote", "Transparent pricing in Harare"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CONTACT */}
      <ContactSection />

      {/* BOOKING */}
      <section id="booking-form" className="max-w-xl mx-auto px-6 py-24">
        <h2 className="text-xl font-semibold mb-6">Book Now</h2>

        {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mb-3">{successMessage}</p>}

        <div className="space-y-3">

          <input className="w-full border border-gray-200 rounded-xl p-3"
            name="name" placeholder="Name" onChange={handleChange} />

          <input className="w-full border border-gray-200 rounded-xl p-3"
            name="phone" placeholder="Phone" onChange={handleChange} />

          <input className="w-full border border-gray-200 rounded-xl p-3"
            name="email" placeholder="Email" onChange={handleChange} />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            {submitting ? "Submitting..." : "Submit Booking"}
          </button>

        </div>
      </section>

      {/* WHATSAPP */}
      <WhatsAppButton />

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} HydroQuil
      </footer>

    </main>
  );
}