"use client";

import { useState, lazy, Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";
import dynamic from "next/dynamic";

const Header = dynamic(
  () =>
    import("@/components/layout/Header").then((mod) => ({
      default: mod.Header,
    })),
  { ssr: false }
);

const Footer = lazy(() =>
  import("@/components/layout/Footer").then((mod) => ({ default: mod.Footer }))
);
const ToastProvider = lazy(() =>
  import("./ToastProvider").then((mod) => ({ default: mod.ToastProvider }))
);
const AnimatedBackground = lazy(() => import("./AnimatedBackground"));

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
      <Suspense fallback={null}>
        <AnimatedBackground />
      </Suspense>
      <Suspense fallback={null}>
        <ToastProvider />
      </Suspense>
      <Header onMenuToggle={handleMenuToggle} showMobileMenu={showMobileMenu} />
      <main className="flex-grow">{children}</main>
      <Suspense fallback={<div className="h-16 w-full"></div>}>
        <Footer />
      </Suspense>
    </AuthProvider>
  );
}
