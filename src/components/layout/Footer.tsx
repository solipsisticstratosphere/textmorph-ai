import { Sparkles, Github, Twitter, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TextMorph
                </span>
                <span className="text-sm text-gray-500 -mt-1 font-medium">
                  AI
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Transform your thoughts into perfect form. Empower your writing
              with AI-powered text transformation that understands context and
              intent.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-105 group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-emerald-100 rounded-lg transition-all duration-200 hover:scale-105 group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "API", "Changelog"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              {["Documentation", "Help Center", "Contact Us", "Status"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>© 2025 TextMorph AI. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for better writing.</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
