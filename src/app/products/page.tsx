'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  slug: string;
  // Materials and costs
  yarn: string;
  yarnGrams: number;
  yarnCost: number;
  polyfilGrams: number;
  polyfilCost: number;
  eyesUsed: string;
  eyesCost: number;
  // Production details
  hookSize: string;
  timeMinutes: number;
  // Pricing calculations
  laborWage: number;
  calculatedPrice: number;
  salePrice: number;
  profitMargin: number;
  // Status and presentation
  status: string; // in_stock, made_to_order, draft
  image?: string;
  featured: boolean;
  active: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
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

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      color: 'Default',
      image: product.images.find(img => img.isPrimary)?.url || product.image || '',
    };

    // Get existing cart items or initialize empty cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: { id: string }) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count in navigation
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message (you could use a toast library here)
    alert(`${product.name} added to cart!`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (sortBy) {
          params.append('sort', sortBy);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products || data);
        setError('');
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories || data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sortBy]);

  const retryFetch = () => {
    // Trigger re-fetch by updating state
    setError('');
    setLoading(true);
  };

  const filteredProducts = products.filter(product => 
    product.active && 
    (selectedCategory === 'all' || (product.category && product.category.slug === selectedCategory))
  );

  return (
    <div className="min-h-screen bg-custom-background">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/"
                className="inline-flex items-center text-brand-secondary hover:text-brand-secondary/80 font-medium mb-2"
              >
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-heading font-semibold text-gray-800">Our Crochet Collection</h1>
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
                        ? 'bg-brand-accent text-gray-800'
                        : 'hover:bg-custom-main text-gray-700'
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="time-short">Quick Projects</option>
                <option value="time-long">Detailed Projects</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={retryFetch}
                  className="mt-4 bg-brand-accent hover:bg-brand-accent/80 text-gray-800 px-4 py-2 rounded-md"
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
                      {product.images.find(img => img.isPrimary) || product.image ? (
                        <Image
                          src={product.images.find(img => img.isPrimary)?.url || product.image || '/placeholder-product.jpg'}
                          alt={product.images.find(img => img.isPrimary)?.alt || product.name}
                          fill
                          className="object-contain p-2"
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
                      {product.status === 'made_to_order' && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                          Made to Order
                        </div>
                      )}
                      {product.status === 'draft' && (
                        <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                          Coming Soon
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">{product.category?.name || 'Uncategorized'}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/products/${product.slug}`}
                          className="hover:text-[#d8d68d] transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Made with {product.yarn}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.salePrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.ceil(product.timeMinutes / 60)}h to make
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                          Hook: {product.hookSize}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-md ${
                          product.status === 'in_stock' 
                            ? 'bg-green-100 text-green-800' 
                            : product.status === 'made_to_order'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'in_stock' ? 'In Stock' 
                           : product.status === 'made_to_order' ? 'Made to Order'
                           : 'Draft'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 text-center py-2 px-4 rounded-md font-medium border border-brand-accent text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.status === 'draft'}
                          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                            product.status !== 'draft'
                              ? 'bg-brand-accent hover:bg-brand-accent/80 text-gray-800'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {product.status === 'in_stock' ? 'Add to Cart' : 
                           product.status === 'made_to_order' ? 'Add to Cart' : 'Coming Soon'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}