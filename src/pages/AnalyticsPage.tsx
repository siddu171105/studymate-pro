import { motion } from "framer-motion";
import { useStudyData } from "@/hooks/useStudyData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AnalyticsPage() {
  const { sessions, tasks } = useStudyData();

  // Weekly data (last 7 days)
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const daySessions = sessions.filter(s => s.date.toDateString() === d.toDateString());
    const mins = daySessions.reduce((sum, s) => sum + s.minutes, 0);
    weekData.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      minutes: mins,
      hours: +(mins / 60).toFixed(1),
    });
  }

  const totalWeekMinutes = weekData.reduce((sum, d) => sum + d.minutes, 0);
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {Math.floor(totalWeekMinutes / 60)}h {totalWeekMinutes % 60}m this week · {completionRate}% completion rate
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Study Hours Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface-card rounded-lg p-5"
        >
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Study Hours — This Week
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(210, 20%, 95%)" }}
                itemStyle={{ color: "hsl(200, 90%, 55%)" }}
              />
              <Bar dataKey="hours" fill="hsl(200, 90%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Productivity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-card rounded-lg p-5"
        >
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Daily Minutes — Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200, 90%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(200, 90%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="minutes" stroke="hsl(200, 90%, 55%)" fill="url(#minGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
