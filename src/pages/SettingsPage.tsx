import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Configure your study preferences</p>
      </motion.div>

      <div className="max-w-md space-y-6">
        <div className="surface-card rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <input
                defaultValue="Student"
                className="mt-1 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Daily study goal (hours)</label>
              <input
                type="number"
                defaultValue={5}
                className="mt-1 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="surface-card rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pomodoro</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Focus duration (minutes)</label>
              <input
                type="number"
                defaultValue={25}
                className="mt-1 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Break duration (minutes)</label>
              <input
                type="number"
                defaultValue={5}
                className="mt-1 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
