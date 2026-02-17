import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export { users };
export { sessions } from "./models/auth";

export const diaryEntries = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood").notNull(), // happy, normal, sad, productive, etc.
  notes: text("notes"),
  images: jsonb("images").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").default(false),
  progress: integer("progress").default(0), // 0-100
  rewardImage: text("reward_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  goalId: integer("goal_id").references(() => goals.id),
  title: text("title").notNull(),
  date: timestamp("date"), // For daily tasks
  priority: text("priority").default("Medium"), // Low, Medium, High
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const diaryEntriesRelations = relations(diaryEntries, ({ one }) => ({
  user: one(users, {
    fields: [diaryEntries.userId],
    references: [users.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
  todos: many(todos),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
  goal: one(goals, {
    fields: [todos.goalId],
    references: [goals.id],
  }),
}));

// Schemas
export const insertDiaryEntrySchema = createInsertSchema(diaryEntries).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.coerce.date(),
  images: z.array(z.string()).optional(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  targetDate: z.coerce.date().optional(),
  rewardImage: z.string().optional().nullable(),
});

export const insertTodoSchema = createInsertSchema(todos).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  date: z.coerce.date().optional(),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  goalId: z.number().optional().nullable(),
});

// Types
export type DiaryEntry = typeof diaryEntries.$inferSelect;
export type InsertDiaryEntry = z.infer<typeof insertDiaryEntrySchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Todo = typeof todos.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
