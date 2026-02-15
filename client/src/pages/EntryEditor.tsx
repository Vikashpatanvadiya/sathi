import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { useCreateDiaryEntry, useUpdateDiaryEntry, useDiaryEntry } from "@/hooks/use-diary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoodSelector, type Mood } from "@/components/MoodSelector";
import { format } from "date-fns";
import { Loader2, ArrowLeft, Save, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function EntryEditor() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/diary/:id");
  const isEditing = match && params?.id !== "new";
  const entryId = isEditing ? parseInt(params!.id) : 0;

  const { data: entry, isLoading: isLoadingEntry } = useDiaryEntry(entryId);
  const createMutation = useCreateDiaryEntry();
  const updateMutation = useUpdateDiaryEntry();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("neutral");
  const [date, setDate] = useState<Date>(new Date());

  // Load data when editing
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood as Mood);
      setDate(new Date(entry.date));
    }
  }, [entry]);

  const handleSave = async () => {
    if (!title || !content) return;

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: entryId,
          title,
          content,
          mood,
          date: date.toISOString(),
        });
      } else {
        await createMutation.mutateAsync({
          title,
          content,
          mood,
          date: date.toISOString(),
          notes: "",
        });
      }
      setLocation("/diary");
    } catch (error) {
      console.error(error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingEntry) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => setLocation("/diary")} className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isPending}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? "Update Entry" : "Save Entry"}
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Meta Controls */}
            <div className="flex flex-wrap gap-4 items-center border-b border-border/40 pb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-[240px]",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Editor Area */}
            <div className="space-y-6">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title your day..."
                className="text-3xl md:text-4xl font-serif font-bold border-none shadow-none px-0 placeholder:text-muted-foreground/50 focus-visible:ring-0 h-auto bg-transparent"
              />
              
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="How was your day? Write freely..."
                className="min-h-[500px] text-lg leading-relaxed resize-none border-none shadow-none px-0 focus-visible:ring-0 bg-transparent prose-editor"
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
