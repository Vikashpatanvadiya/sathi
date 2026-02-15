import { Sidebar } from "@/components/Sidebar";
import { useDiaryEntries } from "@/hooks/use-diary";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Timeline() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Fetch entries for the selected month to show indicators
  const currentMonth = date ? format(date, "MM") : undefined;
  const currentYear = date ? format(date, "yyyy") : undefined;
  
  const { data: entries, isLoading } = useDiaryEntries(currentMonth, currentYear);

  // Find entry for selected date
  const selectedEntry = entries?.find(e => 
    date && format(new Date(e.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  // Dates that have entries for the calendar modifiers
  const entryDates = entries?.map(e => new Date(e.date)) || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Timeline</h1>
            <p className="text-muted-foreground mt-1">Look back on your journey.</p>
          </div>

          <div className="grid md:grid-cols-[auto_1fr] gap-8">
            <Card className="h-fit">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-0"
                  modifiers={{
                    hasEntry: entryDates
                  }}
                  modifiersStyles={{
                    hasEntry: { 
                      fontWeight: 'bold', 
                      textDecoration: 'underline',
                      color: 'var(--primary)'
                    }
                  }}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-xl font-serif font-semibold">
                {date ? format(date, "MMMM do, yyyy") : "Select a date"}
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
              ) : selectedEntry ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={selectedEntry.id}
                >
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl">{selectedEntry.title}</CardTitle>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{selectedEntry.mood}</span>
                        <span>•</span>
                        <span>{format(new Date(selectedEntry.date), "h:mm a")}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {selectedEntry.content}
                      </p>
                      <Link href={`/diary/${selectedEntry.id}`}>
                        <Button variant="outline" className="mt-4 gap-2">
                          Edit Entry <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
                  <p className="mb-4">No entry for this date.</p>
                  <Link href={`/diary/new`}>
                    <Button variant="default">Write Entry</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
