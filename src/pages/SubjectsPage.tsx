import { motion } from "framer-motion";
import { useStudyData } from "@/hooks/useStudyData";

export default function SubjectsPage() {
  const { subjects } = useStudyData();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Subjects</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subjects.length} subjects tracked</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((subject, i) => {
          const progress = Math.round((subject.studiedHours / subject.targetHours) * 100);
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="group surface-card-hover rounded-lg p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                <h3 className="text-sm font-medium text-foreground">{subject.name}</h3>
                <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground">
                  {subject.difficulty}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{subject.studiedHours}h / {subject.targetHours}h</span>
                  <span className="font-mono tabular-nums">{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
