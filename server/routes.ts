import { Express } from "express";
import { insertProcessSchema, insertProcessStepSchema } from "@shared/schema";
import { storage } from "./storage";

export function setupRoutes(app: Express) {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Process routes
  app.get("/api/processes", async (req, res) => {
    try {
      const processes = await storage.getProcesses();
      res.json(processes);
    } catch (error) {
      console.error("Error fetching processes:", error);
      res.status(500).json({ error: "Failed to fetch processes" });
    }
  });

  app.get("/api/processes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const process = await storage.getProcess(id);
      
      if (!process) {
        return res.status(404).json({ error: "Process not found" });
      }
      
      res.json(process);
    } catch (error) {
      console.error("Error fetching process:", error);
      res.status(500).json({ error: "Failed to fetch process" });
    }
  });

  app.post("/api/processes", async (req, res) => {
    try {
      const processData = insertProcessSchema.parse(req.body);
      const process = await storage.createProcess(processData);
      res.status(201).json(process);
    } catch (error: any) {
      console.error("Error creating process:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid process data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create process" });
    }
  });

  app.put("/api/processes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertProcessSchema.partial().parse(req.body);
      const process = await storage.updateProcess(id, updates);
      
      if (!process) {
        return res.status(404).json({ error: "Process not found" });
      }
      
      res.json(process);
    } catch (error: any) {
      console.error("Error updating process:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid process data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update process" });
    }
  });

  app.delete("/api/processes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProcess(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Process not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting process:", error);
      res.status(500).json({ error: "Failed to delete process" });
    }
  });

  // Process step routes
  app.post("/api/processes/:processId/steps", async (req, res) => {
    try {
      const { processId } = req.params;
      const stepData = { ...req.body, processId };
      const validatedData = insertProcessStepSchema.parse(stepData);
      const step = await storage.createProcessStep(validatedData);
      res.status(201).json(step);
    } catch (error: any) {
      console.error("Error creating process step:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid step data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create process step" });
    }
  });

  app.put("/api/steps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertProcessStepSchema.partial().parse(req.body);
      const step = await storage.updateProcessStep(id, updates);
      
      if (!step) {
        return res.status(404).json({ error: "Process step not found" });
      }
      
      res.json(step);
    } catch (error: any) {
      console.error("Error updating process step:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid step data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update process step" });
    }
  });

  app.patch("/api/processes/:processId/steps/:stepId/toggle", async (req, res) => {
    try {
      const { stepId } = req.params;
      const step = await storage.getProcessStep(stepId);
      
      if (!step) {
        return res.status(404).json({ error: "Process step not found" });
      }
      
      const updatedStep = await storage.updateProcessStep(stepId, {
        isComplete: !step.isComplete
      });
      
      res.json(updatedStep);
    } catch (error) {
      console.error("Error toggling process step:", error);
      res.status(500).json({ error: "Failed to toggle process step" });
    }
  });

  app.delete("/api/steps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProcessStep(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Process step not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting process step:", error);
      res.status(500).json({ error: "Failed to delete process step" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const allProcesses = await storage.getProcesses();
      
      const totalProcesses = allProcesses.length;
      const activeProcesses = allProcesses.filter(p => p.status === "active").length;
      const completedProcesses = allProcesses.filter(p => p.status === "completed").length;
      const overdueProcesses = allProcesses.filter(p => p.status === "overdue").length;
      
      // Calculate completed tasks (steps)
      const completedTasks = allProcesses.reduce((acc, process) => {
        const completedSteps = process.steps.filter(step => step.isComplete).length;
        return acc + completedSteps;
      }, 0);
      
      const totalTasks = allProcesses.reduce((acc, process) => {
        return acc + process.steps.length;
      }, 0);
      
      const avgCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      res.json({
        totalProcesses,
        activeProcesses,
        completedProcesses,
        overdueProcesses,
        completedTasks,
        totalTasks,
        avgCompletionRate,
      });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });
}