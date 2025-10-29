import { SITE } from "../config/site";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();

  return (
    // Prevent ANY horizontal scroll on this page
    <div className="overflow-x-clip">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          {t("contact.hero.title")}
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          {t("contact.hero.subtitle")}
        </p>
      </section>

      {/* CONTACT FORM */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          {t("contact.form.title")}
        </h2>
        <form
          className="grid gap-6 bg-white shadow rounded-2xl p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            alert(t("contact.form.todoAlert"));
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                {t("contact.form.name")}
              </label>
              <input
                id="name"
                type="text"
                required
                aria-label={t("contact.form.name")}
                placeholder={t("contact.form.namePlaceholder")}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                {t("contact.form.email")}
              </label>
              <input
                id="email"
                type="email"
                required
                aria-label={t("contact.form.email")}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoComplete="email"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                {t("contact.form.phoneOptional")}
              </label>
              <input
                id="phone"
                type="tel"
                aria-label={t("contact.form.phoneOptional")}
                placeholder="+389 ..."
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="message">
              {t("contact.form.message")}
            </label>
            <textarea
              id="message"
              rows={4}
              required
              aria-label={t("contact.form.message")}
              placeholder={t("contact.form.messagePlaceholder")}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition"
          >
            {t("contact.form.submit")}
          </button>
        </form>
      </section>

      {/* CTA QUICK CONTACT */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-emerald-50 p-6 sm:p-8">
          <h3 className="text-xl font-semibold">{t("contact.quick.title")}</h3>
          <p className="text-gray-700 mt-2">{t("contact.quick.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a
              href={SITE.whatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {t("contact.quick.whatsapp")}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 border border-gray-300 text-gray-800 hover:bg-white transition"
            >
              <Trans i18nKey="contact.quick.call" values={{ phone: SITE.phone }}>
                Call {{ phone: SITE.phone }}
              </Trans>
            </a>
          </div>
        </div>
      </section>

      {/* MAP (no horizontal overflow) */}
      <section className="w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        <iframe
          title={t("contact.map.title")}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5948.365120752463!2d20.92178704847719!3d41.802827510373945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1351573c14e473d7%3A0x67c48c023196bd7a!2sElite%20Restaurant!5e0!3m2!1sen!2smk!4v1761758205604!5m2!1sen!2smk"
          width="100%"
          height="100%"
          className="block max-w-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* SOCIAL LINKS */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("contact.social.title")}
          </h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-gray-600 hover:text-blue-600 text-2xl transition"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://instagram.com/yourpage"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-gray-600 hover:text-pink-500 text-2xl transition"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href={SITE.whatsAppLink()}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="text-gray-600 hover:text-green-600 text-2xl transition"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
