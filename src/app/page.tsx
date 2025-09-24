"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";

// Product type definition
interface Product {
  id: string;
  name: string;
  slug: string;
  salePrice: number;
  image?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: {
    id: string;
    createdAt: Date;
    order: number;
    isPrimary: boolean;
    url: string;
    alt: string;
    productId: string;
  }[];
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [halloweenItems, setHalloweenItems] = useState<Product[]>([]);

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      color: 'Default',
      image: product.images?.find(img => img.isPrimary)?.url || product.image || '',
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
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 8) {
          header.classList.add('shadow-sm');
        } else {
          header.classList.remove('shadow-sm');
        }
      }
    };

    // Load products
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const allProducts: Product[] = data.products || data;
        
        // Helper function to check if product is Halloween-themed
        const isHalloweenProduct = (product: Product) => 
          product.name.toLowerCase().includes('sam halloween') ||
          product.name.toLowerCase().includes('spood') ||
          product.name.toLowerCase().includes('snake') ||
          product.name.toLowerCase().includes('bandana');
        
        // Filter for Halloween items (priority)
                const halloween = allProducts.filter(isHalloweenProduct);
        setHalloweenItems(halloween);
        
        // Get other products with images 
        const otherItemsWithImages = allProducts.filter((product: Product) => 
          product.image && !isHalloweenProduct(product)
        );
        
        // Combine with Halloween priority, limit to 6
        const featured = [...halloween, ...otherItemsWithImages].slice(0, 6);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-custom-background">
      {/* Header */}
      <header className="sticky top-0 bg-custom-main backdrop-blur-sm border-b border-brand-accent transition-shadow duration-300 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
          {/* Brand Container */}
          <Link href="/" aria-label="Cera's Workshop home" className="flex items-center gap-4">
            <div className="relative h-[5em] w-[5em] flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Cera's Workshop logo"
                width={100}
                height={100}
                className="h-full w-full object-contain align-middle"
                priority
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-cursive text-gray-800">
              Cera&apos;s Workshop
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Shop</Link>
            <Link href="/custom-orders" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Custom Orders</Link>
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">About</a>
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Contact</a>
            <Link href="/checkout" className="bg-brand-secondary hover:bg-brand-secondary/90 font-body font-medium text-white px-4 py-2 rounded-lg transition-colors">🛒 Cart</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-semibold text-gray-800 mb-6">
            Beautiful Handmade
            <span className="block text-brand-secondary">Crochet Creations</span>
          </h2>
          <p className="text-xl font-body font-light text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover unique, lovingly crafted crochet items made with care.
            From cozy blankets to adorable amigurumi, each piece tells a story.
          </p>
          {halloweenItems.length > 0 && (
            <p className="text-lg text-orange-600 font-semibold mb-6">
               Halloween Specials Available! 
            </p>
          )}
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/products" className="bg-brand-secondary text-white px-8 py-3 rounded-full font-body font-medium hover:bg-brand-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl">
              Shop Now
            </Link>
            <Link href="/custom-orders" className="bg-white text-brand-secondary px-8 py-3 rounded-full font-body font-medium border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300">
              Custom Orders
            </Link>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2 text-center">Amigurumi</h3>
            <p className="font-body font-light text-gray-600 text-center">Adorable handmade plushies and stuffed animals</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-brand-main rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2 text-center">Wearables</h3>
            <p className="font-body font-light text-gray-600 text-center">Bandanas, scarves, hats, and cozy accessories</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2 text-center">Accessories</h3>
            <p className="font-body font-light text-gray-600 text-center">Purses, kindle sleeves, bookmarks, and keychains</p>
          </div>
        </div>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-heading font-semibold text-gray-800 mb-4">Featured Products</h3>
              <p className="text-lg font-body font-light text-gray-700">
                 Halloween favorites and popular items with real photos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product: Product) => (
                <div 
                  key={product.id} 
                  className="group"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="relative aspect-square bg-gradient-to-br from-brand-accent/20 to-brand-main/20">
                      {product.image ? (
                        <Image 
                          src={product.image} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-brand-secondary/50 mb-2 text-4xl">🧶</div>
                            <p className="text-brand-secondary/50 text-sm">Photo Coming Soon</p>
                          </div>
                        </div>
                      )}
                      
                      {(product.name.toLowerCase().includes('halloween') || 
                        product.name.toLowerCase().includes('sam halloween') || 
                        product.name.toLowerCase().includes('spood')) && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          🎃 Halloween
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h4 className="font-heading font-semibold text-xl mb-2 group-hover:text-brand-secondary transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-brand-secondary">
                          ${product.salePrice.toFixed(2)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✅ Available
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 text-center py-2 px-4 rounded-md font-medium border border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-2 px-4 rounded-md font-medium bg-brand-secondary text-white hover:bg-brand-secondary/90 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/products" 
                className="inline-block bg-brand-secondary text-white px-8 py-3 rounded-full font-body font-medium hover:bg-brand-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Products 
              </Link>
            </div>
          </div>
        )}

        {/* Store Status */}
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-heading font-semibold text-gray-800 mb-4">Online Store Now Open!</h3>
          <p className="font-body font-light text-gray-700 mb-6 leading-relaxed">
            Browse our beautiful handmade items and purchase directly online.
            We&apos;re continuously adding new products and features.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
              Product Catalog
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
              Secure Checkout
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-main rounded-full"></div>
              Custom Orders
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-brand-accent/20 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-body font-light text-gray-600"> 2024 Cera&apos;s Workshop. Made with  and lots of yarn.</p>
        </div>
      </footer>
    </div>
  );
}
