"use client";

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-custom-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-gray-800 mb-6">
              Meet Cera
            </h1>
            <p className="text-xl font-body font-light text-gray-700 max-w-2xl mx-auto">
              The maker, packer, and joyful yarn gremlin behind Cera&apos;s Workshop
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="max-w-none font-body">
              <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4">My Journey with Yarn</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Hi! I&apos;m Cera—the maker, packer, and joyful yarn gremlin behind Cera&apos;s Workshop. My mom taught me to crochet when I was seven, and the rhythm of yarn over hook has been a comforting thread in my life ever since.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    In 2022 I learned how to make amigurumi, and everything clicked: tiny shapes, expressive faces, and the pure delight of turning a skein into a squishy friend.
                  </p>
                </div>
                <div className="bg-brand-main/10 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-brand-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">🧶</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      &ldquo;The rhythm of yarn over hook has been a comforting thread in my life&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4">Quality & Comfort First</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I keep my focus on quality and comfort. I source yarn from brands with consistent quality so every piece feels soft and huggable. I avoid wool and other fibers that may cause allergic reactions, choosing acrylic and fluffy polyester yarns for their cuddly texture and easier care.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  That way, your plush not only looks adorable—it feels wonderful in your hands, too.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-brand-accent/10 rounded-xl p-6">
                  <h3 className="text-xl font-heading font-semibold text-gray-800 mb-3">Small Business, Big Heart</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cera&apos;s Workshop is a small business with a big heart. The income helps my family say &ldquo;yes&rdquo; to little memories—an occasional outing with my kids—while I&apos;m in college working toward my CIS degree.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Every purchase supports a real person and a real family, and I&apos;m endlessly grateful for it.
                  </p>
                </div>
                <div className="bg-brand-secondary/10 rounded-xl p-6">
                  <h3 className="text-xl font-heading font-semibold text-gray-800 mb-3">Thoughtful Design</h3>
                  <p className="text-gray-700 leading-relaxed">
                    What I love most is thoughtful, playful design: chonky animals, charming keychains, seasonal goodies, and custom color combos that feel personal to you.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    If you have an idea, I&apos;ll happily chat about colors, sizes, and simple tweaks to make your piece feel just right.
                  </p>
                </div>
              </div>

              <div className="text-center bg-gradient-to-r from-brand-main/10 to-brand-secondary/10 rounded-xl p-8">
                <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4">Thank You</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Thanks for being here, for supporting handmade, and for letting my work bring a bit of cozy joy to your day.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Link href="/products" className="bg-brand-secondary text-white px-6 py-3 rounded-full font-body font-medium hover:bg-brand-secondary/90 transition-all duration-300 text-center">
                    Browse My Work
                  </Link>
                  <Link href="/custom-orders" className="bg-white text-brand-secondary px-6 py-3 rounded-full font-body font-medium border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 text-center">
                    Start a Custom Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}