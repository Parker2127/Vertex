import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { queryClient } from "./lib/queryClient";
import { store } from "./store";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProcessLibraryPage from "./pages/ProcessLibraryPage.tsx";
import ProcessExecutionPage from "./pages/ProcessExecutionPage.tsx";
import CreateWorkflowPage from "./pages/CreateWorkflowPage.tsx";
import EditWorkflowPage from "./pages/EditWorkflowPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import NotFound from "@/pages/not-found";
import { LoadingSpinner } from "@/components/LoadingSpinner";

function Router() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-3">Loading Vertex</h3>
          <p className="text-sm text-slate-600 max-w-md">Please wait while we initialize the application...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={LandingPage} />
        <Route component={LandingPage} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/processes" component={ProcessLibraryPage} />
        <Route path="/processes/new" component={CreateWorkflowPage} />
        <Route path="/processes/:processId/edit" component={EditWorkflowPage} />
        <Route path="/processes/:processId" component={ProcessExecutionPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  useEffect(() => {
    document.title = "Vertex | FinTech Compliance Dashboard";
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
