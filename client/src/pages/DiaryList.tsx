import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/Sidebar";
import { useDiaryEntries, useDeleteDiaryEntry } from "@/hooks/use-diary";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Loader2, Plus, Calendar as CalendarIcon, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState } from "react";

export default function DiaryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: entries, isLoading } = useDiaryEntries();
  const deleteDiaryEntry = useDeleteDiaryEntry();

  const filteredEntries = entries?.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (e: React.MouseEvent, entryId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Delete this diary entry?')) {
      deleteDiaryEntry.mutate(entryId);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">My Entries</h1>
              <p className="text-muted-foreground mt-1">A collection of your memories.</p>
            </div>
            <Link href="/diary/new">
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> New Entry
              </Button>
            </Link>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search your memories..." 
              className="pl-10 bg-card border-border/60 focus:bg-background transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredEntries?.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p>No entries found.</p>
                </div>
              ) : (
                filteredEntries?.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <Link href={`/diary/${entry.id}`}>
                      <div className="bg-card hover:bg-secondary/20 p-6 rounded-2xl border border-border/40 hover:border-primary/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-3">
                          <h2 className="text-xl font-bold font-serif group-hover:text-primary transition-colors">
                            {entry.title}
                          </h2>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                            <CalendarIcon className="w-3 h-3" />
                            {format(new Date(entry.date), "MMMM do, yyyy")}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {entry.content}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, entry.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
