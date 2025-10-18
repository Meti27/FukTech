import { WrenchScrewdriverIcon, BoltIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const ICONS = [WrenchScrewdriverIcon, BoltIcon, MapPinIcon];

export default function Features({ className = "" }) {
  const { t } = useTranslation();

  // Pull translated items; guard against non-array values
  const items = t("features.items", { returnObjects: true });
  const list = Array.isArray(items) ? items : [];

  if (!list.length) {
    // No features configured in i18n; render nothing rather than error
    return null;
  }

  return (
    <ul className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {list.map((f, i) => {
        const Icon = ICONS[i % ICONS.length];
        const title = f?.name ?? "";
        const desc = f?.desc ?? "";
        return (
          <li
            key={title ? `${title}-${i}` : `feature-${i}`}
            className={`border rounded-2xl p-6 bg-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow outline-none focus-within:ring-2 focus-within:ring-blue-200 reveal ${i ? `reveal-delay-${i}` : ""}`}
          >
            <Icon className="h-10 w-10 text-blue-600 mb-3" aria-hidden="true" />
            <h4 className="font-semibold text-lg break-words">{title}</h4>
            {desc && (
              <p className="mt-2 text-gray-700 text-sm leading-relaxed break-words">
                {desc}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
