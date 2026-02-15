import { Sidebar } from "@/components/Sidebar";
import { useGoals, useCreateGoal } from "@/hooks/use-goals";
import { motion } from "framer-motion";
import { Loader2, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoalCard } from "@/components/GoalCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function Goals() {
  const { data: goals, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreate = async () => {
    if (!title) return;
    await createGoal.mutateAsync({
      title,
      description: desc,
      progress: 0,
      isCompleted: false,
    });
    setIsOpen(false);
    setTitle("");
    setDesc("");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" /> Goals
              </h1>
              <p className="text-muted-foreground mt-1">Track your long-term ambitions.</p>
            </div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" /> New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set a New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Goal Title</Label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Read 20 books" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={desc} 
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Why is this important?" 
                    />
                  </div>
                  <Button onClick={handleCreate} disabled={createGoal.isPending} className="w-full">
                    {createGoal.isPending ? "Creating..." : "Create Goal"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals?.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GoalCard goal={goal} />
                </motion.div>
              ))}
              
              {goals?.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-secondary/10">
                  <Target className="w-12 h-12 mb-4 opacity-50" />
                  <p>No goals set yet. Start your journey today!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
