import { motion } from "framer-motion";
import { StudySession } from "@/hooks/useStudyData";

interface StudyHeatmapProps {
  sessions: StudySession[];
}

export default function StudyHeatmap({ sessions }: StudyHeatmapProps) {
  // Build 30-day grid
  const days: { date: Date; minutes: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const daySessions = sessions.filter(s => s.date.toDateString() === d.toDateString());
    days.push({ date: d, minutes: daySessions.reduce((sum, s) => sum + s.minutes, 0) });
  }

  const maxMinutes = Math.max(...days.map(d => d.minutes), 1);

  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Study Pulse — 30 days
      </h3>
      <div className="flex flex-wrap gap-1">
        {days.map((day, i) => {
          const intensity = day.minutes / maxMinutes;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              title={`${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${day.minutes}m`}
              className="h-4 w-4 rounded-sm"
              style={{
                backgroundColor: day.minutes === 0
                  ? "hsl(var(--muted) / 0.3)"
                  : `hsl(var(--primary) / ${0.2 + intensity * 0.8})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
