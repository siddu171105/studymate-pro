import { motion } from "framer-motion";
import FocusRing, { useFocusTimer } from "@/components/FocusRing";
import { useStudyData } from "@/hooks/useStudyData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function FocusPage() {
  const { subjects, addSession } = useStudyData();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "");

  const timer = useFocusTimer(25, () => {
    // On complete
    addSession(25, selectedSubject);
    toast({
      title: "Focus Session Complete!",
      description: `You've completed 25 minutes of ${selectedSubject}.`,
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[80vh] flex-col items-center justify-center"
    >
      <div className="mb-8 w-full max-w-xs text-center">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Current Focus
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          disabled={timer.isRunning}
          className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none transition-opacity focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

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
        {timer.isRunning 
          ? `Stay focused on ${selectedSubject}...` 
          : "Press Start to begin a 25-minute focus session."}
      </motion.p>
    </motion.div>
  );
}

