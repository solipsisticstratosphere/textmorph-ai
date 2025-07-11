"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TransformationInterface } from "@/components/TransformationInterface";

export default function HomePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header onMenuToggle={handleMenuToggle} showMobileMenu={showMobileMenu} />

      <main className="flex-1 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>
        <TransformationInterface />
      </main>

      <Footer />
    </div>
  );
}
