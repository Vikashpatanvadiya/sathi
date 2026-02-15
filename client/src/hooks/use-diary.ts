import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertDiaryEntry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useDiaryEntries(month?: string, year?: string) {
  const queryParams = month && year ? { month, year } : undefined;
  
  return useQuery({
    queryKey: [api.diary.list.path, queryParams],
    queryFn: async () => {
      // Build URL with query params if they exist
      const url = new URL(api.diary.list.path, window.location.origin);
      if (month) url.searchParams.append("month", month);
      if (year) url.searchParams.append("year", year);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch diary entries");
      return api.diary.list.responses[200].parse(await res.json());
    },
  });
}

export function useDiaryEntry(id: number) {
  return useQuery({
    queryKey: [api.diary.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.diary.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch entry");
      return api.diary.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertDiaryEntry) => {
      const res = await fetch(api.diary.create.path, {
        method: api.diary.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Validation failed");
        }
        throw new Error("Failed to create entry");
      }
      return api.diary.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diary.list.path] });
      toast({
        title: "Entry Saved",
        description: "Your thoughts have been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateDiaryEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertDiaryEntry>) => {
      const url = buildUrl(api.diary.update.path, { id });
      const res = await fetch(url, {
        method: api.diary.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update entry");
      return api.diary.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diary.list.path] });
      toast({
        title: "Entry Updated",
        description: "Your changes have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update entry.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.diary.delete.path, { id });
      const res = await fetch(url, {
        method: api.diary.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diary.list.path] });
      toast({
        title: "Deleted",
        description: "Entry removed from your diary.",
      });
    },
  });
}
