import { useEffect, useState, useRef } from "react";
import { listProducts } from "../lib/productApi";
import { urlFor } from "../lib/image";
import { useTranslation } from "react-i18next";

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

/** Image carousel (same for card + modal) */
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

/** Small card in the grid */
function ProductCard({ p, lang, onViewDetails }) {
   const { t } = useTranslation();
  const name = localize(p.name, lang);
  const description = localize(p.description, lang);

  const images =
    Array.isArray(p.images) && p.images.length
      ? p.images
      : p.image
      ? [p.image]
      : [];

  return (
    <div className="bg-white border rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <ProductImageCarousel images={images} alt={name || "Product"} />

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg break-words">{name}</h3>

        {p.price != null && (
          <p className="mt-1 text-blue-700 font-medium">
            {formatPriceEUR(p.price, lang)}
          </p>
        )}

        {description && (
          <p className="mt-2 text-gray-700 text-sm line-clamp-2 break-words">
            {description}
          </p>
        )}

         <button
        type="button"
        onClick={() => onViewDetails(p)}
        className="mt-3 self-start text-sm font-medium text-blue-700 hover:text-blue-900"
      >
        {t("products.viewDetails")}
      </button>
      </div>
    </div>
  );
}

/** Centered popup with full description */
function ProductModal({ product, lang, onClose }) {
  if (!product) return null;

  const name = localize(product.name, lang);
  const description = localize(product.description, lang);

  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : product.image
      ? [product.image]
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
        {/* Header image / carousel */}
        <ProductImageCarousel images={images} alt={name || "Product"} />

        <div className="p-5">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-semibold break-words">{name}</h3>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {product.price != null && (
            <p className="mt-2 text-blue-700 font-semibold">
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

export default function Products() {
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const data = await listProducts();
        setItems(data);
      } catch (e) {
        setError(t("products.error"));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang = i18n.language;

  if (loading) {
    return (
      <section
        className="mx-auto max-w-6xl px-4 py-8 text-gray-600"
        aria-live="polite"
        aria-busy="true"
      >
        {t("products.loading")}
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="mx-auto max-w-6xl px-4 py-8 text-red-600"
        aria-live="polite"
      >
        {error}
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 text-gray-700">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          {t("products.title")}
        </h2>
        <p>{t("products.empty")}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-semibold">
        {t("products.title")}
      </h2>

      <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard
            key={p._id}
            p={p}
            lang={lang}
            onViewDetails={setSelectedProduct}
          />
        ))}
      </div>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        lang={lang}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
