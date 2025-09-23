"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-custom-background">
      {/* Header */}
      <header className="sticky top-0 bg-custom-main backdrop-blur-sm border-b border-brand-accent transition-shadow duration-300 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
          {/* Brand Container */}
          <a href="#" aria-label="Cera's Workshop home" className="flex items-center gap-4">
            <div className="relative h-[5em] w-[5em] flex items-center justify-center">
              <Image
                src="/Logo.png"
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
          </a>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Shop</a>
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Custom Orders</a>
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">About</a>
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Contact</a>
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
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <a 
              href="/checkout" 
              className="bg-brand-secondary text-white px-8 py-3 rounded-full font-body font-medium hover:bg-brand-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
            >
              Shop Now (Demo Checkout)
            </a>
            <button className="bg-white text-brand-secondary px-8 py-3 rounded-full font-body font-medium border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300">
              Custom Orders
            </button>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">�</span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2 text-center">Amigurumi</h3>
            <p className="font-body font-light text-gray-600 text-center">Adorable handmade plushies and stuffed animals</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-brand-main rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">�</span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2 text-center">Wearables</h3>
            <p className="font-body font-light text-gray-600 text-center">Bandanas, scarves, hats, and cozy accessories</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">👜</span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2 text-center">Accessories</h3>
            <p className="font-body font-light text-gray-600 text-center">Purses, kindle sleeves, bookmarks, and keychains</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-heading font-semibold text-gray-800 mb-4">Store Coming Soon!</h3>
          <p className="font-body font-light text-gray-700 mb-6 leading-relaxed">
            We&apos;re putting the finishing touches on our online store. 
            Soon you&apos;ll be able to browse and purchase our beautiful handmade items directly online.
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
          <p className="font-body font-light text-gray-600">© 2022 Cera&apos;s Workshop. Made with ❤️ and lots of yarn.</p>
        </div>
      </footer>
    </div>
  );
}
