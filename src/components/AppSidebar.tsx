import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, CheckSquare, Clock,
  BarChart3, Calendar, Settings, Flame
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/subjects", icon: BookOpen, label: "Subjects" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/focus", icon: Clock, label: "Focus" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-border bg-sidebar px-3 py-6"
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Flame className="h-4 w-4 text-primary" />
        </div>
        <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">
          Aether
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-md bg-accent"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              <item.icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Settings */}
      <NavLink
        to="/settings"
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </NavLink>
    </motion.aside>
  );
}
