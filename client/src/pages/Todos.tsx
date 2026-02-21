import { Sidebar } from "@/components/Sidebar";
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { useGoals } from "@/hooks/use-goals";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Trash2, Calendar as CalendarIcon, Flag, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function Todos() {
  const [newTodo, setNewTodo] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string>("no-goal");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const { data: todos, isLoading } = useTodos(dateString);
  const { data: goals } = useGoals();

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    await createTodo.mutateAsync({
      title: newTodo,
      isCompleted: false,
      date: selectedDate.toISOString(),
      priority,
      goalId: selectedGoal === "no-goal" ? null : Number(selectedGoal),
    });
    setNewTodo("");
    setSelectedGoal("no-goal");
    setPriority("Medium");
  };

  const toggleTodo = (id: number, currentStatus: boolean) => {
    updateTodo.mutate({
      id,
      isCompleted: !currentStatus,
    });
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "High": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "Medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Low": return "text-green-500 bg-green-500/10 border-green-500/20";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Daily Tasks</h1>
              <p className="text-muted-foreground mt-1">
                Focus for {format(selectedDate, "MMMM do, yyyy")}
              </p>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {format(selectedDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border/60 shadow-sm">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className="h-12 bg-background border-border"
                />
                <Button type="submit" size="icon" className="h-12 w-12 shrink-0 shadow-lg shadow-primary/20">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1">
                <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                  <SelectTrigger className="w-[180px] h-9 text-xs">
                    <Target className="w-3 h-3 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-goal">No Goal (General)</SelectItem>
                    {goals?.map(g => (
                      <SelectItem key={g.id} value={String(g.id)}>{g.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <Flag className="w-3 h-3 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {todos?.map((todo) => {
                  const linkedGoal = goals?.find(g => g.id === todo.goalId);

                  return (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="group flex flex-col gap-2 p-4 rounded-xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
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
                      </div>

                      <div className="flex items-center gap-2 pl-8">
                        {linkedGoal && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 gap-1 font-normal bg-primary/5 border-primary/20 text-primary">
                            <Target className="w-3 h-3" />
                            {linkedGoal.title}
                          </Badge>
                        )}
                        <Badge variant="outline" className={cn("text-[10px] px-2 py-0 h-5 font-normal", getPriorityColor(todo.priority || "Medium"))}>
                          {todo.priority || "Medium"}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
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
