import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertGoal } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useGoals() {
  return useQuery({
    queryKey: [api.goals.list.path],
    queryFn: async () => {
      const res = await fetch(api.goals.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch goals");
      return api.goals.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGoal) => {
      const res = await fetch(api.goals.create.path, {
        method: api.goals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create goal");
      return api.goals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path] });
      toast({
        title: "Goal Set",
        description: "Keep pushing forward!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create goal.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertGoal>) => {
      const url = buildUrl(api.goals.update.path, { id });
      const res = await fetch(url, {
        method: api.goals.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update goal");
      return api.goals.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path] });
      toast({
        title: "Goal Updated",
        description: "Progress saved.",
      });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.goals.delete.path, { id });
      const res = await fetch(url, {
        method: api.goals.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete goal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path] });
      toast({
        title: "Goal Deleted",
        description: "Goal removed successfully.",
      });
    },
  });
}
