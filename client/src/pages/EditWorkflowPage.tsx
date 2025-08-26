import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import WorkflowForm from "../components/WorkflowForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProcessDetailSkeleton } from "@/components/LoadingSkeleton";

export default function EditWorkflowPage() {
  const { processId } = useParams<{ processId: string }>();
  const [, setLocation] = useLocation();

  const { data: process, isLoading, error } = useQuery({
    queryKey: ["/api/processes", processId],
    queryFn: async () => {
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

  if (isLoading) {
    return <ProcessDetailSkeleton />;
  }

  if (error || !process) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/processes")}
            className="text-slate-600 hover:text-slate-900"
            data-testid="button-back-to-processes"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Processes
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Workflow</CardTitle>
          <p className="text-sm text-slate-600">
            Update the workflow details and modify the process steps as needed.
          </p>
        </CardHeader>
        <CardContent>
          <WorkflowForm 
            initialData={{
              name: process.name,
              description: process.description,
              department: process.department,
              owner: process.owner,
              status: process.status,
              steps: process.steps || []
            }}
            processId={processId}
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}