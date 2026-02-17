import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { diaryEntries, goals, todos } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

async function seedDatabase() {
  // Check if we have any users, if not, we can't really seed data that belongs to a user easily
  // But Replit Auth creates users on login. 
  // We can seed some generic data if we had a user, but since we rely on actual login,
  // we might just skip seeding or create a dummy user if we really wanted to.
  // For a personal diary, empty state is usually fine or better.
  // Let's just log that we are ready.
  console.log("Database ready.");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Diary Routes
  app.get(api.diary.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const { month, year } = req.query as { month?: string; year?: string };
    const entries = await storage.getDiaryEntries(userId, month, year);
    res.json(entries);
  });

  app.get(api.diary.get.path, isAuthenticated, async (req, res) => {
    const entry = await storage.getDiaryEntry(Number(req.params.id));
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    // Security check: ensure entry belongs to user
    const userId = (req.user as any).claims.sub;
    if (entry.userId !== userId) return res.status(401).json({ message: "Unauthorized" });
    res.json(entry);
  });

  app.post(api.diary.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.diary.create.input.parse(req.body);
      const entryData = {
        ...input,
        date: new Date(input.date),
        userId,
      };
      const entry = await storage.createDiaryEntry(entryData);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.patch(api.diary.update.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const id = Number(req.params.id);

      const existing = await storage.getDiaryEntry(id);
      if (!existing) return res.status(404).json({ message: "Entry not found" });
      if (existing.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.diary.update.input.parse(req.body);
      const updates = { ...input };
      if (input.date) {
        updates.date = new Date(input.date);
      }

      const updated = await storage.updateDiaryEntry(id, updates);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.diary.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const id = Number(req.params.id);

    const existing = await storage.getDiaryEntry(id);
    if (!existing) return res.status(404).json({ message: "Entry not found" });
    if (existing.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

    await storage.deleteDiaryEntry(id);
    res.status(204).send();
  });

  // Goals Routes
  app.get(api.goals.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const goals = await storage.getGoals(userId);
    res.json(goals);
  });

  app.post(api.goals.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.goals.create.input.parse(req.body);
      const goalData = {
        ...input,
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
        userId,
      };
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.goals.update.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const id = Number(req.params.id);

      const existing = await db.select().from(goals).where(eq(goals.id, id)).then(res => res[0]);
      if (!existing) return res.status(404).json({ message: "Goal not found" });
      if (existing.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.goals.update.input.parse(req.body);
      const updates = { ...input };
      if (input.targetDate) updates.targetDate = new Date(input.targetDate);

      const updated = await storage.updateGoal(id, updates);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.delete(api.goals.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const id = Number(req.params.id);
    const existing = await db.select().from(goals).where(eq(goals.id, id)).then(res => res[0]);
    if (!existing) return res.status(404).json({ message: "Goal not found" });
    if (existing.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

    await storage.deleteGoal(id);
    res.status(204).send();
  });

  // Todos Routes
  app.get(api.todos.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const { date } = req.query as { date?: string };
    const todos = await storage.getTodos(userId, date);
    res.json(todos);
  });

  app.post(api.todos.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.todos.create.input.parse(req.body);

      const todoData = {
        ...input,
        date: input.date ? new Date(input.date) : undefined,
        userId,
      };

      const todo = await storage.createTodo(todoData);

      res.status(201).json(todo);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.patch(api.todos.update.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const id = Number(req.params.id);

      const existing = await db.select().from(todos).where(eq(todos.id, id)).then(res => res[0]);
      if (!existing) return res.status(404).json({ message: "Todo not found" });
      if (existing.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.todos.update.input.parse(req.body);
      const updates = { ...input };
      if (input.date) updates.date = new Date(input.date);

      const updated = await storage.updateTodo(id, updates);

      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.delete(api.todos.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const id = Number(req.params.id);
    const existing = await db.select().from(todos).where(eq(todos.id, id)).then(res => res[0]);
    if (!existing) return res.status(404).json({ message: "Todo not found" });
    if (existing.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

    await storage.deleteTodo(id);

    res.status(204).send();
  });

  await seedDatabase();

  return httpServer;
}
