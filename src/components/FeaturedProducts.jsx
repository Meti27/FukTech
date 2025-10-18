import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts } from "../lib/productApi";
import { urlFor } from "../lib/image";
import { useTranslation } from "react-i18next";

export default function FeaturedProducts({ limit = 3 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const all = await listProducts();
        setItems((all || []).slice(0, limit));
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

  return (
    <section className="px-4 py-16 bg-transparent">
      <div className="mx-auto max-w-6xl">
        {/* Header: stacks on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
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
          {items.map((p) => (
            <article
              key={p._id}
              className="rounded-2xl border border-emerald-200 bg-white/90 overflow-hidden hover:shadow-md transition"
            >
              <div className="aspect-[4/3] bg-gray-50">
                {p.image && (
                  <img
                    src={urlFor(p.image)}
                    alt={p.name || "Product"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold break-words">{p.name}</h3>
                {p.price != null && (
                  <p className="text-emerald-700 font-medium mt-1">€{p.price}</p>
                )}
                {p.description && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2 break-words">
                    {p.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
