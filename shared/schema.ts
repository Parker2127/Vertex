import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const processes = pgTable("processes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  department: text("department").notNull(),
  owner: text("owner").notNull(),
  status: text("status").notNull(), // 'active', 'paused', 'completed', 'overdue'
  lastRun: timestamp("last_run").defaultNow(),
  progress: integer("progress").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

export const processSteps = pgTable("process_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  processId: varchar("process_id").references(() => processes.id),
  name: text("name").notNull(),
  description: text("description"),
  assignee: text("assignee"),
  estimatedTime: text("estimated_time"),
  isComplete: boolean("is_complete").default(false),
  order: integer("order").notNull(),
});

// Relations
export const processesRelations = relations(processes, ({ many }) => ({
  steps: many(processSteps),
}));

export const processStepsRelations = relations(processSteps, ({ one }) => ({
  process: one(processes, {
    fields: [processSteps.processId],
    references: [processes.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProcessSchema = createInsertSchema(processes).omit({
  id: true,
  createdAt: true,
  lastRun: true,
});

export const insertProcessStepSchema = createInsertSchema(processSteps).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Process = typeof processes.$inferSelect;
export type ProcessStep = typeof processSteps.$inferSelect;
export type InsertProcess = z.infer<typeof insertProcessSchema>;
export type InsertProcessStep = z.infer<typeof insertProcessStepSchema>;

// Frontend types for combined data
export interface ProcessWithSteps extends Process {
  steps: ProcessStep[];
}

export interface DashboardMetrics {
  totalProcesses: number;
  completedTasks: number;
  overdueTasks: number;
  avgCompletionTime: string;
}

export interface WeeklyTaskData {
  week: string;
  completed: number;
  overdue: number;
}

export interface RecentActivity {
  id: string;
  description: string;
  user: string;
  timestamp: string;
  type: 'completed' | 'started' | 'paused';
}
