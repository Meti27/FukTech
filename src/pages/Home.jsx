import { Link } from "react-router-dom";
import { SITE } from "../config/site";
import Carousel from "../components/Carousel";
import useReveal from "../hooks/useReveal";
import Features from "../components/Features";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import Testimonials from "../components/Testimonials.jsx";
import { useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";

import background1 from "../assets/images/background1.png";
import background2 from "../assets/images/background2.png";

export default function Home() {
  useReveal();
  const { t, i18n } = useTranslation();

  const slides = useMemo(
    () => [
      { src: background1, title: t("slides.0.title"), text: t("slides.0.text") },
      { src: background2, title: t("slides.1.title"), text: t("slides.1.text") },
    ],
    [i18n.language, t]
  );

  return (
    <div>
      {/* FULLSCREEN CAROUSEL under navbar */}
      <section className="w-full">
        <Carousel slides={slides} interval={5000} full />
      </section>

      {/* INTRO / FEATURES (centered) */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16 text-center">
        <div className="reveal max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight [text-wrap:balance]">
            <Trans
              i18nKey="intro.welcome"
              values={{ brand: SITE.brandName }}
              components={{
                highlight: (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600" />
                )
              }}
            />
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-700">
            <Trans i18nKey="intro.desc" components={{ strong: <strong /> }} />
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="min-w-[140px] inline-flex items-center justify-center rounded-lg px-5 py-3 text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              {t("intro.browse")}
            </Link>
            <Link
              to="/contact"
              className="min-w-[140px] inline-flex items-center justify-center rounded-lg px-5 py-3 border border-gray-300 text-gray-800 hover:bg-gray-50 transition"
            >
              {t("intro.contact")}
            </Link>
          </div>
        </div>

        {/* Features centered under intro */}
        <div className="mt-12">
          <Features />
        </div>
      </section>

      <div className="h-12 md:h-16 bg-gradient-to-b from-white to-[#f0fff4]" />

      {/* Gradient section with Featured + Testimonials + CTA */}
      <div className="bg-gradient-to-br from-emerald-50/80 to-blue-50/80">
        <FeaturedProducts limit={3} />
        <Testimonials />

        {/* CTA STRIP (sits on top of gradient) */}
        <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
          <div className="reveal rounded-2xl border p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/90">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                {t("cta.title")}
              </h3>
              <p className="text-gray-700 mt-1">{t("cta.text")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={SITE.whatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="min-w-[120px] inline-flex items-center justify-center rounded-lg px-5 py-3 text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                {t("cta.whatsapp")}
              </a>
              <a
                href={`tel:${SITE.phone}`}
                className="min-w-[120px] inline-flex items-center justify-center rounded-lg px-5 py-3 border border-gray-300 text-gray-800 hover:bg-white transition"
              >
                {t("cta.call", { phone: SITE.phone })}
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="h-12 md:h-16 bg-gradient-to-b from-emerald-50 to-white" />
    </div>
  );
}
