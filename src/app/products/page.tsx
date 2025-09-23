'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  materials: string;
  dimensions?: string;
  colors: string;
  inStock: boolean;
  stockCount: number;
  estimatedDays: number;
  difficulty: string;
  featured: boolean;
  active: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: {
    products: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('sort', sortBy);

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const filteredProducts = products.filter(product => 
    product.active && 
    (selectedCategory === 'all' || product.category.slug === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-[#fff4e3]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/"
                className="inline-flex items-center text-[#d8d68d] hover:text-[#c8c67d] font-medium mb-2"
              >
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Our Crochet Collection</h1>
              <p className="text-gray-600 mt-2">Handmade with love, crafted with care</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories and Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#d8d68d] text-gray-800'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  All Products ({products.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.slug
                        ? 'bg-[#d8d68d] text-gray-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.name} ({category._count?.products || 0})
                  </button>
                ))}
              </div>

              <hr className="my-6" />

              <h4 className="font-medium mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8d68d]"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d8d68d]"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 bg-[#d8d68d] hover:bg-[#c8c67d] text-gray-800 px-4 py-2 rounded-md"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="aspect-square relative bg-gray-100">
                      {product.images.find(img => img.isPrimary) ? (
                        <Image
                          src={product.images.find(img => img.isPrimary)?.url || '/placeholder-product.jpg'}
                          alt={product.images.find(img => img.isPrimary)?.alt || product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>No Image</span>
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-2 left-2 bg-[#d8d68d] text-gray-800 px-2 py-1 rounded-md text-sm font-medium">
                          Featured
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">{product.category.name}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/products/${product.slug}`}
                          className="hover:text-[#d8d68d] transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.estimatedDays} days to ship
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                          {product.materials}
                        </span>
                        <span className="text-sm px-2 py-1 bg-gray-100 rounded-md">
                          {product.difficulty}
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className={`w-full block text-center py-2 px-4 rounded-md font-medium transition-colors ${
                          product.inStock
                            ? 'bg-[#d8d68d] hover:bg-[#c8c67d] text-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'View Details' : 'Out of Stock'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}