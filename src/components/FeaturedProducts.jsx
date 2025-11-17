import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { listProducts } from "../lib/productApi";
import { urlFor } from "../lib/image";
import { useTranslation } from "react-i18next";

// Format price in EUR with current language
function formatPriceEUR(value, lang) {
  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency: "EUR",
    }).format(value);
  } catch {
    return `€${value}`;
  }
}

// Localize helper: supports either a string OR an object { en, mk, sq }
function localize(field, lang, fallback = "en") {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return (
      field[lang] ||
      field[fallback] ||
      field.en ||
      Object.values(field).find(Boolean) ||
      ""
    );
  }
  return "";
}

/** Shared image carousel (swipe + arrows + dots) */
function ProductImageCarousel({ images, alt }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages = (images || []).filter(Boolean);
  if (!safeImages.length) return null;

  const goToIndex = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, safeImages.length - 1));
    const width = el.clientWidth;
    el.scrollTo({
      left: clamped * width,
      behavior: "smooth",
    });
    setActiveIndex(clamped);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    goToIndex((activeIndex - 1 + safeImages.length) % safeImages.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    goToIndex((activeIndex + 1) % safeImages.length);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const idx = Math.round(el.scrollLeft / width);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        onScroll={handleScroll}
      >
        {safeImages.map((img, index) => (
          <div
            key={img._key || index}
            className="snap-center shrink-0 w-full aspect-[4/3] bg-gray-50"
          >
            <img
              src={urlFor(img)}
              alt={alt || "Product image"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow p-1 text-gray-800"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow p-1 text-gray-800"
            aria-label="Next image"
          >
            ›
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(i);
                }}
                className={`h-2 w-2 rounded-full ${
                  i === activeIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Centered modal for full product details */
function ProductModal({ product, lang, onClose }) {
  const { t } = useTranslation();
  if (!product) return null;

  const name = localize(product.name, lang);
  const description = localize(product.description, lang);

  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : product.image
      ? [product.image]
      : product.imageUrl
      ? [{ asset: { _ref: product.imageUrl } }] // in case you had plain URLs
      : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ProductImageCarousel images={images} alt={name || "Product"} />

        <div className="p-5">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-semibold break-words">{name}</h3>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl leading-none"
              aria-label={t("common.close", "Close")}
            >
              ×
            </button>
          </div>

          {product.price != null && (
            <p className="mt-2 text-emerald-700 font-semibold">
              {formatPriceEUR(product.price, lang)}
            </p>
          )}

          {description && (
            <p className="mt-4 text-gray-700 whitespace-pre-line">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts({ limit = 3 }) {
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const all = await listProducts();
        setItems(all.slice(0, limit));
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-gray-600">{t("featured.loading")}</div>
      </section>
    );
  }

  if (!items.length) return null;

  const lang = i18n.language;

  return (
    <section className="px-4 py-16 bg-transparent">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {t("featured.title")}
          </h2>
          <Link
            to="/products"
            className="text-sm text-emerald-700 hover:underline"
            aria-label={t("featured.viewAll")}
          >
            {t("featured.viewAll")}
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const name = localize(p.name, lang);
            const description = localize(p.description, lang);

            const images =
              Array.isArray(p.images) && p.images.length
                ? p.images
                : p.image
                ? [p.image]
                : p.imageUrl
                ? [{ asset: { _ref: p.imageUrl } }]
                : [];

            return (
              <article
                key={p._id}
                className="rounded-2xl border border-emerald-200 bg-white/90 overflow-hidden hover:shadow-md transition flex flex-col"
              >
                <ProductImageCarousel images={images} alt={name || "Product"} />

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold break-words">{name}</h3>

                  {p.price != null && (
                    <p className="text-emerald-700 font-medium mt-1">
                      {formatPriceEUR(p.price, lang)}
                    </p>
                  )}

                  {description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2 break-words">
                      {description}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedProduct(p)}
                    className="mt-3 self-start text-sm font-medium text-emerald-700 hover:text-emerald-900"
                  >
                    {t("products.viewDetails")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        lang={lang}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
