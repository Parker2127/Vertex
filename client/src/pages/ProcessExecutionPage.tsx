import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessDetailSkeleton } from "@/components/LoadingSkeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, Pause, Save, Check, CheckCircle, Clock, Circle, Loader2 } from "lucide-react";

export default function ProcessExecutionPage() {
  const { processId } = useParams<{ processId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // All hooks must be called at the top level before any conditional returns
  const { data: selectedProcess, isLoading } = useQuery({
    queryKey: ["/api/processes", processId],
    queryFn: async () => {
      if (!processId) return null;
      const response = await fetch(`/api/processes/${processId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch process");
      }
      return response.json();
    },
    enabled: !!processId,
  });

  const toggleStepMutation = useMutation({
    mutationFn: async ({ stepId }: { stepId: string }) => {
      if (!processId) throw new Error("No process ID");
      const response = await fetch(`/api/processes/${processId}/steps/${stepId}/toggle`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to toggle step");
      }
      return response.json();
    },
    onSuccess: () => {
      if (processId) {
        queryClient.invalidateQueries({ queryKey: ["/api/processes", processId] });
        queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update step. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeProcessMutation = useMutation({
    mutationFn: async () => {
      if (!processId) throw new Error("No process ID");
      const response = await fetch(`/api/processes/${processId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", progress: 100 }),
      });
      if (!response.ok) throw new Error("Failed to complete process");
      return response.json();
    },
    onSuccess: () => {
      if (processId) {
        queryClient.invalidateQueries({ queryKey: ["/api/processes", processId] });
        queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      }
      toast({
        title: "Process Completed",
        description: "The workflow has been marked as completed successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete process. Please try again.",
        variant: "destructive",
      });
    },
  });

  const pauseProcessMutation = useMutation({
    mutationFn: async () => {
      if (!processId) throw new Error("No process ID");
      const response = await fetch(`/api/processes/${processId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paused" }),
      });
      if (!response.ok) throw new Error("Failed to pause process");
      return response.json();
    },
    onSuccess: () => {
      if (processId) {
        queryClient.invalidateQueries({ queryKey: ["/api/processes", processId] });
        queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      }
      toast({
        title: "Process Paused",
        description: "The workflow has been paused successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to pause process. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleToggleStep = (stepId: string) => {
    toggleStepMutation.mutate({ stepId });
  };

  const handleCompleteProcess = () => {
    completeProcessMutation.mutate();
  };

  const handlePauseProcess = () => {
    pauseProcessMutation.mutate();
  };

  const handleSaveProgress = () => {
    if (!selectedProcess || !processId) return;
    
    // Calculate progress based on completed steps
    const completedSteps = selectedProcess.steps.filter((step: { isComplete: boolean }) => step.isComplete).length;
    const totalSteps = selectedProcess.steps.length;
    const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    
    fetch(`/api/processes/${processId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/processes", processId] });
      queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      toast({
        title: "Progress Saved",
        description: `Progress updated to ${progress}%.`,
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    });
  };

  // Utility functions
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStepIcon = (step: { id: string; isComplete: boolean }) => {
    if (!selectedProcess) return <Circle className="text-slate-300" size={20} />;
    
    if (step.isComplete) {
      return <CheckCircle className="text-emerald-500" size={20} />;
    }
    
    // Check if this is the current step (first incomplete step)
    const currentStepIndex = selectedProcess.steps.findIndex((s: { isComplete: boolean }) => !s.isComplete);
    const stepIndex = selectedProcess.steps.findIndex((s: { id: string }) => s.id === step.id);
    
    if (stepIndex === currentStepIndex) {
      return <Clock className="text-blue-500" size={20} />;
    }
    
    return <Circle className="text-slate-300" size={20} />;
  };

  const getStepStatus = (step: { id: string; isComplete: boolean }) => {
    if (!selectedProcess) return { label: "Pending", color: "bg-slate-100 text-slate-600" };
    
    if (step.isComplete) {
      return { label: "Completed", color: "bg-emerald-100 text-emerald-800" };
    }
    
    const currentStepIndex = selectedProcess.steps.findIndex((s: { isComplete: boolean }) => !s.isComplete);
    const stepIndex = selectedProcess.steps.findIndex((s: { id: string }) => s.id === step.id);
    
    if (stepIndex === currentStepIndex) {
      return { label: "In Progress", color: "bg-blue-100 text-blue-800" };
    }
    
    return { label: "Pending", color: "bg-slate-100 text-slate-600" };
  };

  const formatLastRun = (date: Date | string | null) => {
    if (!date) return "Never";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  // Conditional rendering after all hooks
  if (isLoading) {
    return <ProcessDetailSkeleton />;
  }

  if (!selectedProcess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900 mb-2">Process Not Found</h3>
          <p className="text-sm text-slate-600 mb-4">The requested process could not be found.</p>
          <Button onClick={() => setLocation("/processes")}>Return to Process Library</Button>
        </div>
      </div>
    );
  }

  const allStepsComplete = selectedProcess.steps.every((step: { isComplete: boolean }) => step.isComplete);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500" data-testid="breadcrumb-navigation">
        <Link href="/processes" className="hover:text-slate-700">
          Process Library
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">{selectedProcess.name}</span>
      </nav>

      {/* Process Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900" data-testid="text-process-name">
                  {selectedProcess.name}
                </h2>
                <Badge className={getStatusBadgeColor(selectedProcess.status)}>
                  {selectedProcess.status.charAt(0).toUpperCase() + selectedProcess.status.slice(1)}
                </Badge>
              </div>
              <p className="text-slate-600 mb-4" data-testid="text-process-description">
                {selectedProcess.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-900">Department:</span>
                  <span className="ml-2 text-slate-600">{selectedProcess.department}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Owner:</span>
                  <span className="ml-2 text-slate-600">{selectedProcess.owner}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Last Run:</span>
                  <span className="ml-2 text-slate-600">{formatLastRun(selectedProcess.lastRun)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSaveProgress}
                variant="outline"
                className="bg-slate-50 border-slate-200 hover:bg-slate-100"
                data-testid="button-save-progress"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              {selectedProcess.status === "active" && !allStepsComplete && (
                <Button
                  onClick={handlePauseProcess}
                  variant="outline"
                  className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                  disabled={pauseProcessMutation.isPending}
                  data-testid="button-pause-process"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  {pauseProcessMutation.isPending ? "Pausing..." : "Pause"}
                </Button>
              )}
              {allStepsComplete && selectedProcess.status !== "completed" && (
                <Button
                  onClick={handleCompleteProcess}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={completeProcessMutation.isPending}
                  data-testid="button-complete-process"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {completeProcessMutation.isPending ? "Completing..." : "Complete Process"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Process Steps</span>
            <span className="text-sm font-normal text-slate-500">
              {selectedProcess.steps.filter((s: { isComplete: boolean }) => s.isComplete).length} of {selectedProcess.steps.length} completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-200">
            {selectedProcess.steps.map((step: any, index: number) => {
              const status = getStepStatus(step);
              return (
                <div key={step.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-sm font-medium text-slate-900" data-testid={`text-step-title-${step.id}`}>
                              {step.title}
                            </h4>
                            <Badge className={status.color} data-testid={`badge-step-status-${step.id}`}>
                              {status.label}
                            </Badge>
                          </div>
                          {step.description && (
                            <p className="mt-1 text-sm text-slate-600" data-testid={`text-step-description-${step.id}`}>
                              {step.description}
                            </p>
                          )}
                          {step.requirements && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-slate-700">Requirements:</span>
                              <p className="text-xs text-slate-600 mt-1">{step.requirements}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {toggleStepMutation.isPending ? (
                            <div className="flex items-center justify-center w-4 h-4">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            </div>
                          ) : (
                            <Checkbox
                              checked={step.isComplete}
                              onCheckedChange={() => handleToggleStep(step.id)}
                              disabled={toggleStepMutation.isPending}
                              data-testid={`checkbox-step-${step.id}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}