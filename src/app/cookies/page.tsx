"use client";

import { motion } from "framer-motion";
import { Cookie, Settings, BarChart3, Shield, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cookieTypes = [
  {
    id: "essential",
    title: "Essential Cookies",
    icon: <Shield className="w-5 h-5" />,
    description:
      "These cookies are necessary for the website to function and cannot be switched off.",
    enabled: true,
    canToggle: false,
    examples: [
      "Authentication tokens to keep you logged in",
      "Security cookies to prevent fraud",
      "Session cookies to maintain your preferences",
    ],
  },
  {
    id: "analytics",
    title: "Analytics Cookies",
    icon: <BarChart3 className="w-5 h-5" />,
    description:
      "These cookies help us understand how visitors interact with our website.",
    enabled: true,
    canToggle: true,
    examples: [
      "Google Analytics to track page views and user behavior",
      "Performance monitoring to identify slow pages",
      "Error tracking to improve service reliability",
    ],
  },
  {
    id: "functional",
    title: "Functional Cookies",
    icon: <Settings className="w-5 h-5" />,
    description:
      "These cookies enable enhanced functionality and personalization.",
    enabled: true,
    canToggle: true,
    examples: [
      "Language preferences",
      "Theme settings (dark/light mode)",
      "Recently used transformation presets",
    ],
  },
  {
    id: "marketing",
    title: "Marketing Cookies",
    icon: <Eye className="w-5 h-5" />,
    description:
      "These cookies are used to track visitors across websites for marketing purposes.",
    enabled: false,
    canToggle: true,
    examples: [
      "Social media integration cookies",
      "Advertising network cookies",
      "Conversion tracking pixels",
    ],
  },
];

export default function CookiePolicyPage() {
  const [cookieSettings, setCookieSettings] = useState(
    cookieTypes.reduce(
      (acc, cookie) => ({
        ...acc,
        [cookie.id]: cookie.enabled,
      }),
      {} as Record<string, boolean>
    )
  );

  const handleToggle = (cookieId: string) => {
    setCookieSettings((prev) => ({
      ...prev,
      [cookieId]: !prev[cookieId],
    }));
  };

  const handleSaveSettings = () => {
    console.log("Cookie settings saved:", cookieSettings);
    // Here you would typically save to localStorage or send to your backend
  };

  const handleAcceptAll = () => {
    const allEnabled = cookieTypes.reduce(
      (acc, cookie) => ({
        ...acc,
        [cookie.id]: true,
      }),
      {} as Record<string, boolean>
    );
    setCookieSettings(allEnabled);
  };

  const handleRejectAll = () => {
    const onlyEssential = cookieTypes.reduce(
      (acc, cookie) => ({
        ...acc,
        [cookie.id]: cookie.id === "essential",
      }),
      {} as Record<string, boolean>
    );
    setCookieSettings(onlyEssential);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col relative overflow-hidden"
      variants={{
        animate: {
          background: [
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)",
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #0ea5e9 75%, #0284c7 100%)",
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)",
          ],
          transition: {
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        },
      }}
      animate="animate"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-400/30 to-cyan-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col min-h-screen"
      >
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
            >
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Cookie className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Cookie Policy
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Learn about how we use cookies and similar technologies to
                improve your experience on TextMorph AI.
              </p>
              <div className="mt-6 text-sm text-slate-500">
                <p>Last updated: January 20, 2025</p>
              </div>
            </motion.div>

            {/* Introduction */}
            <motion.div
              className="mb-12"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
            >
              <Card variant="glass" className="shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 mb-3">
                        What Are Cookies?
                      </h2>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        Cookies are small text files that are stored on your
                        device when you visit our website. They help us provide
                        you with a better experience by remembering your
                        preferences, analyzing how you use our service, and
                        enabling certain functionality.
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        We use both session cookies (which expire when you close
                        your browser) and persistent cookies (which remain on
                        your device for a set period or until you delete them).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cookie Settings */}
            <motion.div
              className="mb-12"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
            >
              <Card variant="elevated" className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-slate-800">Cookie Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">
                    You can control which cookies we use by adjusting the
                    settings below. Note that disabling certain cookies may
                    affect the functionality of our service.
                  </p>

                  <div className="space-y-6">
                    {cookieTypes.map((cookieType, index) => (
                      <motion.div
                        key={cookieType.id}
                        className="border border-slate-200 rounded-lg p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
                                {cookieType.icon}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800">
                                {cookieType.title}
                              </h3>
                              <p className="text-slate-600 text-sm mt-1">
                                {cookieType.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {cookieType.canToggle ? (
                              <motion.button
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  cookieSettings[cookieType.id]
                                    ? "bg-cyan-600"
                                    : "bg-slate-300"
                                }`}
                                onClick={() => handleToggle(cookieType.id)}
                                whileTap={{ scale: 0.95 }}
                              >
                                <motion.span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    cookieSettings[cookieType.id]
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                  layout
                                />
                              </motion.button>
                            ) : (
                              <div className="text-sm text-slate-500 font-medium">
                                Always Active
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ml-11">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">
                            Examples:
                          </h4>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {cookieType.examples.map(
                              (example, exampleIndex) => (
                                <li
                                  key={exampleIndex}
                                  className="flex items-start space-x-2"
                                >
                                  <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleSaveSettings}
                        variant="primary"
                        className="w-full"
                      >
                        Save Preferences
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleAcceptAll}
                        variant="secondary"
                        className="w-full sm:w-auto"
                      >
                        Accept All
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleRejectAll}
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reject All
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              className="space-y-8"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
            >
              <Card variant="elevated" className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-slate-800">
                      Managing Cookies in Your Browser
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    You can also manage cookies directly through your browser
                    settings. Here&apos;s how to do it in popular browsers:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        browser: "Chrome",
                        steps:
                          "Settings > Privacy and security > Cookies and other site data",
                      },
                      {
                        browser: "Firefox",
                        steps:
                          "Settings > Privacy & Security > Cookies and Site Data",
                      },
                      {
                        browser: "Safari",
                        steps: "Preferences > Privacy > Manage Website Data",
                      },
                      {
                        browser: "Edge",
                        steps:
                          "Settings > Cookies and site permissions > Cookies and site data",
                      },
                    ].map((item, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-800 mb-2">
                          {item.browser}
                        </h4>
                        <p className="text-sm text-slate-600">{item.steps}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="mt-12"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
            >
              <Card variant="glass" className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Questions About Cookies?
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    If you have any questions about our use of cookies or this
                    Cookie Policy, please don&apos;t hesitate to contact us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Cookie className="w-4 h-4" />
                      <span>cookies@textmorph.ai</span>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-slate-300" />
                    <div className="text-slate-600">
                      <span>We&apos;ll respond within 48 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </motion.div>
    </motion.div>
  );
}
