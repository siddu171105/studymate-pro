import { motion } from "framer-motion";
import { useStudyData } from "@/hooks/useStudyData";

export default function CalendarPage() {
  const { tasks } = useStudyData();

  // Build current month grid
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      const d = t.deadline;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">{monthName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Task deadlines and scheduled sessions</p>
      </motion.div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          const isToday = day === now.getDate();
          const dayTasks = day ? getTasksForDay(day) : [];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01 }}
              className={`relative min-h-[80px] rounded-md border p-2 ${
                day ? "border-border bg-surface" : "border-transparent"
              } ${isToday ? "border-primary/30" : ""}`}
            >
              {day && (
                <>
                  <span className={`text-xs font-mono tabular-nums ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayTasks.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className="truncate rounded px-1 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: t.priority === "high" ? "hsl(var(--urgency) / 0.2)" : "hsl(var(--primary) / 0.15)",
                          color: t.priority === "high" ? "hsl(var(--urgency))" : "hsl(var(--primary))",
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{dayTasks.length - 2} more</span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
