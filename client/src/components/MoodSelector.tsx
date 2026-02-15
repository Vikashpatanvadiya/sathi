import { cn } from "@/lib/utils";
import { Smile, Frown, Meh, Zap, Coffee, CloudRain } from "lucide-react";

export type Mood = "happy" | "sad" | "neutral" | "productive" | "tired" | "anxious";

const moods: { value: Mood; label: string; icon: any; color: string }[] = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-green-500" },
  { value: "productive", label: "Productive", icon: Zap, color: "text-yellow-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-blue-400" },
  { value: "tired", label: "Tired", icon: Coffee, color: "text-amber-700" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-indigo-400" },
  { value: "anxious", label: "Anxious", icon: CloudRain, color: "text-slate-500" },
];

interface MoodSelectorProps {
  value: string;
  onChange: (value: Mood) => void;
  className?: string;
}

export function MoodSelector({ value, onChange, className }: MoodSelectorProps) {
  return (
    <div className={cn("grid grid-cols-3 sm:grid-cols-6 gap-3", className)}>
      {moods.map((mood) => {
        const isSelected = value === mood.value;
        const Icon = mood.icon;
        
        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2",
              isSelected 
                ? "border-primary bg-primary/5 shadow-md scale-105" 
                : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
            )}
          >
            <Icon 
              className={cn(
                "w-6 h-6 transition-colors",
                isSelected ? mood.color : "text-muted-foreground"
              )} 
            />
            <span className={cn(
              "text-xs font-medium",
              isSelected ? "text-foreground" : "text-muted-foreground"
            )}>
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
