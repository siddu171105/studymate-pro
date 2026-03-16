import { motion } from "framer-motion";
import FocusRing, { useFocusTimer } from "@/components/FocusRing";

export default function FocusPage() {
  const timer = useFocusTimer(25);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[80vh] flex-col items-center justify-center"
    >
      <FocusRing
        totalSeconds={timer.totalSeconds}
        remainingSeconds={timer.remaining}
        isRunning={timer.isRunning}
        onToggle={timer.toggle}
        onReset={timer.reset}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-sm text-muted-foreground"
      >
        Press Start to begin a 25-minute focus session.
      </motion.p>
    </motion.div>
  );
}
