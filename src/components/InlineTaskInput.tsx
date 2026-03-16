import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Task } from "@/hooks/useStudyData";

interface InlineTaskInputProps {
  subjects: string[];
  onAdd: (task: Omit<Task, "id" | "createdAt">) => void;
}

export default function InlineTaskInput({ subjects, onAdd }: InlineTaskInputProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0] || "");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [minutes, setMinutes] = useState(60);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      subject,
      priority,
      deadline: new Date(Date.now() + 86400000 * 2),
      estimatedMinutes: minutes,
      difficulty: "medium",
      status: "pending",
    });
    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        <span>Add task</span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden rounded-lg border border-primary/20 bg-surface p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Task</span>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder="Define your next objective..."
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none mb-3"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="rounded-md bg-muted px-2 py-1 text-xs text-foreground outline-none"
        >
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as "high" | "medium" | "low")}
          className="rounded-md bg-muted px-2 py-1 text-xs text-foreground outline-none"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="number"
          value={minutes}
          onChange={e => setMinutes(Number(e.target.value))}
          className="w-16 rounded-md bg-muted px-2 py-1 text-xs text-foreground outline-none"
          min={5}
          step={5}
        />
        <span className="text-xs text-muted-foreground">min</span>
        <button
          onClick={handleSubmit}
          className="ml-auto rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add
        </button>
      </div>
    </motion.div>
  );
}
