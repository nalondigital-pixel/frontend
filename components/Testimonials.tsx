const testimonials = [
  {
    name: "Tafadzwa M.",
    text: "HydroQuil helped us find water on our farm without drilling blindly.",
  },
  {
    name: "Grace N.",
    text: "Very professional and accurate survey results delivered fast.",
  },
  {
    name: "Engineer K.",
    text: "Excellent GIS mapping and site analysis.",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 md:px-10 py-16 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          What Clients Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 border rounded-2xl shadow-sm bg-gray-50"
            >
              <p className="text-gray-700">"{t.text}"</p>
              <p className="mt-4 font-semibold text-teal-600">
                - {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}