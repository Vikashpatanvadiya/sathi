import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/Sidebar";
import { useDiaryEntries } from "@/hooks/use-diary";
import { useTodos } from "@/hooks/use-todos";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Loader2, Plus, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user } = useAuth();
  const { data: entries, isLoading: isLoadingEntries } = useDiaryEntries();
  const { data: todos, isLoading: isLoadingTodos } = useTodos(format(new Date(), 'yyyy-MM-dd'));

  // Get mood stats from recent entries
  const recentMoods = entries?.slice(0, 5).map(e => e.mood) || [];
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {format(new Date(), "EEEE, MMMM do, yyyy")}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Welcome back, {user?.firstName}.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Ready to document your journey today?
            </p>
            <div className="pt-4">
              <Link href="/diary/new">
                <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 hover:shadow-2xl transition-all">
                  <Plus className="mr-2 h-5 w-5" /> Write Today's Entry
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Entries */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-semibold">Recent Entries</h2>
                <Link href="/diary">
                  <Button variant="link" className="text-muted-foreground hover:text-primary p-0">
                    View all <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {isLoadingEntries ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : entries?.length === 0 ? (
                <Card className="bg-secondary/30 border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <p>No entries yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {entries?.slice(0, 3).map((entry) => (
                    <Link key={entry.id} href={`/diary/${entry.id}`}>
                      <div className="group block p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {entry.title}
                          </h3>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                            {format(new Date(entry.date), "MMM d")}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {entry.content}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <span className="capitalize px-2 py-0.5 rounded-md bg-secondary/50 border border-border/50">
                            {entry.mood}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Today's Tasks Summary */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-semibold">Today's Focus</h2>
                <Link href="/todos">
                  <Button variant="link" className="text-muted-foreground hover:text-primary p-0">
                    Manage tasks <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
                {isLoadingTodos ? (
                  <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : todos?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No tasks set for today.</p>
                ) : (
                  <ul className="space-y-3">
                    {todos?.slice(0, 5).map((todo) => (
                      <li key={todo.id} className="flex items-start gap-3 text-sm">
                        {todo.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                        <span className={todo.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}>
                          {todo.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <Link href="/todos">
                    <Button variant="outline" className="w-full text-xs uppercase tracking-wider">
                      View Full List
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </main>
    </div>
  );
}
