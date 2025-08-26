import { useState, useMemo } from "react";
import { ProcessWithSteps } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Search, ArrowUpDown, Trash2, Loader2 } from "lucide-react";

interface DataTableProps {
  processes: ProcessWithSteps[];
  onViewProcess: (processId: string) => void;
  onEditProcess: (processId: string) => void;
  onDeleteProcess: (processId: string) => void;
  isDeleting?: boolean;
}

type SortField = "name" | "department" | "owner" | "status" | "lastRun";
type SortDirection = "asc" | "desc";

export default function DataTable({ processes, onViewProcess, onEditProcess, onDeleteProcess, isDeleting = false }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedProcesses = useMemo(() => {
    let filtered = processes.filter((process) => {
      const matchesSearch =
        process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" || process.department.toLowerCase() === selectedDepartment;

      const matchesStatus = selectedStatus === "all" || process.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "department":
          aValue = a.department;
          bValue = b.department;
          break;
        case "owner":
          aValue = a.owner;
          bValue = b.owner;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "lastRun":
          aValue = a.lastRun ? (typeof a.lastRun === 'string' ? new Date(a.lastRun).getTime() : a.lastRun.getTime()) : 0;
          bValue = b.lastRun ? (typeof b.lastRun === 'string' ? new Date(b.lastRun).getTime() : b.lastRun.getTime()) : 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [processes, searchQuery, selectedDepartment, selectedStatus, sortField, sortDirection]);

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

  const getDepartmentBadgeColor = (department: string) => {
    switch (department.toLowerCase()) {
      case "compliance":
        return "bg-blue-100 text-blue-800";
      case "regulatory affairs":
        return "bg-green-100 text-green-800";
      case "financial crimes":
        return "bg-red-100 text-red-800";
      case "risk management":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
                Search Workflows
              </label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Search by workflow name, department, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-processes"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
                Department
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger data-testid="select-department">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="regulatory affairs">Regulatory Affairs</SelectItem>
                  <SelectItem value="financial crimes">Financial Crimes</SelectItem>
                  <SelectItem value="risk management">Risk Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Workflows</CardTitle>
          <div className="text-sm text-slate-500">
            <span data-testid="text-processes-count">{filteredAndSortedProcesses.length}</span> workflows found
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleSort("name")}
                      data-testid="button-sort-name"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Workflow Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleSort("department")}
                      data-testid="button-sort-department"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Department</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleSort("owner")}
                      data-testid="button-sort-owner"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Owner</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleSort("status")}
                      data-testid="button-sort-status"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleSort("lastRun")}
                      data-testid="button-sort-lastrun"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Last Run</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredAndSortedProcesses.map((process) => (
                  <tr
                    key={process.id}
                    className="hover:bg-slate-50 transition-colors"
                    data-testid={`row-process-${process.id}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{process.name}</div>
                      <div className="text-sm text-slate-500">{process.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getDepartmentBadgeColor(process.department)}>
                        {process.department}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {process.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadgeColor(process.status)}>
                        {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatLastRun(process.lastRun)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Progress value={process.progress} className="w-20" />
                        <span className="text-xs text-slate-500">{process.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewProcess(process.id)}
                          className="text-blue-600 hover:text-blue-800"
                          data-testid={`button-view-process-${process.id}`}
                          title="View Process"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProcess(process.id)}
                          className="text-slate-500 hover:text-slate-700"
                          data-testid={`button-edit-process-${process.id}`}
                          title="Edit Process"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProcess(process.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isDeleting}
                          data-testid={`button-delete-process-${process.id}`}
                          title="Delete Process"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
