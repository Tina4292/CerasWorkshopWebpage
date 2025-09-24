'use client';

import { useState } from 'react';

interface PaymentResult {
  success: boolean;
  orderId?: string;
  transactionId?: string;
}

interface MockPaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentResult: PaymentResult) => void;
  onPaymentError: (error: string) => void;
}

export default function MockPaymentForm({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError 
}: MockPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    zipCode: '',
  });

  const handleInputChange = (field: string, value: string, type: 'customer' | 'payment') => {
    if (type === 'customer') {
      setCustomerInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email) {
      onPaymentError('Please fill in all required customer information');
      return;
    }

    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      onPaymentError('Please fill in all payment information');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      // Generate mock transaction details
      const mockResult: PaymentResult = {
        success: true,
        orderId: `ORDER-${Date.now()}`,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      setIsProcessing(false);
      onPaymentSuccess(mockResult);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
              ℹ
            </div>
            <h3 className="font-semibold text-blue-800">Demo Payment Form</h3>
          </div>
          <p className="text-blue-700 text-sm">
            This is a mock payment form for testing. No real payment will be processed. 
            Square payment integration can be added later.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Complete Your Order</h2>
        <p className="text-gray-600 mb-4">
          Total Amount: <span className="font-bold text-2xl text-purple-600">${amount.toFixed(2)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'customer')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value, 'customer')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value, 'customer')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={paymentInfo.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value), 'payment')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Use any test card number (e.g., 4111 1111 1111 1111)</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value), 'payment')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''), 'payment')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={paymentInfo.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value, 'payment')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-md text-white font-semibold text-lg transition-all duration-200 ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Complete Order - $${amount.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
}