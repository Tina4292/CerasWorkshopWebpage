"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem('cart');
        if (cart) {
          const cartArray = JSON.parse(cart);
          const count = cartArray.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error reading cart:', error);
        setCartCount(0);
      }
    };

    // Update cart count on load
    updateCartCount();

    // Listen for cart changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for same-page cart updates
    window.addEventListener('cartUpdated', updateCartCount);

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

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <>
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Shop</Link>
            <Link href="/custom-orders" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Custom Orders</Link>
            <Link href="/about" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">About</Link>
            <Link href="/contact" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Contact</Link>
            <Link href="/checkout" className="bg-brand-secondary hover:bg-brand-secondary/90 font-body font-medium text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              🛒 Cart 
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 hover:text-gray-900 hover:border-gray-600"
          >
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-custom-main border-t border-brand-accent">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              <Link href="/products" className="font-body font-medium text-gray-800 px-3 py-2 rounded-lg hover:bg-brand-accent/20" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link href="/custom-orders" className="font-body font-medium text-gray-800 px-3 py-2 rounded-lg hover:bg-brand-accent/20" onClick={() => setIsMobileMenuOpen(false)}>Custom Orders</Link>
              <Link href="/about" className="font-body font-medium text-gray-800 px-3 py-2 rounded-lg hover:bg-brand-accent/20" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" className="font-body font-medium text-gray-800 px-3 py-2 rounded-lg hover:bg-brand-accent/20" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <Link href="/checkout" className="bg-brand-secondary hover:bg-brand-secondary/90 font-body font-medium text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit" onClick={() => setIsMobileMenuOpen(false)}>
                🛒 Cart 
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}