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
    <main className="min-h-screen bg-gradient-to-b from-white to-teal-50 text-gray-800">

      {/* NAVBAR (clean) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <img src="/logo.jpeg" className="h-16" />

          <button
            onClick={() =>
              document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-teal-500 text-white px-6 py-3 rounded-full"
          >
            Book Survey
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-24 bg-white">
        <h1 className="text-5xl font-bold">
          Find Water with <span className="text-teal-600">Precision</span>
        </h1>
        <p className="mt-4 text-gray-600">
          HydroQuil helps locate groundwater using science + mapping.
        </p>
      </section>

      {/* SERVICES */}
      <ServicesCarousel />

      {/* MAP */}
      <section id="map-section" className="py-16 px-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Select Location</h2>

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
        <section className="px-6 pb-10">
          <div className="max-w-4xl mx-auto bg-teal-50 p-6 rounded-2xl">
            <h3 className="font-bold text-teal-700">Estimated Quote</h3>
            <p className="text-2xl font-bold mt-2">
              {quote === 80 ? "$80" : "Custom Quote Required"}
            </p>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div>GIS Mapping</div>
          <div>Scientific Survey</div>
          <div>Instant Quote</div>
        </div>
      </section>

      {/* TESTIMONIALS (MOVE HERE) */}
      <Testimonials />

      {/* FAQ (MOVE HERE) */}
      <FAQ />

      {/* CONTACT (MOVE HERE) */}
      <ContactSection />

      {/* BOOKING */}
      <section id="booking-form" className="py-16 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Book Now</h2>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <input className="border p-3 w-full mb-3" name="name" placeholder="Name" onChange={handleChange} />
          <input className="border p-3 w-full mb-3" name="phone" placeholder="Phone" onChange={handleChange} />
          <input className="border p-3 w-full mb-3" name="email" placeholder="Email" onChange={handleChange} />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-teal-500 text-white px-6 py-3 rounded w-full"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </section>

      {/* FLOATING WHATSAPP */}
      <WhatsAppButton />

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500">
        © {new Date().getFullYear()} HydroQuil
      </footer>
    </main>
  );
}