import { Link } from "wouter";
import { type Goal } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
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

export function GoalCard({ goal }: { goal: Goal }) {
  const deleteGoal = useDeleteGoal();
  const updateGoal = useUpdateGoal();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDesc, setEditDesc] = useState(goal.description || "");

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
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group border border-border/60 bg-card">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
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
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {goal.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
