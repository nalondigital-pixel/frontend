export default function ContactSection() {
  return (
    <section className="px-6 md:px-10 py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>

        <p className="text-gray-600 mb-6">
          Reach out for bookings, quotes, or technical inquiries.
        </p>

        <div className="space-y-3 text-gray-700">
          <p>
             Email:{" "}
            <a className="text-teal-600" href="mailto:info@hydroquil.com">
              hydroquil@gmail.com
            </a>
          </p>

          <p> Harare, Zimbabwe</p>

          <p>
             Phone / WhatsApp:{" "}
            <a
              className="text-teal-600"
              href="https://wa.me/263771 936 3033"
              target="_blank"
            >
              +263 771 936 3033
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}