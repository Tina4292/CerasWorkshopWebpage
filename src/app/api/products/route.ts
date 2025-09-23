import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'featured';
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Build where clause
    const where: {
      active: boolean;
      category?: { slug: string };
      featured?: boolean;
      OR?: Array<{ [key: string]: { contains: string; mode: string } }>;
    } = {
      active: true,
    };

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { materials: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    let orderBy: 
      | { name: 'asc' }
      | { price: 'asc' | 'desc' }
      | { createdAt: 'desc' }
      | Array<{ featured: 'desc' } | { createdAt: 'desc' }> = { createdAt: 'desc' };
    switch (sort) {
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
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
    });

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}