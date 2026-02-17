import { Link } from "wouter";
import { type Goal } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Edit2, Sparkles, Trophy, PartyPopper } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useDeleteGoal, useUpdateGoal } from "@/hooks/use-goals";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

export function GoalCard({ goal }: { goal: Goal }) {
  const deleteGoal = useDeleteGoal();
  const updateGoal = useUpdateGoal();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDesc, setEditDesc] = useState(goal.description || "");
  const [showCelebration, setShowCelebration] = useState(false);

  const handleUpdate = () => {
    updateGoal.mutate({
      id: goal.id,
      title: editTitle,
      description: editDesc,
      isCompleted: goal.isCompleted,
    });
    setIsEditing(false);
  };

  const toggleComplete = (checked: boolean) => {
    updateGoal.mutate({
      id: goal.id,
      isCompleted: checked,
    });
    
    // Show celebration when completing a goal
    if (checked && !goal.isCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  return (
    <>
      <Card className={cn(
        "hover:shadow-lg transition-all duration-300 group border border-border/60 bg-card relative overflow-hidden",
        goal.isCompleted && "bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
      )}>
        {goal.isCompleted && (
          <div className="absolute top-2 right-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
        )}
        
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={goal.isCompleted || false}
              onCheckedChange={toggleComplete}
              className="mt-1"
            />
            <div className="space-y-1 flex-1">
              <Link href={`/goals/${goal.id}`}>
                <a className="block hover:opacity-80 transition-opacity">
                  <CardTitle className={cn(
                    "text-lg font-serif font-semibold leading-none tracking-tight",
                    goal.isCompleted && "line-through text-muted-foreground"
                  )}>
                    {goal.title}
                  </CardTitle>
                  {goal.targetDate && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Due {format(new Date(goal.targetDate), "MMM d, yyyy")}
                    </p>
                  )}
                </a>
              </Link>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Goal Title</Label>
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                  </div>
                  <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => deleteGoal.mutate(goal.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {goal.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 ml-9">
              {goal.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Simple Confetti Effect */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
                  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x: typeof window !== 'undefined' 
                    ? window.innerWidth / 2 + (Math.random() - 0.5) * 600 
                    : 500 + (Math.random() - 0.5) * 600,
                  y: typeof window !== 'undefined'
                    ? window.innerHeight / 2 + Math.random() * 400
                    : 300 + Math.random() * 400,
                  scale: 0,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  ease: "easeOut",
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
                    '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'
                  ][Math.floor(Math.random() * 8)],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
