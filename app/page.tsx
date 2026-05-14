"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ServicesCarousel from "@/components/ServicesCarousel";

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

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
      setErrorMessage(" Please complete all form fields.");
      document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (!location) {
      setErrorMessage(" Please select a location on the map first.");
      document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setErrorMessage(""), 5000);
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

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(" Submission failed. Please try again.");
        document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      setSuccessMessage(" Booking submitted successfully!");

      setForm({ name: "", phone: "", email: "", survey: "hydro" });
      setLocation(null);
      setQuote(null);

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage(" Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-teal-50 text-gray-800">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <img src="/logo.jpeg" className="h-20 w-auto object-contain" />

          <button
            onClick={() =>
              document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-teal-500 text-white px-6 py-3 rounded-full shadow hover:bg-teal-600 transition"
          >
            Book Survey
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-28 bg-white">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Find Water with <span className="text-teal-600">Scientific Precision</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          HydroQuil uses advanced geophysical surveying and GIS mapping to locate reliable groundwater sources.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() =>
              document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-teal-500 text-white px-6 py-3 rounded-full shadow hover:bg-teal-600 transition"
          >
            Get Started
          </button>

          <button
            onClick={() =>
              document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-teal-500 text-teal-600 px-6 py-3 rounded-full hover:bg-teal-50 transition"
          >
            View Map
          </button>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ServicesCarousel />
        </div>
      </section>

      {/* MAP */}
      <section id="map-section" className="py-16 bg-gray-50 px-6 md:px-10">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Select Your Site Location</h2>

          <MapPicker
            onSelect={(pos: Position) => {
              setLocation(pos);
              setErrorMessage("");
              setQuote(calculateQuote(pos));
            }}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-6">
          {[
            ["GIS Mapping", "Click and select the exact borehole site location."],
            ["Scientific Survey", "Geophysical methods used to detect groundwater."],
            ["Instant Quote", "Harare bookings automatically priced at $80."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-gray-50 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-teal-600">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking-form" className="py-20 bg-white px-6 md:px-10">
        <div className="max-w-xl mx-auto">

          <h2 className="text-2xl font-bold mb-4">Quick Booking</h2>

          {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
          {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}

          <div className="bg-white p-6 rounded-2xl shadow grid gap-4">

            <input name="name" placeholder="Full Name" className="border p-3 rounded"
              value={form.name} onChange={handleChange} />

            <input name="phone" placeholder="Phone Number" className="border p-3 rounded"
              value={form.phone} onChange={handleChange} />

            <input name="email" type="email" placeholder="Email"
              className="border p-3 rounded"
              value={form.email} onChange={handleChange} />

            <select name="survey" className="border p-3 rounded"
              value={form.survey} onChange={handleChange}>
              <option value="hydro">Hydro Survey</option>
              <option value="gpr">GPR Survey</option>
              <option value="eri">ERI Survey</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-teal-500 text-white py-3 rounded hover:bg-teal-600 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Booking"}
            </button>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} HydroQuil
      </footer>

    </main>
  );
}