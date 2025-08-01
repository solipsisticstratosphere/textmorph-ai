"use client";

import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import Loading from "./loading";

const TransformationInterface = lazy(() =>
  import("@/components/transformation/TransformationInterface").then((mod) => ({
    default: mod.TransformationInterface,
  }))
);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            <TransformationInterface />
          </Suspense>
        </main>
      </motion.div>
    </div>
  );
}
