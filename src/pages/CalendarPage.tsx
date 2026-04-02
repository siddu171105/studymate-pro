import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyData } from "@/hooks/useStudyData";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  const { tasks } = useStudyData();
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long" });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      const d = t.deadline;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), month, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(year, parseInt(e.target.value), 1));
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Calendar
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your deadlines and study sessions</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-surface p-1">
            <button
              onClick={prevMonth}
              className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center px-2 gap-1">
              <select
                value={month}
                onChange={handleMonthChange}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-primary transition-colors"
              >
                {months.map((m, i) => (
                  <option key={m} value={i} className="bg-background">{m}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={handleYearChange}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-primary transition-colors"
              >
                {years.map(y => (
                  <option key={y} value={y} className="bg-background">{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={nextMonth}
              className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => setViewDate(new Date())}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-border">
          <AnimatePresence mode="wait">
            {cells.map((day, i) => {
              const dayTasks = day ? getTasksForDay(day) : [];
              const today = isToday(day || 0);
              
              return (
                <motion.div
                  key={`${year}-${month}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`relative min-h-[100px] bg-surface p-2 transition-colors ${
                    day ? "hover:bg-muted/20" : "bg-muted/5"
                  }`}
                >
                  {day && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono tabular-nums ${
                          today 
                            ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" 
                            : "text-muted-foreground"
                        }`}>
                          {day}
                        </span>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        {dayTasks.map(t => (
                          <div
                            key={t.id}
                            className="group relative truncate rounded-md px-2 py-1 text-[10px] font-medium leading-tight transition-all hover:ring-1 hover:ring-primary/30"
                            style={{
                              backgroundColor: t.priority === "high" ? "hsl(var(--urgency) / 0.15)" : "hsl(var(--primary) / 0.1)",
                              color: t.priority === "high" ? "hsl(var(--urgency))" : "hsl(var(--primary))",
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <div className={`h-1 w-1 rounded-full ${t.priority === "high" ? "bg-urgency" : "bg-primary"}`} />
                              {t.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

