import { useEffect, useState, useMemo } from "react";
import { listProducts } from "../lib/productApi";
import { urlFor } from "../lib/image";
import { useTranslation } from "react-i18next";

function formatPriceEUR(value, lang) {
  try {
    return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(value);
  } catch {
    // Fallback
    return `€${value}`;
  }
}

function ProductCard({ p, lang }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="aspect-[4/3] bg-gray-50">
        {p.image && (
          <img
            src={urlFor(p.image)}
            alt={p.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg break-words">{p.name}</h3>
        {p.price != null && (
          <p className="mt-1 text-blue-700 font-medium">
            {formatPriceEUR(p.price, lang)}
          </p>
        )}
        {p.description && (
          <p className="mt-2 text-gray-700 text-sm line-clamp-2 break-words">
            {p.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Products() {
  const [items, setItems] = useState([]);
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
  }, []); // load once; error text uses current lang when set

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
          <ProductCard key={p._id} p={p} lang={i18n.language} />
        ))}
      </div>
    </section>
  );
}
