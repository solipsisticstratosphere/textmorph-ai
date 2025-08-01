"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { motion } from "framer-motion";

const Card = dynamic(
  () => import("@/components/ui/Card").then((mod) => mod.Card),
  { ssr: false }
);
const CardContent = dynamic(
  () => import("@/components/ui/Card").then((mod) => mod.CardContent),
  { ssr: false }
);
const Button = dynamic(
  () => import("@/components/ui/Button").then((mod) => mod.Button),
  { ssr: false }
);

const Check = dynamic(() => import("lucide-react").then((mod) => mod.Check), {
  ssr: false,
});
const Star = dynamic(() => import("lucide-react").then((mod) => mod.Star), {
  ssr: false,
});
const Zap = dynamic(() => import("lucide-react").then((mod) => mod.Zap), {
  ssr: false,
});
const Crown = dynamic(() => import("lucide-react").then((mod) => mod.Crown), {
  ssr: false,
});
const Sparkles = dynamic(
  () => import("lucide-react").then((mod) => mod.Sparkles),
  { ssr: false }
);
const ArrowRight = dynamic(
  () => import("lucide-react").then((mod) => mod.ArrowRight),
  { ssr: false }
);

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

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI text transformation",
    icon: <Star className="w-6 h-6" />,
    gradient: "from-slate-500 to-slate-600",
    bgGradient: "from-slate-50 to-slate-100",
    borderColor: "border-slate-200",
    features: [
      "5 transformations per day",
      "Basic AI model",
      "Standard text processing",
      "Email support",
      "Basic history access",
    ],
    limitations: [
      "Limited daily usage",
      "Basic model only",
      "No priority support",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "per month",
    description: "Enhanced features for professionals and content creators",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-50 to-blue-50",
    borderColor: "border-cyan-200",
    features: [
      "100 transformations per day",
      "Advanced AI model (GPT-4)",
      "Priority processing",
      "Advanced presets library",
      "Full history access",
      "Export to multiple formats",
      "Priority email support",
      "Custom transformation templates",
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "primary" as const,
    popular: true,
  },
  {
    name: "Unlimited",
    price: "$30",
    period: "per month",
    description: "Everything you need for unlimited text transformation",
    icon: <Crown className="w-6 h-6" />,
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    features: [
      "Unlimited transformations",
      "Premium AI models",
      "Unlimited revisions",
      "Advanced editing tools",
      "Bulk processing",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
      "Team collaboration",
      "White-label options",
    ],
    buttonText: "Go Unlimited",
    buttonVariant: "secondary" as const,
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "What happens if I exceed my daily limit?",
    answer:
      "On the Free plan, you'll need to wait until the next day or upgrade. Pro and Unlimited plans have higher or no limits.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. No questions asked.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Yes, we offer a 7-day free trial for both Pro and Unlimited plans. No credit card required.",
  },
];

export default function PricingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col min-h-screen"
      >
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div
              className="text-center mb-16"
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
              <motion.div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Transform your text with AI-powered tools. Start free and
                upgrade as you grow.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
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
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <Card
                    variant="glass"
                    className={`h-full shadow-2xl border-2 ${
                      plan.borderColor
                    } ${plan.popular ? "ring-2 ring-cyan-500/50" : ""}`}
                  >
                    <CardContent className="p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                        >
                          <div className="text-white">{plan.icon}</div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                          {plan.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-slate-800">
                            {plan.price}
                          </span>
                          <span className="text-slate-600 ml-2">
                            /{plan.period}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: featureIndex * 0.05,
                            }}
                          >
                            <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-slate-700 leading-relaxed">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={plan.buttonVariant}
                          className="w-full py-3 text-base font-semibold"
                          onClick={() =>
                            console.log(`Selected ${plan.name} plan`)
                          }
                        >
                          {plan.buttonText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Features Comparison */}
            <motion.div
              className="mb-16"
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
              <Card variant="glass" className="shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    Feature Comparison
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-4 px-4 font-semibold text-slate-800">
                            Features
                          </th>
                          <th className="text-center py-4 px-4 font-semibold text-slate-800">
                            Free
                          </th>
                          <th className="text-center py-4 px-4 font-semibold text-slate-800">
                            Pro
                          </th>
                          <th className="text-center py-4 px-4 font-semibold text-slate-800">
                            Unlimited
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Daily Transformations", "5", "100", "Unlimited"],
                          ["AI Model", "Basic", "GPT-4", "Premium"],
                          ["History Access", "Basic", "Full", "Full"],
                          ["Export Formats", "Text", "Multiple", "All"],
                          ["Priority Support", "❌", "✅", "✅"],
                          ["API Access", "❌", "❌", "✅"],
                          ["Team Collaboration", "❌", "❌", "✅"],
                        ].map(([feature, free, pro, unlimited], index) => (
                          <tr key={index} className="border-b border-slate-100">
                            <td className="py-4 px-4 text-slate-700">
                              {feature}
                            </td>
                            <td className="py-4 px-4 text-center text-slate-600">
                              {free}
                            </td>
                            <td className="py-4 px-4 text-center text-slate-600">
                              {pro}
                            </td>
                            <td className="py-4 px-4 text-center text-slate-600">
                              {unlimited}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
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
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 text-lg">
                  Everything you need to know about our pricing
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card variant="glass" className="shadow-lg h-full">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-slate-800 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
