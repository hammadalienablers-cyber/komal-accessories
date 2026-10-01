/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { MessageCircle } from 'lucide-react';

export default function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
        {/* Top Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Banner Section */}
          <Hero />

          {/* Product Catalog with Live Search & Category Filtering */}
          <ProductGrid />

          {/* Verified Customer Reviews Section */}
          <ReviewsSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Slide-out Drawers & Modals */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackerModal />
        <WishlistDrawer />

        {/* Floating WhatsApp Care Action Button */}
        <aside 
          aria-label="Customer support floating button"
          className="fixed bottom-6 right-6 z-30"
        >
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group text-xs font-semibold"
            title="Chat with Komal Accessories on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp Care</span>
          </a>
        </aside>
      </div>
    </ShopProvider>
  );
}
