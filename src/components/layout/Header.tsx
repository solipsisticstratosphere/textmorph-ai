"use client";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

export function Header({ onMenuToggle, showMobileMenu = false }: HeaderProps) {
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TextMorph
              </span>
              <span className="text-xs text-gray-500 -mt-1 font-medium">
                AI
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Features", "Examples", "Pricing", "Help"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="font-medium">
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="font-medium shadow-lg hover:shadow-xl"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
              className="hover:bg-white/50"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-white/20 glass scale-in">
            <nav className="flex flex-col space-y-4">
              {["Features", "Examples", "Pricing", "Help"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-white/50 font-medium"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start font-medium"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="font-medium shadow-lg"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
