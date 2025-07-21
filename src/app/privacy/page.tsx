"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

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

const sections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    icon: <Database className="w-5 h-5" />,
    content: [
      {
        subtitle: "Personal Information",
        text: "We collect information you provide directly to us, such as when you create an account, use our text transformation services, or contact us for support. This may include your name, email address, and any text content you submit for processing.",
      },
      {
        subtitle: "Usage Information",
        text: "We automatically collect certain information about your use of our services, including your IP address, browser type, operating system, referring URLs, and information about your interactions with our platform.",
      },
      {
        subtitle: "AI Processing Data",
        text: "When you use our text transformation features, we temporarily process your input text to provide the requested transformations. This data is processed securely and is not stored permanently unless you explicitly save it to your account.",
      },
    ],
  },
  {
    id: "information-use",
    title: "How We Use Your Information",
    icon: <Eye className="w-5 h-5" />,
    content: [
      {
        subtitle: "Service Provision",
        text: "We use your information to provide, maintain, and improve our text transformation services, including processing your requests and delivering results.",
      },
      {
        subtitle: "Communication",
        text: "We may use your contact information to send you service-related notifications, updates about new features, and respond to your inquiries.",
      },
      {
        subtitle: "Analytics and Improvement",
        text: "We analyze usage patterns to understand how our services are used and to improve functionality, performance, and user experience.",
      },
    ],
  },
  {
    id: "information-sharing",
    title: "Information Sharing and Disclosure",
    icon: <Users className="w-5 h-5" />,
    content: [
      {
        subtitle: "Third-Party Services",
        text: "We may share information with trusted third-party service providers who assist us in operating our platform, such as cloud hosting providers and analytics services. These providers are bound by confidentiality agreements.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information if required by law, regulation, or legal process, or if we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or the public.",
      },
      {
        subtitle: "Business Transfers",
        text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to the same privacy protections.",
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: <Lock className="w-5 h-5" />,
    content: [
      {
        subtitle: "Security Measures",
        text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
      },
      {
        subtitle: "Encryption",
        text: "All data transmission is encrypted using industry-standard SSL/TLS protocols. Sensitive data is encrypted at rest using advanced encryption standards.",
      },
      {
        subtitle: "Access Controls",
        text: "We maintain strict access controls and regularly audit our systems to ensure that only authorized personnel have access to personal information.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights and Choices",
    icon: <Shield className="w-5 h-5" />,
    content: [
      {
        subtitle: "Access and Correction",
        text: "You have the right to access, update, or correct your personal information. You can do this through your account settings or by contacting us directly.",
      },
      {
        subtitle: "Data Deletion",
        text: "You may request deletion of your personal information, subject to certain legal and operational requirements. We will respond to such requests in accordance with applicable law.",
      },
      {
        subtitle: "Data Portability",
        text: "You have the right to request a copy of your personal information in a structured, machine-readable format, and to transfer this data to another service provider.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your information when you use
                TextMorph AI.
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
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 mb-3">
                        Our Commitment to Privacy
                      </h2>
                      <p className="text-slate-600 leading-relaxed">
                        At TextMorph AI, we are committed to protecting your
                        privacy and ensuring the security of your personal
                        information. This Privacy Policy describes how we
                        collect, use, disclose, and safeguard your information
                        when you use our text transformation services. By using
                        our services, you agree to the collection and use of
                        information in accordance with this policy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section) => (
                <motion.div
                  key={section.id}
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
                  <Card
                    variant="elevated"
                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                            {section.icon}
                          </div>
                        </div>
                        <span className="text-slate-800">{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: itemIndex * 0.1,
                            }}
                          >
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                              {item.subtitle}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                              {item.text}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

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
                    Questions About This Policy?
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    If you have any questions about this Privacy Policy or our
                    data practices, please don&apos;t hesitate to contact us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>privacy@textmorph.ai</span>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-slate-300" />
                    <div className="text-slate-600">
                      <span>Response time: Within 48 hours</span>
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
