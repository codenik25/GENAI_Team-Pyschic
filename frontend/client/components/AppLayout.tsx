import { ReactNode } from "react";
import { Sparkles, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AppLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/20 grid place-items-center text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">ViralSpark</span>
          </div>
          <div className="hidden md:flex items-center gap-3 min-w-[320px]">
            <Input placeholder="Search projects, captions, hashtags" className="h-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="notifications">
              <Bell />
            </Button>
            <Button variant="secondary" className="h-9 px-3">New Project</Button>
            <div className="ml-1 h-9 w-9 rounded-full bg-secondary grid place-items-center">
              <User className="h-4 w-4 opacity-70" />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="border-t py-6 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p>© {new Date().getFullYear()} ViralSpark</p>
          <p>Built with Fusion Starter</p>
        </div>
      </footer>
    </div>
  );
}
