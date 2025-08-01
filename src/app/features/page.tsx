"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import framer-motion directly for types
import { motion } from "framer-motion";

// Dynamically import UI components
const Card = dynamic(
  () => import("@/components/ui/Card").then((mod) => mod.Card),
  { ssr: false }
);
const CardContent = dynamic(
  () => import("@/components/ui/Card").then((mod) => mod.CardContent),
  { ssr: false }
);

// Dynamically import icons
const Wand2 = dynamic(() => import("lucide-react").then((mod) => mod.Wand2), {
  ssr: false,
});
const FileText = dynamic(
  () => import("lucide-react").then((mod) => mod.FileText),
  { ssr: false }
);
const Edit3 = dynamic(() => import("lucide-react").then((mod) => mod.Edit3), {
  ssr: false,
});
const Download = dynamic(
  () => import("lucide-react").then((mod) => mod.Download),
  { ssr: false }
);
const History = dynamic(
  () => import("lucide-react").then((mod) => mod.History),
  {
    ssr: false,
  }
);
const ArrowDown = dynamic(
  () => import("lucide-react").then((mod) => mod.ArrowDown),
  { ssr: false }
);
const Sparkles = dynamic(
  () => import("lucide-react").then((mod) => mod.Sparkles),
  { ssr: false }
);
const RotateCcw = dynamic(
  () => import("lucide-react").then((mod) => mod.RotateCcw),
  { ssr: false }
);
const Save = dynamic(() => import("lucide-react").then((mod) => mod.Save), {
  ssr: false,
});
const Eye = dynamic(() => import("lucide-react").then((mod) => mod.Eye), {
  ssr: false,
});
const Share2 = dynamic(() => import("lucide-react").then((mod) => mod.Share2), {
  ssr: false,
});
const Zap = dynamic(() => import("lucide-react").then((mod) => mod.Zap), {
  ssr: false,
});
const Globe = dynamic(() => import("lucide-react").then((mod) => mod.Globe), {
  ssr: false,
});
const Palette = dynamic(
  () => import("lucide-react").then((mod) => mod.Palette),
  {
    ssr: false,
  }
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

const roadmapSteps = [
  {
    id: 1,
    title: "Input Your Text",
    description:
      "Start by pasting or typing your text into our intelligent editor",
    icon: <FileText className="w-6 h-6" />,
    gradient: "from-blue-500 to-indigo-600",
    features: [
      "Smart text detection",
      "Multiple input formats",
      "Real-time preview",
    ],
  },
  {
    id: 2,
    title: "Choose Transformation Style",
    description: "Select from dozens of AI-powered transformation presets",
    icon: <Palette className="w-6 h-6" />,
    gradient: "from-purple-500 to-pink-600",
    features: [
      "Professional tone",
      "Casual style",
      "Academic writing",
      "Creative flair",
      "Technical precision",
    ],
  },
  {
    id: 3,
    title: "AI Magic Happens",
    description: "Our advanced AI models transform your text with precision",
    icon: <Wand2 className="w-6 h-6" />,
    gradient: "from-cyan-500 to-blue-600",
    features: [
      "GPT-4 powered",
      "Context awareness",
      "Style consistency",
      "Grammar perfection",
    ],
  },
  {
    id: 4,
    title: "Review & Refine",
    description: "See the transformation and make additional edits if needed",
    icon: <Eye className="w-6 h-6" />,
    gradient: "from-green-500 to-emerald-600",
    features: [
      "Side-by-side comparison",
      "Highlight changes",
      "Instant feedback",
    ],
  },
  {
    id: 5,
    title: "Multiple Options",
    description: "Choose your next step based on your needs",
    icon: <Share2 className="w-6 h-6" />,
    gradient: "from-orange-500 to-red-600",
    branches: [
      {
        title: "Continue Editing",
        description: "Make manual adjustments and further refinements",
        icon: <Edit3 className="w-5 h-5" />,
        color: "from-teal-500 to-cyan-600",
      },
      {
        title: "Download Results",
        description: "Export in multiple formats (TXT, PDF, DOCX)",
        icon: <Download className="w-5 h-5" />,
        color: "from-indigo-500 to-purple-600",
      },
      {
        title: "Save to History",
        description: "Store your transformation for future reference",
        icon: <Save className="w-5 h-5" />,
        color: "from-pink-500 to-rose-600",
      },
    ],
  },
  {
    id: 6,
    title: "Access Your History",
    description: "Browse all your previous transformations and sessions",
    icon: <History className="w-6 h-6" />,
    gradient: "from-slate-500 to-slate-600",
    features: [
      "Organized by date",
      "Search functionality",
      "Revision tracking",
      "Export history",
    ],
  },
];

const additionalFeatures = [
  {
    title: "Multi-Language Support",
    description:
      "Transform text in over 50 languages with native understanding",
    icon: <Globe className="w-8 h-8" />,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    title: "Batch Processing",
    description: "Process multiple documents simultaneously for efficiency",
    icon: <Zap className="w-8 h-8" />,
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    title: "Revision Control",
    description: "Track every change with detailed revision history",
    icon: <RotateCcw className="w-8 h-8" />,
    gradient: "from-green-500 to-teal-600",
  },
  {
    title: "Smart Templates",
    description: "Pre-built templates for common transformation patterns",
    icon: <FileText className="w-8 h-8" />,
    gradient: "from-purple-500 to-indigo-600",
  },
];

export default function FeaturesPage() {
  // Use client-side only rendering
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
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Powerful{" "}
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Features
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover how TextMorph AI transforms your writing workflow with
                intelligent features and seamless integrations.
              </p>
            </motion.div>

            {/* Roadmap */}
            <motion.div
              className="mb-20"
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
                  Your Transformation Journey
                </h2>
                <p className="text-slate-600 text-lg">
                  Follow the path from raw text to polished content
                </p>
              </div>

              <div className="relative">
                {/* Connection Lines */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-300 to-blue-400 rounded-full opacity-30 hidden lg:block" />

                {roadmapSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="relative mb-16 last:mb-0"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <div
                      className={`flex flex-col lg:flex-row items-center ${
                        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                      } gap-8`}
                    >
                      {/* Content */}
                      <div className="flex-1 max-w-lg">
                        <Card
                          variant="glass"
                          className="shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                          <CardContent className="p-8">
                            <div className="flex items-center space-x-4 mb-4">
                              <div
                                className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg`}
                              >
                                <div className="text-white">{step.icon}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-500">
                                  Step {step.id}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">
                                  {step.title}
                                </h3>
                              </div>
                            </div>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                              {step.description}
                            </p>
                            {step.features && (
                              <div className="space-y-2">
                                {step.features.map((feature, featureIndex) => (
                                  <div
                                    key={featureIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                                    <span className="text-sm text-slate-600">
                                      {feature}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {step.branches && (
                              <div className="mt-6 space-y-3">
                                <div className="text-sm font-medium text-slate-700 mb-3">
                                  Choose your path:
                                </div>
                                {step.branches.map((branch, branchIndex) => (
                                  <motion.div
                                    key={branchIndex}
                                    className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg border border-white/30"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div
                                      className={`w-8 h-8 bg-gradient-to-br ${branch.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                                    >
                                      <div className="text-white">
                                        {branch.icon}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-800 text-sm">
                                        {branch.title}
                                      </div>
                                      <div className="text-xs text-slate-600">
                                        {branch.description}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Step Number Circle */}
                      <div className="relative z-10">
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-2xl`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-white font-bold text-xl">
                            {step.id}
                          </span>
                        </motion.div>
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="flex-1 max-w-lg hidden lg:block" />
                    </div>

                    {/* Arrow for next step */}
                    {index < roadmapSteps.length - 1 && (
                      <div className="flex justify-center mt-8 lg:hidden">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          <ArrowDown className="w-6 h-6 text-slate-400" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Features */}
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
                  Advanced Capabilities
                </h2>
                <p className="text-slate-600 text-lg">
                  Powerful features that set TextMorph AI apart
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {additionalFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card
                      variant="glass"
                      className="h-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                        >
                          <div className="text-white">{feature.icon}</div>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {feature.description}
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
