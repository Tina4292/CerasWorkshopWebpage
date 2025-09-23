'use client';

import { useState } from 'react';
import Link from 'next/link';
import SquarePaymentForm from '../../components/SquarePaymentForm';

interface PaymentResult {
  success: boolean;
  payment?: object;
  paymentId?: string;
}

export default function CheckoutPage() {
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string>('');

  // Sample order data
  const sampleOrder = {
    items: [
      {
        name: 'Handmade Crochet Scarf',
        price: 35.00,
        quantity: 1,
      },
      {
        name: 'Crochet Baby Blanket',
        price: 45.00,
        quantity: 1,
      }
    ],
    shipping: 8.99,
    tax: 7.19,
  };

  const subtotal = sampleOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + sampleOrder.shipping + sampleOrder.tax;

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
      <div className="min-h-screen bg-[#fff4e3] py-12">
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
                  className="inline-block bg-[#d8d68d] hover:bg-[#c8c67d] text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff4e3] py-8">
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
              {sampleOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
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
                <span>${sampleOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${sampleOrder.tax.toFixed(2)}</span>
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
  );
}