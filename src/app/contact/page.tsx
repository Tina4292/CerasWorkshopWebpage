"use client";

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-custom-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-gray-800 mb-6">
              Get In Touch
            </h1>
            <p className="text-xl font-body font-light text-gray-700 max-w-2xl mx-auto">
              Have questions about my work or want to discuss a custom project? I&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-6">Send Me a Message</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-green-600">✓</span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Thanks for reaching out! I&apos;ll get back to you within 24-48 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-brand-secondary hover:underline font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent font-body"
                      placeholder="Enter your full name"
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
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent font-body"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent font-body"
                    >
                      <option value="">Select a subject</option>
                      <option value="custom-order">Custom Order Inquiry</option>
                      <option value="existing-product">Question About Existing Product</option>
                      <option value="shipping">Shipping & Returns</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="general">General Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent font-body resize-vertical"
                      placeholder="Tell me about your project or question..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-secondary text-white py-3 px-6 rounded-lg font-body font-medium hover:bg-brand-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-brand-secondary">📧</span>
                    </div>
                    <div>
                      <p className="font-body text-gray-600 text-sm">Email</p>
                      <p className="font-body text-gray-800">hello@cerasworkshop.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-brand-accent">⏰</span>
                    </div>
                    <div>
                      <p className="font-body text-gray-600 text-sm">Response Time</p>
                      <p className="font-body text-gray-800">24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">Business Hours</h3>
                <div className="space-y-2 font-body text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 font-body">
                  *Times may vary due to college schedule and family commitments
                </p>
              </div>

              {/* FAQ */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">Common Questions</h3>
                <div className="space-y-3 font-body text-sm">
                  <div>
                    <p className="font-medium text-gray-800">How long do custom orders take?</p>
                    <p className="text-gray-600">Typically 2-4 weeks depending on complexity</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Can I request specific colors?</p>
                    <p className="text-gray-600">Absolutely! I love creating custom color combinations</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Do you ship internationally?</p>
                    <p className="text-gray-600">Currently shipping within the US only</p>
                  </div>
                </div>
                <Link 
                  href="/custom-orders" 
                  className="inline-block mt-4 text-brand-secondary hover:underline font-medium"
                >
                  Start a custom order →
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