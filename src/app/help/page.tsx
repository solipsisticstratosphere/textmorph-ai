"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import {
  HelpCircle,
  MessageSquare,
  Book,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mail
} from "lucide-react";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is TextMorph AI?",
    answer: "TextMorph AI is an AI-powered text transformation platform that helps you rewrite, enhance, translate, and modify text content using advanced artificial intelligence. Perfect for content creators, writers, and professionals who need to transform text with different tones, formats, or languages."
  },
  {
    question: "How many transformations can I perform?",
    answer: "Guest users get 5 free transformations. Free registered users receive 50 transformations per 24 hours. Pro users ($15/month) get unlimited transformations. Your quota resets every 24 hours."
  },
  {
    question: "What languages are supported?",
    answer: "TextMorph AI supports 8 major languages: English, Russian, Ukrainian, German, Chinese, Japanese, French, and Spanish. Our AI can auto-detect the source language and translate to your target language."
  },
  {
    question: "What transformation presets are available?",
    answer: "We offer several quick-action presets: Rephrase, Expand, Shorten, Make Formal, Make Casual, and Enhance. You can also provide custom transformation instructions for specific needs."
  },
  {
    question: "Can I save my transformation history?",
    answer: "Yes! Registered users automatically save all their transformations in the History section. You can view past transformations, access revision history, and compare different versions of your text."
  },
  {
    question: "How does selection transformation work?",
    answer: "Highlight any portion of your text in the output area, and a tooltip will appear with quick transformation options. You can apply different transformations to specific sections without affecting the entire text."
  },
  {
    question: "What export formats are supported?",
    answer: "You can export your transformed text as plain text (.txt) or PDF documents. Simply click the download button in the text dashboard to choose your preferred format."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely! We use industry-standard encryption for all data transmission and storage. Your text transformations are private and only accessible by you. We never share your content with third parties."
  },
  {
    question: "What's the difference between Free and Pro plans?",
    answer: "Free users get 50 transformations per day with full access to all features including history and exports. Pro users ($15/month) get unlimited transformations, priority processing, and advanced AI models."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your Pro subscription at any time from your Profile page. You'll continue to have Pro access until the end of your current billing period."
  }
];

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success message
    // TODO: Implement actual contact form submission to database
    setContactSubmitted(true);
    setTimeout(() => {
      setContactMessage("");
      setContactSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Help & Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about using TextMorph AI
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <Book className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
                <p className="text-gray-600">
                  Learn the basics of transforming text with AI
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-cyan-500">
              <CardContent className="p-6">
                <Sparkles className="w-10 h-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Features Guide</h3>
                <p className="text-gray-600">
                  Explore all the powerful features available
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <MessageSquare className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
                <p className="text-gray-600">
                  Get help from our support team
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Getting Started Guide */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Book className="w-8 h-8 text-blue-600" />
                Getting Started
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Enter Your Text</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Paste or type your text into the input area on the main page. You can enter up to 10,000 characters at once.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Choose Your Transformation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Select from quick presets like &quot;Rephrase&quot; or &quot;Make Formal&quot;, or write custom instructions describing exactly how you want your text transformed.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Select Language (Optional)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Choose your target language if you want to translate your text. The AI will automatically detect the source language.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Transform & Review</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Click &quot;Transform Text&quot; and watch as AI processes your content. Review the output and make further edits using selection transformation if needed.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Export or Save</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Download your transformed text as TXT or PDF, or access it later from your History page if you&apos;re logged in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold pr-4">
                    {item.question}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-600" />
                Contact Support
              </h2>

              {contactSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-green-800 font-semibold text-lg">
                    Thank you for your message!
                  </p>
                  <p className="text-green-700 mt-2">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                      placeholder="Describe your question or issue..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Send Message
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Note: Email functionality will be added soon. For urgent issues, please check our FAQ above.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Additional Resources */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pricing Plans</h3>
                  <p className="text-gray-600 mb-2">
                    Learn about our Free, Pro, and Unlimited plans.
                  </p>
                  <a href="/pricing" className="text-blue-600 hover:underline">
                    View Pricing →
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Feature List</h3>
                  <p className="text-gray-600 mb-2">
                    Explore all the features and capabilities.
                  </p>
                  <a href="/features" className="text-blue-600 hover:underline">
                    View Features →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
