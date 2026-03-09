"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function FormError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key="form-error"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-xs font-medium text-destructive"
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

