import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts } from "../lib/productApi";
import { urlFor } from "../lib/image";
import { useTranslation } from "react-i18next";

// Localize helper: supports either a string OR an object { en, mk, sq }
function localize(field, lang, fallback = "en") {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field[lang] || field[fallback] || field.en || Object.values(field).find(Boolean) || "";
  }
  return "";
}

export default function FeaturedProducts({ limit = 3 }) {
  const [items, setItems] = useState([]);
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

  return (
    <section className="px-4 py-16 bg-transparent">
      <div className="mx-auto max-w-6xl text-center">
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
            const name = localize(p.name, i18n.language);
            const description = localize(p.description, i18n.language);
            const imgSrc = (p.image && urlFor(p.image)) || p.imageUrl || undefined;

            return (
              <article
                key={p._id}
                className="rounded-2xl border border-emerald-200 bg-white/90 overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-[4/3] bg-gray-50">
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={name || "Product"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold break-words">{name}</h3>
                  {p.price != null && (
                    <p className="text-emerald-700 font-medium mt-1">€{p.price}</p>
                  )}
                  {description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2 break-words">
                      {description}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
