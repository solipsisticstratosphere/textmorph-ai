import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="mt-8"
      >
        <Card
          variant="default"
          className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50"
        >
          <CardContent>
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
