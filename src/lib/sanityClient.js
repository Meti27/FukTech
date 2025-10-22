// src/sanitlyClient.js
import { createClient } from "@sanity/client";

const projectId  = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset    = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01";

// While debugging new products, keep useCdn:false for fresh reads.
// You can flip to true later for speed.
export const client = projectId && dataset
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "published",
      stega: false,
    })
  : null;

// TEMP: quick visibility that envs are loaded (remove later)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("[SANITY ENV]", { projectId, dataset, apiVersion });
}
