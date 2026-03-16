import { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-[220px] flex-1 px-8 py-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
