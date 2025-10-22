// src/lib/localize.js
export function localizeField(field, lang, fallback = "en") {
  if (!field) return "";
  return field[lang] || field[fallback] || "";
}
