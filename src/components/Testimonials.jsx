import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation();

  // Pull the list from i18n; keep names as-is, translate quotes/heading
  const testimonials = t("testimonials.items", { returnObjects: true }) || [];

  return (
    <section className="px-4 py-16 bg-transparent">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">
          {t("testimonials.title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <blockquote
              key={i}
              className="rounded-2xl border border-blue-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition"
            >
              <p className="text-gray-800 italic">“{item.quote}”</p>
              <footer className="mt-3 text-sm text-gray-600">— {item.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
