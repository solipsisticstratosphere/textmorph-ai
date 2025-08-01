"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "./ToastProvider";
import AnimatedBackground from "./AnimatedBackground";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <AuthProvider>
      <AnimatedBackground />
      <ToastProvider />
      <Header onMenuToggle={handleMenuToggle} showMobileMenu={showMobileMenu} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </AuthProvider>
  );
}
