import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'blankets' },
      update: {},
      create: {
        name: 'Blankets & Throws',
        description: 'Cozy, warm blankets and throws for any home',
        slug: 'blankets',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'amigurumi' },
      update: {},
      create: {
        name: 'Amigurumi',
        description: 'Adorable stuffed animals and characters',
        slug: 'amigurumi',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        description: 'Scarves, hats, and seasonal accessories',
        slug: 'accessories',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-decor' },
      update: {},
      create: {
        name: 'Home Decor',
        description: 'Beautiful decorative items for your home',
        slug: 'home-decor',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'baby-items' },
      update: {},
      create: {
        name: 'Baby Items',
        description: 'Soft, safe items perfect for babies and toddlers',
        slug: 'baby-items',
      },
    }),
  ])

  // Create sample products
  const blanketCategory = categories.find(c => c.slug === 'blankets')!
  const amigurumiCategory = categories.find(c => c.slug === 'amigurumi')!
  const accessoryCategory = categories.find(c => c.slug === 'accessories')!
  const babyCategory = categories.find(c => c.slug === 'baby-items')!

  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'cozy-baby-blanket' },
      update: {},
      create: {
        name: 'Cozy Baby Blanket',
        slug: 'cozy-baby-blanket',
        description: 'Soft, hypoallergenic baby blanket perfect for nurseries. Made with 100% cotton yarn for sensitive skin.',
        price: 45.00,
        materials: '100% cotton yarn',
        dimensions: '30x36 inches',
        colors: JSON.stringify(['Pink', 'Blue', 'Yellow', 'White', 'Mint Green']),
        stockCount: 5,
        estimatedDays: 14,
        difficulty: 'Intermediate',
        categoryId: babyCategory.id,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'chunky-throw-blanket' },
      update: {},
      create: {
        name: 'Chunky Throw Blanket',
        slug: 'chunky-throw-blanket',
        description: 'Luxuriously thick and warm throw blanket. Perfect for snuggling on the couch or adding texture to your home decor.',
        price: 85.00,
        materials: 'Chunky wool blend yarn',
        dimensions: '50x60 inches',
        colors: JSON.stringify(['Cream', 'Gray', 'Rust', 'Navy', 'Burgundy']),
        stockCount: 3,
        estimatedDays: 21,
        difficulty: 'Advanced',
        categoryId: blanketCategory.id,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'teddy-bear-amigurumi' },
      update: {},
      create: {
        name: 'Classic Teddy Bear',
        slug: 'teddy-bear-amigurumi',
        description: 'Adorable handmade teddy bear, perfect as a gift or companion. Safety eyes and hypoallergenic stuffing.',
        price: 35.00,
        materials: 'Acrylic yarn, safety eyes, polyfill stuffing',
        dimensions: '12 inches tall',
        colors: JSON.stringify(['Brown', 'Honey', 'White', 'Black']),
        stockCount: 8,
        estimatedDays: 10,
        difficulty: 'Intermediate',
        categoryId: amigurumiCategory.id,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'winter-scarf' },
      update: {},
      create: {
        name: 'Cozy Winter Scarf',
        slug: 'winter-scarf',
        description: 'Warm and stylish winter scarf with beautiful texture pattern. Perfect accessory for cold weather.',
        price: 28.00,
        materials: 'Soft acrylic yarn',
        dimensions: '6x60 inches',
        colors: JSON.stringify(['Charcoal', 'Burgundy', 'Forest Green', 'Camel', 'Navy']),
        stockCount: 12,
        estimatedDays: 7,
        difficulty: 'Beginner',
        categoryId: accessoryCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'beanie-hat' },
      update: {},
      create: {
        name: 'Chunky Knit Beanie',
        slug: 'beanie-hat',
        description: 'Warm, comfortable beanie hat with modern chunky knit design. One size fits most adults.',
        price: 22.00,
        materials: 'Wool blend yarn',
        dimensions: 'One size fits most',
        colors: JSON.stringify(['Black', 'Gray', 'Cream', 'Pink', 'Blue']),
        stockCount: 15,
        estimatedDays: 5,
        difficulty: 'Beginner',
        categoryId: accessoryCategory.id,
      },
    }),
  ])

  // Create settings
  await Promise.all([
    prisma.setting.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: "Cera's Workshop",
      },
    }),
    prisma.setting.upsert({
      where: { key: 'default_shipping_rate' },
      update: {},
      create: {
        key: 'default_shipping_rate',
        value: '8.99',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'tax_rate' },
      update: {},
      create: {
        key: 'tax_rate',
        value: '0.0875', // 8.75%
      },
    }),
    prisma.setting.upsert({
      where: { key: 'free_shipping_minimum' },
      update: {},
      create: {
        key: 'free_shipping_minimum',
        value: '75.00',
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`📦 Created ${categories.length} categories`)
  console.log(`🧶 Created ${products.length} products`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })