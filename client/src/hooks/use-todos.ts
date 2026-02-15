import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTodo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTodos(date?: string) {
  return useQuery({
    queryKey: [api.todos.list.path, date],
    queryFn: async () => {
      const url = new URL(api.todos.list.path, window.location.origin);
      if (date) url.searchParams.append("date", date);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch todos");
      return api.todos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTodo) => {
      const res = await fetch(api.todos.create.path, {
        method: api.todos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create todo");
      return api.todos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path] });
      toast({ title: "Task Added", description: "Added to your list." });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertTodo>) => {
      const url = buildUrl(api.todos.update.path, { id });
      const res = await fetch(url, {
        method: api.todos.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update todo");
      return api.todos.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.todos.delete.path, { id });
      const res = await fetch(url, {
        method: api.todos.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete todo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path] });
      toast({ title: "Task Deleted" });
    },
  });
}
