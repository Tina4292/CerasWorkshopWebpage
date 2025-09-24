import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to get all products
export async function getAllProducts() {
  return await prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' }
    ],
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: [
          { isPrimary: 'desc' },
          { order: 'asc' },
        ],
      },
    },
  })
}