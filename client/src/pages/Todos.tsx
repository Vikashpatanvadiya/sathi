import { Sidebar } from "@/components/Sidebar";
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export default function Todos() {
  const [newTodo, setNewTodo] = useState("");
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: todos, isLoading } = useTodos(today);
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    await createTodo.mutateAsync({
      title: newTodo,
      isCompleted: false,
      date: new Date().toISOString(),
    });
    setNewTodo("");
  };

  const toggleTodo = (id: number, currentStatus: boolean) => {
    updateTodo.mutate({
      id,
      isCompleted: !currentStatus,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Daily Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Focus for {format(new Date(), "MMMM do, yyyy")}
            </p>
          </div>

          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="h-12 bg-card shadow-sm border-border/60"
            />
            <Button type="submit" size="icon" className="h-12 w-12 shrink-0 shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5" />
            </Button>
          </form>

          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {todos?.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Checkbox 
                      checked={todo.isCompleted || false} 
                      onCheckedChange={() => toggleTodo(todo.id, todo.isCompleted || false)}
                      className="w-5 h-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    
                    <span className={cn(
                      "flex-1 font-medium transition-all duration-300",
                      todo.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                    )}>
                      {todo.title}
                    </span>

                    <button 
                      onClick={() => deleteTodo.mutate(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {todos?.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No tasks yet. Enjoy your day!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
