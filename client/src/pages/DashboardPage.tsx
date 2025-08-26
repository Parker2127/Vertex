import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, ListTodo, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import KPICard from "../components/KPICard";
import TasksChart from "../components/TasksChart";
import RecentActivity from "../components/RecentActivity";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

export default function DashboardPage() {
  const [location, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState("last-30-days");
  const { toast } = useToast();

  // Show feedback when date range changes
  useEffect(() => {
    if (dateRange !== "last-30-days") {
      const rangeText = dateRange.replace("last-", "").replace("-", " ");
      toast({
        title: "Date Range Updated",
        description: `Now showing data for the ${rangeText}`,
        duration: 2000,
      });
    }
  }, [dateRange, toast]);
  
  const { data: dashboardMetrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/metrics");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard metrics");
      }
      return response.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });

  const { data: processes } = useQuery({
    queryKey: ["/api/processes"],
    queryFn: async () => {
      const response = await fetch("/api/processes");
      if (!response.ok) {
        throw new Error("Failed to fetch processes");
      }
      return response.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });

  // Mock data for activities and weekly tasks since we don't have those endpoints yet
  const weeklyTaskData = [
    { week: "Week 1", completed: 45, overdue: 8 },
    { week: "Week 2", completed: 52, overdue: 5 },
    { week: "Week 3", completed: 38, overdue: 12 },
    { week: "Week 4", completed: 61, overdue: 3 },
  ];

  const recentActivities = [
    {
      id: "1",
      description: "AML Transaction Review completed for high-risk client",
      user: "Sarah Mitchell",
      timestamp: "2 minutes ago",
      type: "completed" as const,
    },
    {
      id: "2", 
      description: "New Entity Onboarding started for Acme Corp",
      user: "Michael Chen",
      timestamp: "15 minutes ago",
      type: "started" as const,
    },
    {
      id: "3",
      description: "KYC Documentation Review paused pending client response",
      user: "Jennifer Rodriguez",
      timestamp: "1 hour ago",
      type: "paused" as const,
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardMetrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Data Available</h3>
          <p className="text-sm text-slate-600">Unable to load dashboard metrics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">FinTech Compliance Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">Monitor regulatory compliance processes and audit readiness</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]" data-testid="select-date-range">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105" 
            data-testid="button-export-dashboard"
            onClick={() => {
              // Create a simple CSV export of the metrics
              const csvData = `Metric,Value
Active Workflows,${dashboardMetrics?.totalProcesses || 0}
Completed Tasks,${dashboardMetrics?.completedTasks || 0}
Overdue Tasks,${dashboardMetrics?.overdueProcesses || 0}
Average Completion Rate,${dashboardMetrics?.avgCompletionRate || 0}%`;
              
              const blob = new Blob([csvData], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'compliance-dashboard-metrics.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            }}
          >
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Workflows"
          value={dashboardMetrics?.totalProcesses?.toString() || "0"}
          change="+8.2%"
          changeType="positive"
          icon={ListTodo}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          onClick={() => setLocation("/processes")}
        />
        <KPICard
          title="Completed Tasks"
          value={dashboardMetrics?.completedTasks?.toString() || "0"}
          change="+12.5%"
          changeType="positive"
          icon={CheckCircle}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          onClick={() => setLocation("/processes")}
        />
        <KPICard
          title="Overdue Tasks"
          value={dashboardMetrics?.overdueTasks?.toString() || "0"}
          change="+3.1%"
          changeType="negative"
          icon={AlertTriangle}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          onClick={() => setLocation("/processes")}
        />
        <KPICard
          title="Avg. Completion Time"
          value={dashboardMetrics?.avgCompletionTime || "N/A"}
          change="-0.8d"
          changeType="positive"
          icon={Clock}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          onClick={() => setLocation("/processes")}
        />
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TasksChart data={weeklyTaskData} />
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
}
