import { db } from "./db";
import {
  diaryEntries,
  goals,
  todos,
  type InsertDiaryEntry,
  type InsertGoal,
  type InsertTodo,
  type DiaryEntry,
  type Goal,
  type Todo,
} from "@shared/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Diary
  getDiaryEntries(userId: string, month?: string, year?: string): Promise<DiaryEntry[]>;
  getDiaryEntry(id: number): Promise<DiaryEntry | undefined>;
  createDiaryEntry(entry: InsertDiaryEntry & { userId: string }): Promise<DiaryEntry>;
  updateDiaryEntry(id: number, updates: Partial<InsertDiaryEntry>): Promise<DiaryEntry>;
  deleteDiaryEntry(id: number): Promise<void>;

  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal & { userId: string }): Promise<Goal>;
  updateGoal(id: number, updates: Partial<InsertGoal>): Promise<Goal>;
  deleteGoal(id: number): Promise<void>;

  // Todos
  getTodos(userId: string, date?: string): Promise<Todo[]>;
  createTodo(todo: InsertTodo & { userId: string }): Promise<Todo>;
  updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {

  // Diary
  async getDiaryEntries(userId: string, month?: string, year?: string): Promise<DiaryEntry[]> {
    let query = db.select().from(diaryEntries).where(eq(diaryEntries.userId, userId)).orderBy(desc(diaryEntries.date));
    
    // Simple filtering logic if needed (drizzle specific date filtering might be better done with sql operator)
    // For now, returning all and letting frontend or refined query handle strict date filtering if simple isn't enough.
    // Ideally we would use `between` or sql`date_trunc(...)`
    
    return await query;
  }

  async getDiaryEntry(id: number): Promise<DiaryEntry | undefined> {
    const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id));
    return entry;
  }

  async createDiaryEntry(entry: InsertDiaryEntry & { userId: string }): Promise<DiaryEntry> {
    const [created] = await db.insert(diaryEntries).values(entry).returning();
    return created;
  }

  async updateDiaryEntry(id: number, updates: Partial<InsertDiaryEntry>): Promise<DiaryEntry> {
    const [updated] = await db
      .update(diaryEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(diaryEntries.id, id))
      .returning();
    return updated;
  }

  async deleteDiaryEntry(id: number): Promise<void> {
    await db.delete(diaryEntries).where(eq(diaryEntries.id, id));
  }

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
  }

  async createGoal(goal: InsertGoal & { userId: string }): Promise<Goal> {
    const [created] = await db.insert(goals).values(goal).returning();
    return created;
  }

  async updateGoal(id: number, updates: Partial<InsertGoal>): Promise<Goal> {
    const [updated] = await db.update(goals).set(updates).where(eq(goals.id, id)).returning();
    return updated;
  }

  async deleteGoal(id: number): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  // Todos
  async getTodos(userId: string, date?: string): Promise<Todo[]> {
    if (date) {
      // Filter by specific date (start and end of day)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      console.log('Filtering todos for date:', date);
      console.log('Start:', startOfDay, 'End:', endOfDay);
      
      return await db
        .select()
        .from(todos)
        .where(
          and(
            eq(todos.userId, userId),
            gte(todos.date, startOfDay),
            lte(todos.date, endOfDay)
          )
        )
        .orderBy(desc(todos.createdAt));
    }
    
    // If no date provided, return all todos
    return await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.createdAt));
  }

  async createTodo(todo: InsertTodo & { userId: string }): Promise<Todo> {
    const [created] = await db.insert(todos).values(todo).returning();
    return created;
  }

  async updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo> {
    const [updated] = await db.update(todos).set(updates).where(eq(todos.id, id)).returning();
    return updated;
  }

  async deleteTodo(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }
}

export const storage = new DatabaseStorage();
