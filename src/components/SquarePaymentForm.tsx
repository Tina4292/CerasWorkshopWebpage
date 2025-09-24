'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SquarePayments, SquareCard, TokenResult } from '../types/square';

// Global state to prevent multiple Square SDK initializations across all component instances
let globalSquareInitialized = false;
let globalLocationId: string | null = null;
let globalCard: SquareCard | null = null;
let globalPayments: SquarePayments | null = null;
let globalInitializationPromise: Promise<void> | null = null;

interface PaymentResult {
  success: boolean;
  payment?: object;
  paymentId?: string;
}

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentResult: PaymentResult) => void;
  onPaymentError: (error: string) => void;
}

export default function SquarePaymentForm({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentFormProps) {
  // Add global error handler for DOM-related errors that Square SDK might cause
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('removeChild') || event.message.includes('not a child')) {
        console.warn('Caught DOM manipulation error (likely from Square SDK):', event.message);
        event.preventDefault(); // Prevent the error from breaking the app
        return true;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [card, setCard] = useState<SquareCard | null>(globalCard);
  const [payments, setPayments] = useState<SquarePayments | null>(globalPayments);
  const [locationId, setLocationId] = useState<string>(globalLocationId || '');
  const cardRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(globalSquareInitialized);
  const isInitializingRef = useRef(false);
  const mountedRef = useRef(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const fetchLocationId = useCallback(async () => {
    if (globalLocationId) {
      setLocationId(globalLocationId);
      return;
    }
    
    try {
      const response = await fetch('/api/locations');
      const result = await response.json();
      
      if (result.success && result.location.id) {
        globalLocationId = result.location.id;
        setLocationId(result.location.id);
      } else {
        throw new Error('Failed to get location ID');
      }
    } catch (error) {
      console.error('Failed to fetch location ID:', error);
      throw error;
    }
  }, []);

  const initializeSquare = useCallback(async () => {
    try {
      // If we already have a global card instance, reuse it
      if (globalCard && globalSquareInitialized) {
        setCard(globalCard);
        setPayments(globalPayments);
        return;
      }

      // If there's already an initialization in progress, wait for it
      if (globalInitializationPromise) {
        await globalInitializationPromise;
        if (globalCard) {
          setCard(globalCard);
          setPayments(globalPayments);
          return;
        }
      }

      // Create new initialization promise
      globalInitializationPromise = (async () => {
        if (!window.Square) {
          throw new Error('Square SDK not loaded');
        }

        const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
        if (!applicationId) {
          throw new Error('Square Application ID not configured');
        }

        // Wait for the container to exist in the DOM
        const waitForContainer = () => {
          return new Promise<HTMLElement>((resolve, reject) => {
            const maxAttempts = 20;
            let attempts = 0;
            
            const checkContainer = () => {
              const container = document.getElementById('card-container');
              if (container) {
                resolve(container);
              } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkContainer, 100);
              } else {
                reject(new Error('Card container not found after waiting'));
              }
            };
            
            checkContainer();
          });
        };

        const newPayments = window.Square.payments(applicationId);
        globalPayments = newPayments;

        // Wait for container and clear it before attaching
        const container = await waitForContainer();
        
        // Ensure container is completely clean and detached from any Square instances
        container.innerHTML = '';
        container.className = ''; // Clear any Square-added classes
        
        // Add a small delay to ensure any pending DOM operations complete
        await new Promise(resolve => setTimeout(resolve, 50));

        const newCard = await newPayments.card();
        await newCard.attach('#card-container');
        
        globalCard = newCard;
        globalSquareInitialized = true;
      })();

      await globalInitializationPromise;
      
      // Set local state
      setCard(globalCard);
      setPayments(globalPayments);
      
    } catch (error) {
      console.error('Square initialization error:', error);
      globalInitializationPromise = null; // Reset on error
      onPaymentError('Failed to initialize payment form');
    }
  }, [onPaymentError]);

  // Load Square Web SDK
  useEffect(() => {
    mountedRef.current = true;
    
    if (globalSquareInitialized && globalCard) {
      setCard(globalCard);
      setPayments(globalPayments);
      setLocationId(globalLocationId || '');
      initializedRef.current = true;
      return;
    }
    
    if (initializedRef.current || isInitializingRef.current) {
      return;
    }
    
    const loadSquareSDK = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.Square) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Square SDK'));
        document.head.appendChild(script);
      });
    };

    const initialize = async () => {
      if (isInitializingRef.current || !mountedRef.current) {
        return;
      }
      
      isInitializingRef.current = true;
      try {
        await loadSquareSDK();
        if (!mountedRef.current) return; // Check if still mounted
        
        await fetchLocationId();
        if (!mountedRef.current) return; // Check if still mounted
        
        // Small delay to ensure DOM is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!mountedRef.current) return; // Check if still mounted
        
        await initializeSquare();
        if (mountedRef.current) {
          initializedRef.current = true;
        }
      } catch (error) {
        if (mountedRef.current) {
          console.error('Failed to load Square SDK:', error);
          onPaymentError('Failed to load payment system');
        }
      } finally {
        isInitializingRef.current = false;
      }
    };

    // Use a small timeout to ensure component is fully mounted
    const timeoutId = setTimeout(initialize, 50);

    // Cleanup function
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      // Don't destroy global card on unmount, other instances might need it
      initializedRef.current = false;
      isInitializingRef.current = false;
    };
  }, [fetchLocationId, initializeSquare, onPaymentError]);

  const handlePayment = async () => {
    const currentCard = card || globalCard;
    const currentPayments = payments || globalPayments;
    
    if (!currentCard || !currentPayments) {
      onPaymentError('Payment form not ready');
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      onPaymentError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Tokenize the card
      const result: TokenResult = await currentCard.tokenize();
      
      if (result.status !== 'OK' || !result.token) {
        const errorMessage = result.errors?.map(e => e.message).join(', ') || 'Card tokenization failed';
        onPaymentError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Process payment
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: result.token,
          amount: amount,
          currency: 'USD',
          locationId: locationId,
          customer: customerInfo,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success) {
        onPaymentSuccess(paymentResult);
      } else {
        onPaymentError(paymentResult.details || paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Payment Details
      </h3>
      
      {/* Customer Information */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8d68d]"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8d68d]"
            placeholder="john@example.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8d68d]"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Card Details */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information *
        </label>
        <div 
          id="card-container" 
          ref={cardRef}
          className="border border-gray-300 rounded-md p-3 min-h-[50px] bg-white"
          style={{ minHeight: '56px' }}
        >
          {!card && (
            <div className="flex items-center justify-center h-14 text-gray-400">
              Loading payment form...
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total Amount:</span>
          <span className="text-xl font-bold text-gray-900">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading || !card}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          isLoading || !card
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#d8d68d] hover:bg-[#c8c67d] text-gray-800'
        }`}
      >
        {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        🔒 Your payment information is secured by Square
      </p>
    </div>
  );
}