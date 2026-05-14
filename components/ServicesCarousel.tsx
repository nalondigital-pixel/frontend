"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image: "/Services/survey1.jpg",
    title: "Hydrogeological Surveys",
    description:
      "Detailed scientific assessments to identify the most promising groundwater zones.",
  },
  {
    image: "/Services/gis.jpg",
    title: "GIS Groundwater Mapping",
    description:
      "Accurate site mapping with GPS coordinates and geospatial analysis.",
  },
  {
    image: "/Services/drilling.jpg",
    title: "Borehole Drilling",
    description:
      "Professional drilling services for reliable and sustainable water access.",
  },
  {
    image: "/Services/water.jpg",
    title: "Clean Water Solutions",
    description:
      "Delivering dependable water infrastructure for homes, farms, and communities.",
  },
];

export default function ServicesCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="px-6 md:px-10 pb-16">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
        {/* Image */}
        <div className="relative h-[500px] bg-gray-100">
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">
              {slides[current].title}
            </h3>
            <p className="text-base md:text-lg max-w-2xl text-white/90">
              {slides[current].description}
            </p>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg transition"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg transition"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 right-6 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                current === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}