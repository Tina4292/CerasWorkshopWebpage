'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MockPaymentForm from '../../components/MockPaymentForm';

interface PaymentResult {
  success: boolean;
  orderId?: string;
  transactionId?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  image?: string;
}

export default function CheckoutPage() {
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart data from localStorage
    const loadCartData = () => {
      try {
        // Try new cart format first
        const cart = localStorage.getItem('cart');
        if (cart) {
          const cartArray = JSON.parse(cart);
          setCartItems(cartArray);
        } else {
          // Fall back to old single item format
          const cartItem = localStorage.getItem('cartItem');
          if (cartItem) {
            const item = JSON.parse(cartItem);
            setCartItems([item]);
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
        setCartItems([]);
      }
    };

    loadCartData();
  }, []);

  const shipping = 8.99;
  const tax = 7.19;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shipping + tax;

  const handlePaymentSuccess = (result: PaymentResult) => {
    setPaymentResult(result);
    setError('');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setPaymentResult(null);
  };

  const updateCartInStorage = (updatedCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Dispatch event to update navigation cart count
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cart: updatedCart }
    }));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    );
    updateCartInStorage(updatedCart);
  };

  const removeItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    updateCartInStorage(updatedCart);
  };

  if (paymentResult) {
    return (
      <div className="min-h-screen bg-custom-background">
        <Navigation />
        <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600">Thank you for your purchase from Cera&apos;s Workshop</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-sm">{paymentResult.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-sm">{paymentResult.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-semibold">Paid</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                You will receive an email confirmation shortly with your order details and tracking information.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/"
                  className="inline-block bg-brand-accent hover:bg-brand-accent/80 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-background">
      <Navigation />
      <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#d8d68d] hover:text-[#c8c67d] font-medium"
          >
            ← Back to Shop
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link 
                    href="/products"
                    className="inline-block bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item: CartItem, index: number) => (
                  <div key={index} className="pb-4 border-b">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        {item.color && item.color !== 'Default' && (
                          <p className="text-gray-600 text-sm">Color: {item.color}</p>
                        )}
                        <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 border-l border-r border-gray-300 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {cartItems.length > 0 ? (
            <div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                  <p className="font-medium">Payment Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <MockPaymentForm
                amount={total}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to your cart to continue with checkout.</p>
                <Link 
                  href="/products"
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}