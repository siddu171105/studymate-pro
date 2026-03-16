import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyData } from "@/hooks/useStudyData";
import TaskCard from "@/components/TaskCard";
import InlineTaskInput from "@/components/InlineTaskInput";

export default function TasksPage() {
  const { tasks, subjects, completeTask, addTask, deleteTask } = useStudyData();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  let filtered = tasks;
  if (filter === "pending") filtered = filtered.filter(t => t.status === "pending");
  if (filter === "completed") filtered = filtered.filter(t => t.status === "completed");
  if (subjectFilter !== "all") filtered = filtered.filter(t => t.subject === subjectFilter);

  filtered.sort((a, b) => {
    const pOrder = { high: 0, medium: 1, low: 2 };
    if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
    return a.deadline.getTime() - b.deadline.getTime();
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tasks.filter(t => t.status === "pending").length} pending · {tasks.filter(t => t.status === "completed").length} completed
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "pending", "completed"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
        <select
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
          className="rounded-md bg-muted px-2 py-1.5 text-xs text-foreground outline-none"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      <InlineTaskInput subjects={subjects.map(s => s.name)} onAdd={addTask} />

      <AnimatePresence>
        {filtered.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} onComplete={completeTask} onDelete={deleteTask} />
        ))}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No tasks match your filters.</div>
      )}
    </div>
  );
}
