"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

export function Header({ onMenuToggle, showMobileMenu = false }: HeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <motion.header
      className="bg-white backdrop-blur-xl sticky top-0 z-50 border-b border-white/20 shadow-sm"
      variants={{
        hidden: { y: -100, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover="hover"
          >
            <Link
              href="/"
              className="flex items-center space-x-2 group no-underline"
            >
              <motion.div
                className="flex items-center justify-center w-10 h-10 shadow-lg overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <Image src="/logo.svg" alt="Logo" width={40} height={40} />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  TextMorph
                </span>
                <span className="text-xs text-slate-500 -mt-1 font-medium">
                  AI
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Features", "Examples", "Pricing", "Help"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-600 hover:text-cyan-600 transition-all duration-200 font-medium relative group"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, delay: index * 0.1 },
                  },
                }}
                whileHover="hover"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-600 to-blue-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.div
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-slate-800 text-sm leading-tight">
                      {user.name}
                    </span>
                    {user.isPro && (
                      <span className="inline-block px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs rounded-md font-medium">
                        PRO
                      </span>
                    )}
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="p-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {user.email}
                            </p>
                            {user.isPro && (
                              <span className="inline-block mt-1.5 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs rounded-full font-medium shadow-sm">
                                ✨ PRO Member
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <motion.button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 text-left text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 group"
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogOut className="w-4 h-4 group-hover:text-red-500" />
                          <span className="font-medium">Sign out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Link href="/login" passHref>
                    <Button variant="ghost" size="sm" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Link href="/register" passHref>
                    <Button
                      className="font-medium shadow-lg hover:shadow-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      size="sm"
                    >
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                aria-label="Toggle menu"
                className="hover:bg-white/50"
              >
                <AnimatePresence mode="wait">
                  {showMobileMenu ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="md:hidden py-4 border-t border-white/20 bg-white/80 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-4">
                {["Features", "Examples", "Pricing", "Help"].map(
                  (item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-slate-600 hover:text-cyan-600 transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-white/50 font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      {item}
                    </motion.a>
                  )
                )}
                <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                  {isLoading ? (
                    <div className="h-8 w-full bg-slate-200 animate-pulse rounded-md"></div>
                  ) : user ? (
                    <>
                      <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-md">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        {user.isPro && (
                          <span className="inline-block mt-3 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs rounded-full font-medium">
                            ✨ PRO Member
                          </span>
                        )}
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start font-medium w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-transparent"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.4 }}
                      >
                        <Link href="/login" passHref>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start font-medium w-full"
                          >
                            Sign In
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.5 }}
                      >
                        <Link href="/register" passHref>
                          <Button
                            className="font-medium shadow-lg w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                            size="sm"
                          >
                            Get Started
                          </Button>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
