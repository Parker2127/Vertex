import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import DataTable from "../components/DataTable";
import { ProcessTableSkeleton } from "@/components/LoadingSkeleton";

export default function ProcessLibraryPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: processes = [], isLoading } = useQuery({
    queryKey: ["/api/processes"],
    queryFn: async () => {
      const response = await fetch("/api/processes");
      if (!response.ok) {
        throw new Error("Failed to fetch processes");
      }
      return response.json();
    },
  });

  const handleViewProcess = (processId: string) => {
    setLocation(`/processes/${processId}`);
  };

  const handleEditProcess = (processId: string) => {
    setLocation(`/processes/${processId}/edit`);
  };

  const handleCreateWorkflow = () => {
    setLocation("/processes/new");
  };

  const deleteProcessMutation = useMutation({
    mutationFn: async (processId: string) => {
      const response = await fetch(`/api/processes/${processId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete process");
      }
      // Handle 204 No Content response (successful deletion has no body)
      if (response.status === 204) {
        return { success: true };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Process Deleted",
        description: "The compliance workflow has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the process. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteProcess = (processId: string) => {
    if (window.confirm("Are you sure you want to delete this compliance workflow? This action cannot be undone.")) {
      deleteProcessMutation.mutate(processId);
    }
  };

  if (isLoading) {
    return <ProcessTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Compliance Workflows</h2>
          <p className="mt-1 text-sm text-slate-600">Manage and monitor regulatory compliance processes and procedures</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={handleCreateWorkflow}
          data-testid="button-new-process"
        >
          <Plus className="mr-2" size={16} />
          New Workflow
        </Button>
      </div>

      {/* Data Table */}
      <DataTable 
        processes={processes} 
        onViewProcess={handleViewProcess} 
        onEditProcess={handleEditProcess} 
        onDeleteProcess={handleDeleteProcess}
        isDeleting={deleteProcessMutation.isPending}
      />
    </div>
  );
}
