import { getPayloadClient } from './client'

const categoryData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Technology and electronic devices',
  },
  {
    name: 'Home',
    slug: 'home',
    description: 'Home and kitchen items',
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Apparel and accessories',
  },
]

export async function seedCategories() {
  const payload = await getPayloadClient()

  console.log('🏷️  Creating categories...')

  const createdCategories = []

  for (const category of categoryData) {
    const created = await payload.create({
      collection: 'categories',
      data: category,
    })
    createdCategories.push(created)
  }

  console.log(`✅ Created ${categoryData.length} categories`)

  // Return the created categories so products can reference them
  return createdCategories
}
