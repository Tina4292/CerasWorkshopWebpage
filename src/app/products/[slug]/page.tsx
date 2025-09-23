'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  weight?: string;
  colors: string;
  inStock: boolean;
  stockCount: number;
  estimatedDays: number;
  difficulty: string;
  featured: boolean;
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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          throw new Error('Failed to fetch product');
        }
        return;
      }
      
      const data = await response.json();
      setProduct(data.product);
      
      // Set default color if available
      if (data.product.colors) {
        try {
          const colors = JSON.parse(data.product.colors);
          if (colors.length > 0) {
            setSelectedColor(colors[0]);
          }
        } catch {
          // If colors isn't JSON, use as single color
          setSelectedColor(data.product.colors);
        }
      }
    } catch (err) {
      setError('Failed to load product');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      image: product.images.find(img => img.isPrimary)?.url || '',
    };

    // Add to cart (we'll implement cart later)
    console.log('Adding to cart:', cartItem);
    alert('Product added to cart! (Cart functionality coming soon)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff4e3] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d8d68d]"></div>
          <p className="mt-2 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fff4e3] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Product not found'}
          </h1>
          <Link 
            href="/products"
            className="bg-[#d8d68d] hover:bg-[#c8c67d] text-gray-800 px-6 py-2 rounded-md font-medium"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const availableColors = (() => {
    try {
      return JSON.parse(product.colors);
    } catch {
      return [product.colors];
    }
  })();

  return (
    <div className="min-h-screen bg-[#fff4e3]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#d8d68d] hover:text-[#c8c67d]">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-[#d8d68d] hover:text-[#c8c67d]">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/products?category=${product.category.slug}`} className="text-[#d8d68d] hover:text-[#c8c67d]">
              {product.category.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
                  alt={product.images[selectedImage]?.alt || product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-[#d8d68d]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">{product.category.name}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.featured && (
                  <span className="bg-[#d8d68d] text-gray-800 px-2 py-1 rounded-md text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Materials:</span>
                  <p className="text-gray-600">{product.materials}</p>
                </div>
                {product.dimensions && (
                  <div>
                    <span className="font-medium text-gray-700">Dimensions:</span>
                    <p className="text-gray-600">{product.dimensions}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="font-medium text-gray-700">Weight:</span>
                    <p className="text-gray-600">{product.weight}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Difficulty:</span>
                  <p className="text-gray-600">{product.difficulty}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estimated Days:</span>
                  <p className="text-gray-600">{product.estimatedDays} days to complete</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Stock:</span>
                  <p className={`${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {availableColors.length > 1 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 rounded-md border transition-colors ${
                        selectedColor === color
                          ? 'border-[#d8d68d] bg-[#d8d68d] text-gray-800'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block font-medium text-gray-900 mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8d68d]"
                  disabled={!product.inStock}
                >
                  {Array.from({ length: Math.min(product.stockCount, 10) }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                  product.inStock
                    ? 'bg-[#d8d68d] hover:bg-[#c8c67d] text-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <div className="text-center text-sm text-gray-600">
                💝 Handmade with love by Cera • 🚚 Free shipping on orders over $50
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}