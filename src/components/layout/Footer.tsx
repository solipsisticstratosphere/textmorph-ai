"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";
const links = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  return (
    <motion.footer
      className="bg-white/80 backdrop-blur-sm border-t border-slate-200/50"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> */}
        {/* Brand */}
        {/* <motion.div
            className="col-span-1 md:col-span-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              },
            }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                className="flex items-center justify-center w-10 h-10  shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Image src="/logo.svg" alt="Logo" width={40} height={40} />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  TextMorph
                </span>
                <span className="text-sm text-slate-500 -mt-1 font-medium">
                  AI
                </span>
              </div>
            </div>
            <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
              Transform your thoughts into perfect form. Empower your writing
              with AI-powered text transformation that understands context and
              intent.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: Github,
                  label: "GitHub",
                  hoverColor: "hover:bg-slate-100",
                },
                {
                  icon: Twitter,
                  label: "Twitter",
                  hoverColor: "hover:bg-blue-100",
                },
                { icon: Mail, label: "Email", hoverColor: "hover:bg-teal-100" },
              ].map(({ icon: Icon, label, hoverColor }, index) => (
                <motion.a
                  key={label}
                  href="#"
                  className={`flex items-center justify-center w-10 h-10 bg-slate-100 ${hoverColor} rounded-lg transition-all duration-200 group`}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Icon className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors duration-200" />
                </motion.a>
              ))}
            </div>
          </motion.div> */}

        {/* Product */}
        {/* <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              },
            }}
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "API", "Changelog"].map(
                (item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.a
                      href="#"
                      className="text-slate-700 hover:text-cyan-600 transition-colors duration-200 text-sm inline-block"
                      whileHover={{ x: 4 }}
                    >
                      {item}
                    </motion.a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div> */}

        {/* Support */}
        {/* <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              },
            }}
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              {["Documentation", "Help Center", "Contact Us", "Status"].map(
                (item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.a
                      href="#"
                      className="text-slate-700 hover:text-cyan-600 transition-colors duration-200 text-sm inline-block"
                      whileHover={{ x: 4 }}
                    >
                      {item}
                    </motion.a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        </div> */}

        <motion.div
          className=""
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-slate-600 text-sm">
              <span>© {new Date().getFullYear()} TextMorph AI. Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>for better writing.</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {links.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: index * 0.15,
                  }}
                  whileHover={{
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                >
                  <Link
                    href={link.href}
                    className="group relative text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300"
                  >
                    {link.name}
                    {/* underline effect */}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
