"use client";

import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

export default function CustomOrdersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    description: '',
    timeline: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          description: '',
          timeline: '',
          budget: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
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
              <Link href="/custom-orders" className="nav-button font-body font-medium text-brand-secondary px-3 py-2 rounded-lg">Custom Orders</Link>
              <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">About</a>
              <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Contact</a>
            </nav>
          </div>
        </header>

        {/* Success Message */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="text-6xl mb-6">✨</div>
              <h2 className="text-3xl font-heading font-semibold text-gray-800 mb-4">
                Thank You!
              </h2>
              <p className="text-lg font-body text-gray-700 mb-8">
                Your custom order request has been submitted successfully. I&apos;ll review your details and get back to you within 24-48 hours to discuss your project.
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/products" 
                  className="bg-brand-secondary text-white px-6 py-3 rounded-full font-body font-medium hover:bg-brand-secondary/90 transition-all duration-300"
                >
                  Browse Products
                </Link>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-white text-brand-secondary px-6 py-3 rounded-full font-body font-medium border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <Link href="/custom-orders" className="nav-button font-body font-medium text-brand-secondary px-3 py-2 rounded-lg">Custom Orders</Link>
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">About</a>
            <a href="#" className="nav-button font-body font-medium text-gray-800 px-3 py-2 rounded-lg">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-semibold text-gray-800 mb-6">
            Custom Orders
            <span className="block text-brand-secondary">Made Just for You</span>
          </h2>
          <p className="text-xl font-body font-light text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Have a special project in mind? I&apos;d love to create something unique just for you! 
            From personalized amigurumi to custom wearables, let&apos;s bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-heading font-semibold text-gray-800 mb-6">
              Tell Me About Your Project
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">Select a project type</option>
                  <option value="amigurumi">Custom Amigurumi/Plushie</option>
                  <option value="wearables">Wearables (Hats, Scarves, etc.)</option>
                  <option value="accessories">Accessories (Bags, Keychains, etc.)</option>
                  <option value="home-decor">Home Decor</option>
                  <option value="other">Other (Please describe)</option>
                </select>
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all resize-vertical"
                  placeholder="Please describe your custom project in detail. Include colors, size, any special features, inspiration images, etc."
                />
              </div>

              {/* Timeline and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">No rush</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="under-50">Under $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-200">$100 - $200</option>
                    <option value="200+">$200+</option>
                    <option value="discuss">Let&apos;s discuss</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-secondary text-white py-4 rounded-lg font-body font-semibold hover:bg-brand-secondary/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Request...' : 'Send Custom Order Request'}
              </button>
            </form>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-8">
            {/* Process Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <p className="font-body text-gray-700">Submit your project details using the form</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <p className="font-body text-gray-700">I&apos;ll review and contact you within 24-48 hours</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <p className="font-body text-gray-700">We&apos;ll discuss details, pricing, and timeline</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <p className="font-body text-gray-700">I&apos;ll create your one-of-a-kind piece!</p>
                </div>
              </div>
            </div>

            {/* Popular Custom Orders */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">Popular Custom Projects</h3>
              <ul className="space-y-2 font-body text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-brand-secondary">🧸</span>
                  Pet portraits as amigurumi
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-secondary">🎭</span>
                  Character-themed items
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-secondary">👶</span>
                  Baby/nursery items
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-secondary">🎁</span>
                  Personalized gifts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-secondary">🏠</span>
                  Home decor pieces
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">Questions?</h3>
              <p className="font-body text-gray-700 mb-4">
                Feel free to reach out if you have any questions about custom orders or want to discuss your project before submitting the form.
              </p>
              <p className="font-body text-sm text-gray-600">
                Response time: 24-48 hours<br />
                Custom order minimum: $25
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}