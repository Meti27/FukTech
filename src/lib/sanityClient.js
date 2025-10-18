import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: '2025-01-01',
  useCdn: true, // public, cached reads
})
