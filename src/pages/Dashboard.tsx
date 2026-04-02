import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Target, Zap, CheckCircle } from "lucide-react";
import { useStudyData } from "@/hooks/useStudyData";
import StatCard from "@/components/StatCard";
import TaskCard from "@/components/TaskCard";
import StudyHeatmap from "@/components/StudyHeatmap";
import InlineTaskInput from "@/components/InlineTaskInput";
import FocusRing, { useFocusTimer } from "@/components/FocusRing";

export default function Dashboard() {
  const {
    pendingTasks, completedTasks, subjects, sessions,
    streak, todayMinutes, productivityScore,
    completeTask, addTask, deleteTask, addSession
  } = useStudyData();

  const timer = useFocusTimer(25, () => {
    addSession(25, "Organic Chemistry"); // Default or last focused
  });

  const hours = Math.floor(todayMinutes / 60);
  const mins = todayMinutes % 60;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
          Your focus, synthesized.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pendingTasks.length} tasks pending · {hours}h {mins}m studied today
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Study Streak" value={`${streak} days`} icon={<Flame className="h-4 w-4" />} accent="text-warning" />
        <StatCard label="Today" value={`${hours}h ${mins}m`} icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Productivity" value={`${productivityScore}%`} icon={<Target className="h-4 w-4" />} accent="text-primary" />
        <StatCard label="Completed" value={completedTasks.length} icon={<CheckCircle className="h-4 w-4" />} accent="text-success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left — Task Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              The Stream — Next Up
            </h2>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {pendingTasks.length} tasks
            </span>
          </div>

          <InlineTaskInput
            subjects={subjects.map(s => s.name)}
            onAdd={addTask}
          />

          <AnimatePresence>
            {pendingTasks
              .sort((a, b) => {
                const pOrder = { high: 0, medium: 1, low: 2 };
                if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
                return a.deadline.getTime() - b.deadline.getTime();
              })
              .map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={i}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))}
          </AnimatePresence>

          {pendingTasks.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">The deck is clear. Define your next objective.</p>
            </div>
          )}
        </div>

        {/* Right — Focus Ring + Heatmap */}
        <div className="space-y-6">
          <div className="surface-card rounded-lg p-6">
            <FocusRing
              totalSeconds={timer.totalSeconds}
              remainingSeconds={timer.remaining}
              isRunning={timer.isRunning}
              onToggle={timer.toggle}
              onReset={timer.reset}
            />
          </div>

          <div className="surface-card rounded-lg p-4">
            <StudyHeatmap sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
}
