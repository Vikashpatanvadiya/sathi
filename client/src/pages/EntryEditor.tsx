import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { useCreateDiaryEntry, useUpdateDiaryEntry, useDiaryEntry } from "@/hooks/use-diary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoodSelector, type Mood } from "@/components/MoodSelector";
import { format } from "date-fns";
import { Loader2, ArrowLeft, Save, Calendar as CalendarIcon, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load data when editing
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood as Mood);
      setDate(new Date(entry.date));
      setImages(entry.images || []);
    }
  }, [entry]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than 5MB`,
            variant: "destructive",
          });
          continue;
        }

        // Convert to base64
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        newImages.push(base64);
      }

      setImages([...images, ...newImages]);
      toast({
        title: "Images added",
        description: `${newImages.length} image(s) added successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

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
          images,
        });
      } else {
        await createMutation.mutateAsync({
          title,
          content,
          mood,
          date: date.toISOString(),
          notes: "",
          images,
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

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                Add Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-border">
                    <img
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

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
