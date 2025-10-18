import { sanity } from './sanityClient'

export async function listProducts() {
  const query = `*[_type == "product" && isActive == true]{
    _id, name, description, image, price
  } | order(_createdAt desc)`
  return sanity.fetch(query)
}
