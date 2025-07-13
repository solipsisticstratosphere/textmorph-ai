import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.div
      className="text-center mb-12"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      <motion.h1
        className="text-5xl font-bold text-slate-800 mb-6 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Transform Your Text with{" "}
        <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
          AI Magic
        </span>
      </motion.h1>
      <motion.p
        className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        Simply paste your text, specify how you want it transformed, and let our
        AI do the work. Experience the power of intelligent text transformation.
      </motion.p>
    </motion.div>
  );
}
