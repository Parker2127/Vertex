import { 
  type User, 
  type InsertUser, 
  type Process, 
  type ProcessStep, 
  type InsertProcess, 
  type InsertProcessStep,
  type ProcessWithSteps 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Process methods
  getProcesses(): Promise<ProcessWithSteps[]>;
  getProcess(id: string): Promise<ProcessWithSteps | undefined>;
  createProcess(process: InsertProcess): Promise<Process>;
  updateProcess(id: string, updates: Partial<InsertProcess>): Promise<Process | undefined>;
  deleteProcess(id: string): Promise<boolean>;
  
  // Process step methods
  getProcessStep(id: string): Promise<ProcessStep | undefined>;
  createProcessStep(step: InsertProcessStep): Promise<ProcessStep>;
  updateProcessStep(id: string, updates: Partial<InsertProcessStep>): Promise<ProcessStep | undefined>;
  deleteProcessStep(id: string): Promise<boolean>;
  toggleStepComplete(processId: string, stepId: string): Promise<ProcessStep | undefined>;
}

import { db } from "./db";
import { users, processes, processSteps } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Process methods
  async getProcesses(): Promise<ProcessWithSteps[]> {
    const processesWithSteps = await db.query.processes.findMany({
      with: {
        steps: {
          orderBy: (steps: any, { asc }: any) => [asc(steps.order)]
        }
      }
    });
    
    return processesWithSteps.map(process => ({
      ...process,
      steps: process.steps || []
    }));
  }

  async getProcess(id: string): Promise<ProcessWithSteps | undefined> {
    const process = await db.query.processes.findFirst({
      where: eq(processes.id, id),
      with: {
        steps: {
          orderBy: (steps: any, { asc }: any) => [asc(steps.order)]
        }
      }
    });
    
    if (!process) return undefined;
    
    return {
      ...process,
      steps: process.steps || []
    };
  }

  async createProcess(insertProcess: InsertProcess): Promise<Process> {
    const [process] = await db
      .insert(processes)
      .values(insertProcess)
      .returning();
    return process;
  }

  async updateProcess(id: string, updates: Partial<InsertProcess>): Promise<Process | undefined> {
    const [process] = await db
      .update(processes)
      .set(updates)
      .where(eq(processes.id, id))
      .returning();
    return process || undefined;
  }

  async deleteProcess(id: string): Promise<boolean> {
    // First delete all related steps
    await db.delete(processSteps).where(eq(processSteps.processId, id));
    
    // Then delete the process
    const result = await db.delete(processes).where(eq(processes.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Process step methods
  async createProcessStep(step: InsertProcessStep): Promise<ProcessStep> {
    const [processStep] = await db
      .insert(processSteps)
      .values(step)
      .returning();
    return processStep;
  }

  async getProcessStep(id: string): Promise<ProcessStep | undefined> {
    const [step] = await db.select().from(processSteps).where(eq(processSteps.id, id));
    return step || undefined;
  }

  async updateProcessStep(id: string, updates: Partial<InsertProcessStep>): Promise<ProcessStep | undefined> {
    const [step] = await db
      .update(processSteps)
      .set(updates)
      .where(eq(processSteps.id, id))
      .returning();
    return step || undefined;
  }

  async deleteProcessStep(id: string): Promise<boolean> {
    const result = await db.delete(processSteps).where(eq(processSteps.id, id));
    return (result.rowCount || 0) > 0;
  }

  async toggleStepComplete(processId: string, stepId: string): Promise<ProcessStep | undefined> {
    const [step] = await db
      .update(processSteps)
      .set({ 
        isComplete: sql`NOT ${processSteps.isComplete}` 
      })
      .where(eq(processSteps.id, stepId))
      .returning();
    
    if (step) {
      // Update process progress
      const allSteps = await db
        .select()
        .from(processSteps)
        .where(eq(processSteps.processId, processId));
      
      const completedSteps = allSteps.filter(s => s.isComplete).length;
      const progress = Math.round((completedSteps / allSteps.length) * 100);
      
      await db
        .update(processes)
        .set({ progress })
        .where(eq(processes.id, processId));
    }
    
    return step || undefined;
  }
}

export const storage = new DatabaseStorage();
