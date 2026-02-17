import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Target,
  CheckSquare,
  Plus,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/diary", label: "Entries", icon: BookOpen },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/todos", label: "Tasks", icon: CheckSquare },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-serif font-bold text-primary">Sathi</h1>
        <p className="text-xs text-muted-foreground tracking-widest mt-1">ACHIEVE MORE</p>
      </div>

      <div className="px-4 mb-8">
        <Link href="/diary/new">
          <Button className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
            <Plus className="w-4 h-4" /> New Entry
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
