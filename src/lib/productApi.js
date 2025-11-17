import { client } from './sanityClient'


// Safer projection: keep raw image, plus direct URL fallback
const PRODUCTS_QUERY = `
*[_type == "product"] | order(_createdAt desc) {
  _id,
  _createdAt,
  name,                    // string OR {en,mk,sq}
  description,             // string OR {en,mk,sq}
  price,
  images,   
  image,                // raw image for urlFor()
  "imageUrl": image.asset->url
}
`;

// Single place to fetch products
export async function listProducts() {
  if (!client) {
    console.warn("[Sanity] Client not initialized – check env vars");
    return [];
  }
  try {
    // TEMP DEBUG — remove after it works
    const count = await client.fetch('count(*[_type=="product"])');
    console.log("[Sanity] product count:", count);

    const data = await client.fetch(PRODUCTS_QUERY, {}, { cache: "no-store" });
    console.log("[Sanity] fetched items:", data?.length, data?.map(d => d._id));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[Sanity] fetch failed:", err);
    return [];
  }
}