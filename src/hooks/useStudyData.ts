import { useState, useCallback, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: "high" | "medium" | "low";
  deadline: Date;
  estimatedMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "completed";
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  color: string;
  targetHours: number;
  studiedHours: number;
}

export interface StudySession {
  id: string;
  date: Date;
  minutes: number;
  subject: string;
}

const DEMO_SUBJECTS: Subject[] = [
  { id: "1", name: "Organic Chemistry", difficulty: "hard", color: "hsl(270, 60%, 55%)", targetHours: 20, studiedHours: 12 },
  { id: "2", name: "Linear Algebra", difficulty: "medium", color: "hsl(200, 90%, 55%)", targetHours: 15, studiedHours: 8 },
  { id: "3", name: "Data Structures", difficulty: "medium", color: "hsl(150, 40%, 50%)", targetHours: 18, studiedHours: 14 },
  { id: "4", name: "Philosophy", difficulty: "easy", color: "hsl(40, 80%, 55%)", targetHours: 10, studiedHours: 7 },
];

const DEMO_TASKS: Task[] = [
  { id: "1", title: "Review Alkene Reactions", subject: "Organic Chemistry", priority: "high", deadline: new Date(Date.now() + 86400000), estimatedMinutes: 90, difficulty: "hard", status: "pending", createdAt: new Date() },
  { id: "2", title: "Matrix Transformations Practice", subject: "Linear Algebra", priority: "medium", deadline: new Date(Date.now() + 172800000), estimatedMinutes: 60, difficulty: "medium", status: "pending", createdAt: new Date() },
  { id: "3", title: "Implement Binary Search Tree", subject: "Data Structures", priority: "high", deadline: new Date(Date.now() + 86400000), estimatedMinutes: 120, difficulty: "medium", status: "pending", createdAt: new Date() },
  { id: "4", title: "Read Nietzsche Chapter 4", subject: "Philosophy", priority: "low", deadline: new Date(Date.now() + 259200000), estimatedMinutes: 45, difficulty: "easy", status: "pending", createdAt: new Date() },
  { id: "5", title: "Spectroscopy Lab Report", subject: "Organic Chemistry", priority: "high", deadline: new Date(Date.now() + 43200000), estimatedMinutes: 75, difficulty: "hard", status: "pending", createdAt: new Date() },
];

// Generate 30 days of mock study session data
const generateStudySessions = (): StudySession[] => {
  const sessions: StudySession[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const minutes = Math.floor(Math.random() * 240) + 30;
    if (Math.random() > 0.15) {
      sessions.push({
        id: `s${i}`,
        date,
        minutes,
        subject: DEMO_SUBJECTS[Math.floor(Math.random() * DEMO_SUBJECTS.length)].name,
      });
    }
  }
  return sessions;
};

// Helper for local storage
const STORAGE_KEYS = {
  TASKS: "studymate_tasks",
  SUBJECTS: "studymate_subjects",
  SESSIONS: "studymate_sessions",
  STREAK: "studymate_streak",
};

export function useStudyData() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      return JSON.parse(saved).map((t: any) => ({
        ...t,
        deadline: new Date(t.deadline),
        createdAt: new Date(t.createdAt),
      }));
    }
    return DEMO_TASKS;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : DEMO_SUBJECTS;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      return JSON.parse(saved).map((s: any) => ({
        ...s,
        date: new Date(s.date),
      }));
    }
    return generateStudySessions();
  });

  const [streak] = useState(12);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "completed" as const } : t));
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    setTasks(prev => [...prev, { ...task, id: crypto.randomUUID(), createdAt: new Date() }]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const addSession = useCallback((minutes: number, subject: string) => {
    setSessions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        date: new Date(),
        minutes,
        subject,
      },
    ]);
  }, []);

  const pendingTasks = tasks.filter(t => t.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const todayMinutes = sessions.filter(s => {
    const today = new Date();
    return s.date.toDateString() === today.toDateString();
  }).reduce((sum, s) => sum + s.minutes, 0);

  const productivityScore = Math.min(100, Math.round((todayMinutes / 300) * 100));

  return {
    tasks, subjects, sessions, streak,
    pendingTasks, completedTasks,
    todayMinutes, productivityScore,
    completeTask, addTask, deleteTask, addSession,
  };
}

