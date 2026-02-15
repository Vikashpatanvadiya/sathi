import { type Goal } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useDeleteGoal, useUpdateGoal } from "@/hooks/use-goals";
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

export function GoalCard({ goal }: { goal: Goal }) {
  const deleteGoal = useDeleteGoal();
  const updateGoal = useUpdateGoal();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDesc, setEditDesc] = useState(goal.description || "");
  const [editProgress, setEditProgress] = useState(goal.progress || 0);

  const handleUpdate = () => {
    updateGoal.mutate({
      id: goal.id,
      title: editTitle,
      description: editDesc,
      progress: Number(editProgress),
      isCompleted: Number(editProgress) === 100,
    });
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group border border-border/60 bg-card">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-serif font-semibold leading-none tracking-tight">
            {goal.title}
          </CardTitle>
          {goal.targetDate && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due {format(new Date(goal.targetDate), "MMM d, yyyy")}
            </p>
          )}
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
                <div className="space-y-2">
                  <Label>Progress ({editProgress}%)</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
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
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {goal.description}
          </p>
        )}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Progress</span>
            <span>{goal.progress || 0}%</span>
          </div>
          <Progress value={goal.progress || 0} className="h-2 bg-secondary" />
        </div>
        {goal.isCompleted && (
          <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
