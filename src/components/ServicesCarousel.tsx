"use client";

const services = [
  {
    title: "Hydro Survey",
    image: "/hydro-survey.jpg",
    description: "Advanced groundwater detection using geophysical methods.",
  },
  {
    title: "GPR Survey",
    image: "/gpr-survey.jpg",
    description: "Ground Penetrating Radar for subsurface analysis.",
  },
  {
    title: "ERI Survey",
    image: "/eri-survey.jpg",
    description: "Electrical Resistivity Imaging for accurate mapping.",
  },
];

export default function ServicesCarousel() {
  return (
    <section className="px-6 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Services</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-white rounded-2xl shadow overflow-hidden"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <h3 className="font-bold text-teal-600 text-lg">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}