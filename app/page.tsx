"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ServicesCarousel from "@/components/ServicesCarousel";

// Load Leaflet map only in the browser
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});

type Position = [number, number];

export default function Home() {
  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    survey: "hydro",
  });

  // Map + quote state
  const [location, setLocation] = useState<Position | null>(null);
  const [quote, setQuote] = useState<number | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Update form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // Clear any previous validation error as the user types
    setErrorMessage("");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Determine if selected coordinates are within Harare
  // Approximate bounding box:
  // Latitude:  -18.30 to -17.50
  // Longitude: 30.80 to 31.30
  const isInHarare = (pos: Position) => {
    const [lat, lng] = pos;

    return lat >= -18.3 && lat <= -17.5 && lng >= 30.8 && lng <= 31.3;
  };

  // Quote logic
  const calculateQuote = (pos: Position): number | null => {
    if (!pos) return null;

    // Fixed price for Harare
    if (isInHarare(pos)) {
      return 80;
    }

    // Outside Harare = custom quotation required
    return null;
  };

  // Submit booking to Django API
  const handleSubmit = async () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate form fields
    if (!form.name || !form.phone || !form.email) {
      setErrorMessage(" Please complete all form fields.");

      document
        .getElementById("booking-form")
        ?.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return;
    }

    // Validate location
    if (!location) {
      setErrorMessage(" Please select a location on the map first.");

      document
        .getElementById("map-section")
        ?.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/create/`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        console.error(result);

        setErrorMessage(" Submission failed. Please try again.");

        document
          .getElementById("booking-form")
          ?.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
          setErrorMessage("");
        }, 5000);

        return;
      }

      // Show success message
      setSuccessMessage("✅ Booking submitted successfully!");

      document
        .getElementById("booking-form")
        ?.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      // Reset form
      setForm({
        name: "",
        phone: "",
        email: "",
        survey: "hydro",
      });

      // Reset location and quote
      setLocation(null);
      setQuote(null);

      console.log(result);
    } catch (error) {
      console.error(error);

      setErrorMessage("⚠️ Unable to connect to the server.");

      document
        .getElementById("booking-form")
        ?.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-teal-50 text-gray-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <img
            src="/logo.jpeg"
            alt="HydroQuil"
            className="h-20 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* CTA Button */}
          <button
            onClick={() =>
              document
                .getElementById("booking-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Book Survey
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Find Water with{" "}
          <span className="text-teal-600">Scientific Precision</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          HydroQuil uses advanced geophysical surveying and GIS mapping to
          locate reliable groundwater sources for borehole drilling.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() =>
              document
                .getElementById("booking-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-teal-500 text-white px-6 py-3 rounded-full shadow hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Get Started
          </button>

          <button
            onClick={() =>
              document
                .getElementById("map-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-teal-500 text-teal-600 px-6 py-3 rounded-full hover:bg-teal-50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            View Map
          </button>
        </div>
      </section>

      {/* SERVICES CAROUSEL */}
      <ServicesCarousel />

      {/* MAP SECTION */}
      <section id="map-section" className="px-6 md:px-10 py-10">
        <h2 className="text-2xl font-bold mb-4">
          Select Your Site Location
        </h2>

        <div className="bg-white rounded-2xl shadow p-4">
          <MapPicker
            onSelect={(pos: Position) => {
              setLocation(pos);
              setErrorMessage("");

              const newQuote = calculateQuote(pos);
              setQuote(newQuote);
            }}
          />
        </div>
      </section>

      {/* QUOTE SECTION */}
      {location && (
        <section className="px-6 md:px-10 pb-10">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
            <h3 className="font-semibold text-teal-700 text-lg">
              Estimated Quote
            </h3>

            {quote === 80 ? (
              <p className="text-3xl font-bold text-teal-600 mt-2">$80</p>
            ) : (
              <p className="text-lg font-semibold text-orange-600 mt-2">
                Request a quotation for this location
              </p>
            )}

            <p className="text-sm text-gray-500 mt-2">
              Pricing is fixed for Harare, Zimbabwe. Outside Harare requires a
              custom quotation.
            </p>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 px-6 md:px-10 py-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold text-teal-600">GIS Mapping</h3>
          <p className="text-sm text-gray-600 mt-2">
            Click and select the exact borehole site location.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold text-teal-600">Scientific Survey</h3>
          <p className="text-sm text-gray-600 mt-2">
            Geophysical methods used to detect groundwater potential.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold text-teal-600">Instant Quote</h3>
          <p className="text-sm text-gray-600 mt-2">
            Harare bookings are automatically priced at $80.
          </p>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="booking-form" className="px-6 md:px-10 py-10">
        <h2 className="text-2xl font-bold mb-4">Quick Booking</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="max-w-xl mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="max-w-xl mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl shadow animate-bounce">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow grid gap-4 max-w-xl">
          <input
            name="name"
            placeholder="Full Name"
            className="border p-3 rounded"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="border p-3 rounded"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="border p-3 rounded"
            value={form.email}
            onChange={handleChange}
          />

          <select
            name="survey"
            className="border p-3 rounded"
            value={form.survey}
            onChange={handleChange}
          >
            <option value="hydro">Hydro Survey</option>
            <option value="gpr">GPR Survey</option>
            <option value="eri">ERI Survey</option>
          </select>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-teal-500 text-white py-3 rounded hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Booking Request"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} HydroQuil. All rights reserved.
      </footer>
    </main>
  );
}