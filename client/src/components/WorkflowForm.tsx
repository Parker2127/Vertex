import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProcessSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

// Form schema that extends the base process schema to include steps
const workflowFormSchema = insertProcessSchema.extend({
  steps: z.array(z.object({
    name: z.string().min(1, "Step name is required"),
    description: z.string().optional(),
    assignee: z.string().min(1, "Assignee is required"),
    estimatedTime: z.string().min(1, "Estimated time is required"),
    order: z.number().min(1),
  })).min(1, "At least one step is required"),
});

type WorkflowFormData = z.infer<typeof workflowFormSchema>;

interface WorkflowFormProps {
  onSubmit?: (data: WorkflowFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<WorkflowFormData>;
  processId?: string;
  isEditing?: boolean;
}

const departments = [
  { value: "compliance", label: "Compliance" },
  { value: "regulatory affairs", label: "Regulatory Affairs" },
  { value: "financial crimes", label: "Financial Crimes" },
  { value: "risk management", label: "Risk Management" },
  { value: "operations", label: "Operations" },
  { value: "audit", label: "Audit" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

export default function WorkflowForm({ onSubmit, onCancel, isLoading = false, initialData, processId, isEditing = false }: WorkflowFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      department: initialData?.department || "",
      owner: initialData?.owner || "",
      status: initialData?.status || "active",
      progress: initialData?.progress || 0,
      steps: initialData?.steps || [
        {
          name: "",
          description: "",
          assignee: "",
          estimatedTime: "",
          order: 1,
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const createMutation = useMutation({
    mutationFn: async (data: WorkflowFormData) => {
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          department: data.department,
          owner: data.owner,
          status: data.status,
          progress: 0,
        }),
      });
      if (!response.ok) throw new Error("Failed to create process");
      return response.json();
    },
    onSuccess: async (newProcess, data) => {
      // Create steps for the new process
      for (const step of data.steps) {
        await fetch(`/api/processes/${newProcess.id}/steps`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(step),
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      toast({
        title: "Success",
        description: "Workflow created successfully!",
      });
      setLocation("/processes");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: WorkflowFormData) => {
      const response = await fetch(`/api/processes/${processId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          department: data.department,
          owner: data.owner,
          status: data.status,
        }),
      });
      if (!response.ok) throw new Error("Failed to update process");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/processes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/processes", processId] });
      toast({
        title: "Success",
        description: "Workflow updated successfully!",
      });
      setLocation(`/processes/${processId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: WorkflowFormData) => {
    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(data);
        toast({
          title: "Success",
          description: "Workflow created successfully",
        });
      } catch (error) {
        console.error("Form submission error:", error);
        toast({
          title: "Error",
          description: "Failed to create workflow. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addStep = () => {
    append({
      name: "",
      description: "",
      assignee: "",
      estimatedTime: "",
      order: fields.length + 1,
    });
  };

  const removeStep = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Update order for remaining steps
      fields.forEach((_, i) => {
        if (i > index) {
          form.setValue(`steps.${i}.order`, i);
        }
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900">
          {initialData ? "Edit Workflow" : "Create New Compliance Workflow"}
        </CardTitle>
        <p className="text-sm text-slate-600">
          Define a new regulatory compliance workflow with step-by-step procedures
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workflow Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., New Account KYC Verification"
                          {...field}
                          data-testid="input-workflow-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Process Owner *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Sarah Mitchell"
                          {...field}
                          data-testid="input-workflow-owner"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose and scope of this compliance workflow..."
                        className="min-h-[80px]"
                        {...field}
                        value={field.value || ""}
                        data-testid="textarea-workflow-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-workflow-department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-workflow-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Workflow Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900">Workflow Steps</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                  data-testid="button-add-step"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900">Step {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(index)}
                          data-testid={`button-remove-step-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`steps.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Step Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Collect Entity Documentation"
                                {...field}
                                data-testid={`input-step-name-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`steps.${index}.assignee`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignee *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Compliance Team"
                                {...field}
                                data-testid={`input-step-assignee-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name={`steps.${index}.estimatedTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Time *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 45 minutes"
                                {...field}
                                data-testid={`input-step-time-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`steps.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what needs to be done in this step..."
                              className="min-h-[60px]"
                              {...field}
                              value={field.value || ""}
                              data-testid={`textarea-step-description-${index}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Card>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
                data-testid="button-cancel-workflow"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                data-testid="button-submit-workflow"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Creating..." : initialData ? "Update Workflow" : "Create Workflow"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}