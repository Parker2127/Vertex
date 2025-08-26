import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import WorkflowForm from "../components/WorkflowForm";
// import { apiRequest } from "../lib/queryClient";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface WorkflowFormData {
  name: string;
  description?: string;
  department: string;
  owner: string;
  status: string;
  progress: number;
  steps: Array<{
    name: string;
    description?: string;
    assignee: string;
    estimatedTime: string;
    order: number;
  }>;
}

export default function CreateWorkflowPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const createWorkflowMutation = useMutation({
    mutationFn: async (data: WorkflowFormData) => {
      // First create the process
      const processData = {
        name: data.name,
        description: data.description,
        department: data.department,
        owner: data.owner,
        status: data.status,
        progress: 0, // Always start at 0 for new workflows
        lastRun: new Date(),
      };

      const response = await fetch(`/api/processes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create process: ${response.statusText}`);
      }

      const process = await response.json();

      // Then create all the steps
      for (const step of data.steps) {
        const stepResponse = await fetch(`/api/processes/${process.id}/steps`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: step.name,
            description: step.description,
            assignee: step.assignee,
            estimatedTime: step.estimatedTime,
            order: step.order,
            isComplete: false,
          }),
        });

        if (!stepResponse.ok) {
          throw new Error(`Failed to create step: ${stepResponse.statusText}`);
        }
      }

      return process;
    },
    onSuccess: () => {
      // Invalidate processes cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      // Navigate back to processes page
      setLocation("/processes");
    },
  });

  const handleSubmit = async (data: WorkflowFormData) => {
    await createWorkflowMutation.mutateAsync(data);
  };

  const handleCancel = () => {
    setLocation("/processes");
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          data-testid="button-back-to-workflows"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Workflows
        </Button>
      </div>

      {/* Form */}
      <WorkflowForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createWorkflowMutation.isPending}
      />
    </div>
  );
}