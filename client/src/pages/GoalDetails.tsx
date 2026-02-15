import { useRef } from "react";
// ... existing imports ...
import { Sidebar } from "@/components/Sidebar";
import { useGoals, useDeleteGoal, useUpdateGoal } from "@/hooks/use-goals";
import { useTodos, useUpdateTodo } from "@/hooks/use-todos";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Target, Calendar, CheckCircle2, Trash2, Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function GoalDetails() {
    const [match, params] = useRoute("/goals/:id");
    const id = params?.id ? Number(params.id) : null;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: goals, isLoading: isLoadingGoals } = useGoals();
    const { data: allTodos, isLoading: isLoadingTodos } = useTodos();
    const updateTodo = useUpdateTodo();
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();

    const goal = goals?.find(g => g.id === id);
    const goalTodos = allTodos?.filter(t => t.goalId === id) || [];

    const toggleTodo = (todoId: number, currentStatus: boolean) => {
        updateTodo.mutate({
            id: todoId,
            isCompleted: !currentStatus,
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && goal) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateGoal.mutate({
                    id: goal.id,
                    rewardImage: base64String
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        if (goal && confirm('Remove reward photo?')) {
            updateGoal.mutate({
                id: goal.id,
                rewardImage: null
            });
        }
    };

    if (isLoadingGoals || isLoadingTodos) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!goal) {
        return (
            <div className="flex min-h-screen bg-background">
                <Sidebar />
                <main className="flex-1 p-8 flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-4">Goal not found</p>
                    <Button variant="outline" asChild><a href="/goals">Back to Goals</a></Button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-8">

                    <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
                        <a href="/goals"><ArrowLeft className="w-4 h-4" /> Back to Goals</a>
                    </Button>

                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <Badge variant="secondary" className={cn("gap-1.5 px-3 py-1", goal.isCompleted ? "text-green-600 bg-green-500/10" : "text-blue-600 bg-blue-500/10")}>
                                    <Target className="w-3.5 h-3.5" />
                                    {goal.isCompleted ? "Completed" : "In Progress"}
                                </Badge>
                                <h1 className={cn("text-4xl font-serif font-bold text-foreground leading-tight", goal.isCompleted && "line-through text-muted-foreground")}>{goal.title}</h1>
                                {goal.targetDate && (
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Target: {format(new Date(goal.targetDate), "MMMM do, yyyy")}
                                    </p>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    if (confirm('Delete this goal and unlink all tasks?')) {
                                        deleteGoal.mutate(goal.id);
                                        window.location.href = "/goals";
                                    }
                                }}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {goal.description && (
                            <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
                                <p className="text-lg leading-relaxed text-foreground/80">{goal.description}</p>
                            </div>
                        )}

                        <div className="border border-border/40 rounded-xl bg-card overflow-hidden">
                            <div className="p-4 border-b border-border/40 flex justify-between items-center bg-secondary/10">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Goal Reward
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-3 h-3" />
                                        {goal.rewardImage ? "Change Photo" : "Upload Photo"}
                                    </Button>
                                    {goal.rewardImage && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={handleRemoveImage}
                                        >
                                            <X className="w-3 h-3" />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {goal.rewardImage ? (
                                <div className="p-6 flex flex-col items-center">
                                    <div className="relative rounded-lg overflow-hidden max-w-sm w-full shadow-lg border border-border/50">
                                        <img
                                            src={goal.rewardImage}
                                            alt="Reward"
                                            className={cn("w-full h-auto", goal.isCompleted ? "grayscale" : "")}
                                        />
                                        {goal.isCompleted && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                <div className="text-white text-center p-4">
                                                    <div className="bg-white/90 text-green-700 px-4 py-2 rounded-full text-lg font-bold inline-flex items-center gap-2 shadow-lg mb-2">
                                                        <span>🎉</span> Goal Achieved!
                                                    </div>
                                                    <p className="text-sm font-medium text-white/90">Enjoy your reward!</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
                                        This image represents your reward for completing this goal. Stay motivated!
                                    </p>
                                </div>
                            ) : (
                                <div className="p-12 flex flex-col items-center text-center text-muted-foreground">
                                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="text-sm max-w-xs">Upload a photo of something you want to buy or do when you complete this goal.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 pt-8">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Tasks linked to this goal
                        </h2>

                        {goalTodos.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-border/60 rounded-xl bg-secondary/5">
                                <p className="text-muted-foreground">No tasks linked to this goal yet.</p>
                                <Button variant="ghost" asChild className="mt-2 text-primary hover:text-primary/80"><a href="/todos">Go to Tasks to add some</a></Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {goalTodos.map((todo) => (
                                        <motion.div
                                            key={todo.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/40 shadow-sm"
                                        >
                                            <Checkbox
                                                checked={todo.isCompleted || false}
                                                onCheckedChange={() => toggleTodo(todo.id, todo.isCompleted || false)}
                                                className="w-5 h-5"
                                            />
                                            <div className="flex-1">
                                                <span className={cn(
                                                    "font-medium block transition-all",
                                                    todo.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                                                )}>
                                                    {todo.title}
                                                </span>
                                                {todo.date && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(todo.date), "MMM d, yyyy")}
                                                    </span>
                                                )}
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">
                                                {todo.priority}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
