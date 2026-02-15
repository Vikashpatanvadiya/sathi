import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  CalendarDays, 
  Target, 
  CheckSquare, 
  LogOut, 
  Plus,
  Home
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/diary", label: "Entries", icon: BookOpen },
    { href: "/timeline", label: "Timeline", icon: CalendarDays },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/todos", label: "Tasks", icon: CheckSquare },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border hidden md:flex flex-col">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
          Memoir
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">Personal Journal</p>
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

      <div className="p-4 mt-auto border-t border-border/50">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
            <AvatarFallback>{user?.firstName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <button 
            onClick={() => logout()}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
