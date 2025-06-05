import { getPayloadClient } from './client'

export const seedUsers = async () => {
  const payload = await getPayloadClient()

  console.log('👤 Creating admin user...')

  // Create the admin user
  await payload.create({
    collection: 'users',
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
    },
  })

  console.log('✅ Admin user created: admin@example.com')
  console.log('🌱 Database seeded successfully')
}
