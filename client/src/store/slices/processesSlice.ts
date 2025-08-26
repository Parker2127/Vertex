import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProcessWithSteps, DashboardMetrics, WeeklyTaskData, RecentActivity } from "@shared/schema";
import {
  fetchProcesses,
  fetchDashboardMetrics,
  fetchWeeklyTaskData,
  fetchRecentActivities,
} from "../../lib/mockData";

interface ProcessesState {
  processes: ProcessWithSteps[];
  dashboardMetrics: DashboardMetrics | null;
  weeklyTaskData: WeeklyTaskData[];
  recentActivities: RecentActivity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProcessesState = {
  processes: [],
  dashboardMetrics: null,
  weeklyTaskData: [],
  recentActivities: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const loadProcesses = createAsyncThunk(
  "processes/loadProcesses",
  async () => {
    return await fetchProcesses();
  }
);

export const loadDashboardData = createAsyncThunk(
  "processes/loadDashboardData",
  async () => {
    const [metrics, weeklyData, activities] = await Promise.all([
      fetchDashboardMetrics(),
      fetchWeeklyTaskData(),
      fetchRecentActivities(),
    ]);
    return { metrics, weeklyData, activities };
  }
);

export const toggleStep = createAsyncThunk(
  "processes/toggleStep",
  async ({ processId, stepId }: { processId: string; stepId: string }) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { processId, stepId };
  }
);

export const completeProcess = createAsyncThunk(
  "processes/completeProcess",
  async (processId: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return processId;
  }
);

const processesSlice = createSlice({
  name: "processes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load processes
      .addCase(loadProcesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadProcesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.processes = action.payload;
      })
      .addCase(loadProcesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load processes";
      })
      // Load dashboard data
      .addCase(loadDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardMetrics = action.payload.metrics;
        state.weeklyTaskData = action.payload.weeklyData;
        state.recentActivities = action.payload.activities;
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load dashboard data";
      })
      // Toggle step
      .addCase(toggleStep.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleStep.fulfilled, (state, action) => {
        state.isLoading = false;
        const { processId, stepId } = action.payload;
        const process = state.processes.find((p) => p.id === processId);
        if (process) {
          const step = process.steps.find((s) => s.id === stepId);
          if (step) {
            step.isComplete = !step.isComplete;
            // Recalculate progress
            const completedSteps = process.steps.filter((s) => s.isComplete).length;
            process.progress = Math.round((completedSteps / process.steps.length) * 100);
          }
        }
      })
      .addCase(toggleStep.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to toggle step";
      })
      // Complete process
      .addCase(completeProcess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeProcess.fulfilled, (state, action) => {
        state.isLoading = false;
        const processId = action.payload;
        const process = state.processes.find((p) => p.id === processId);
        if (process) {
          process.status = "completed";
          process.progress = 100;
          process.steps.forEach((step) => {
            step.isComplete = true;
          });
        }
      })
      .addCase(completeProcess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to complete process";
      });
  },
});

export const { clearError } = processesSlice.actions;
export default processesSlice.reducer;
