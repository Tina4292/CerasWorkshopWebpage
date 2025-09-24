'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  colors?: string; // JSON string of available colors
  createdAt: string;
  updatedAt: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [availableColors, setAvailableColors] = useState<string[]>(['Default']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product');
          }
          return;
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Parse colors if available
        if (data.colors) {
          try {
            const colors = JSON.parse(data.colors);
            setAvailableColors(Array.isArray(colors) ? colors : [colors]);
            setSelectedColor(Array.isArray(colors) ? colors[0] : colors);
          } catch (err) {
            console.error('Error parsing colors:', err);
            setAvailableColors(['Default']);
            setSelectedColor('Default');
          }
        } else {
          setAvailableColors(['Default']);
          setSelectedColor('Default');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.salePrice,
      quantity,
      color: selectedColor || 'Default',
      image: product.images.find(img => img.isPrimary)?.url || product.image || '',
    };

    // Get existing cart items or initialize empty cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: { id: string; color: string }) => item.id === product.id && item.color === cartItem.color);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count in navigation
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message and redirect to checkout
    alert(`${product.name} added to cart!`);
    window.location.href = '/checkout';
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

  return (
    <div className="min-h-screen bg-custom-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-brand-secondary hover:text-brand-secondary/80">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-brand-secondary hover:text-brand-secondary/80">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            {product.category && (
              <>
                <Link href={`/products?category=${product.category.slug}`} className="text-brand-secondary hover:text-brand-secondary/80">
                  {product.category.name}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
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
                  className="w-full h-full object-contain p-4"
                />
              ) : product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-4"
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
              <div className="text-sm text-gray-500 mb-2">{product.category?.name || 'Uncategorized'}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.salePrice.toFixed(2)}
                </span>
                {product.featured && (
                  <span className="bg-[#d8d68d] text-gray-800 px-2 py-1 rounded-md text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed">
                Handcrafted with love using {product.yarn}. This beautiful piece takes approximately {Math.ceil(product.timeMinutes / 60)} hours to create and is perfect for any crochet enthusiast.
              </p>
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Yarn:</span>
                  <p className="text-gray-600">{product.yarn} ({product.yarnGrams}g)</p>
                </div>
                {product.polyfilGrams > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Stuffing:</span>
                    <p className="text-gray-600">{product.polyfilGrams}g polyfil</p>
                  </div>
                )}
                {product.eyesUsed !== 'None' && (
                  <div>
                    <span className="font-medium text-gray-700">Eyes:</span>
                    <p className="text-gray-600">{product.eyesUsed}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <p className={`${
                    product.status === 'in_stock' ? 'text-green-600' : 
                    product.status === 'made_to_order' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {product.status === 'in_stock' ? 'Ready to Ship' : 
                     product.status === 'made_to_order' ? 'Made to Order' : 'Coming Soon'}
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-4">Cost Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Material Costs:</span>
                  <p className="text-gray-600">${(product.yarnCost + product.polyfilCost + product.eyesCost).toFixed(2)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Labor Cost:</span>
                  <p className="text-gray-600">${product.laborWage.toFixed(2)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total Cost:</span>
                  <p className="text-gray-600">${product.calculatedPrice.toFixed(2)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Profit Margin:</span>
                  <p className="text-green-600">{product.profitMargin.toFixed(1)}%</p>
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
              {product.status !== 'draft' && (
                <div>
                  <label htmlFor="quantity" className="block font-medium text-gray-900 mb-2">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8d68d]"
                    disabled={product.status === 'draft'}
                  >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.status === 'draft'}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                  product.status !== 'draft'
                    ? 'bg-[#d8d68d] hover:bg-[#c8c67d] text-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.status === 'in_stock' ? 'Add to Cart' : 
                 product.status === 'made_to_order' ? 'Order Custom' : 'Coming Soon'}
              </button>

              {product.status === 'made_to_order' && (
                <div className="text-center text-sm text-blue-600">
                  🕐 This item is made to order • Please allow {Math.ceil(product.timeMinutes / 60 / 8)} business days
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                💝 Handmade with love by Cera • 🚚 Free shipping on orders over $50
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}