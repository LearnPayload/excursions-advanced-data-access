import { getPayloadClient } from './client'

const productData = [
  {
    name: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'Powerful laptop for professional work',
    price: 2499,
    categoryName: 'Electronics',
    inventory: 25,
  },
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'Latest iPhone with advanced camera system',
    price: 999,
    categoryName: 'Electronics',
    inventory: 50,
  },
  {
    name: 'AirPods Pro',
    slug: 'airpods-pro',
    description: 'Wireless earbuds with noise cancellation',
    price: 249,
    categoryName: 'Electronics',
    inventory: 100,
  },
  {
    name: 'Coffee Mug',
    slug: 'coffee-mug',
    description: 'Ceramic coffee mug for your morning brew',
    price: 15,
    categoryName: 'Home',
    inventory: 200,
  },
  {
    name: 'Desk Lamp',
    slug: 'desk-lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 89,
    categoryName: 'Home',
    inventory: 75,
  },
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Comfortable running shoes for daily exercise',
    price: 129,
    categoryName: 'Clothing',
    inventory: 60,
  },
  {
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: 'Soft cotton t-shirt in various colors',
    price: 25,
    categoryName: 'Clothing',
    inventory: 150,
  },
  {
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable speaker with excellent sound quality',
    price: 79,
    categoryName: 'Electronics',
    inventory: 40,
  },
]

export async function seedProducts() {
  const payload = await getPayloadClient()

  console.log('📦 Creating products...')

  const categories = (await payload.find({ collection: 'categories' })).docs

  for (const product of productData) {
    const { categoryName, ...productWithoutCategoryName } = product

    await payload.create({
      collection: 'products',
      data: {
        ...productWithoutCategoryName,
        category: categories.find((c) => c.name === categoryName)!.id,
      },
    })
  }

  console.log(`✅ Created ${productData.length} products`)
}
