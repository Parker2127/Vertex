import { configureStore } from "@reduxjs/toolkit";
import processesReducer from "./slices/processesSlice";

export const store = configureStore({
  reducer: {
    processes: processesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['processes/loadProcesses/fulfilled', 'processes/loadDashboardData/fulfilled'],
        ignoredPaths: ['processes.processes', 'processes.dashboardMetrics', 'processes.recentActivities'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
