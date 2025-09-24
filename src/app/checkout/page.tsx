'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SquarePaymentForm from '../../components/SquarePaymentForm';

interface PaymentResult {
  success: boolean;
  payment?: object;
  paymentId?: string;
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
    console.log('Payment successful:', result);
    setPaymentResult(result);
    setError('');
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('Payment error:', errorMessage);
    setError(errorMessage);
    setPaymentResult(null);
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
                  <span>Payment ID:</span>
                  <span className="font-mono text-sm">{paymentResult.paymentId}</span>
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
              {cartItems.map((item: CartItem, index: number) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    {item.color && item.color !== 'Default' && (
                      <p className="text-gray-600">Color: {item.color}</p>
                    )}
                  </div>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
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
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                <p className="font-medium">Payment Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <SquarePaymentForm
              amount={total}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}