import { ProcessWithSteps, DashboardMetrics, WeeklyTaskData, RecentActivity } from "@shared/schema";

export const mockProcesses: ProcessWithSteps[] = [
  {
    id: "1",
    name: "New Account KYC Verification",
    description: "Complete Know Your Customer verification for new institutional accounts",
    department: "Compliance",
    owner: "Sarah Mitchell",
    status: "active",
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    progress: 75,
    createdAt: new Date(),
    steps: [
      {
        id: "1-1",
        processId: "1",
        name: "Collect Entity Documentation",
        description: "Gather Articles of Incorporation, operating agreements, and regulatory filings",
        assignee: "Sarah Mitchell",
        estimatedTime: "45 minutes",
        isComplete: true,
        order: 1,
      },
      {
        id: "1-2",
        processId: "1",
        name: "Verify Beneficial Ownership",
        description: "Identify and verify all individuals owning 25% or more of the entity",
        assignee: "Michael Rodriguez",
        estimatedTime: "30 minutes",
        isComplete: true,
        order: 2,
      },
      {
        id: "1-3",
        processId: "1",
        name: "OFAC Sanctions Screening",
        description: "Screen entity and beneficial owners against OFAC and global sanctions lists",
        assignee: "Jennifer Chen",
        estimatedTime: "15 minutes",
        isComplete: true,
        order: 3,
      },
      {
        id: "1-4",
        processId: "1",
        name: "Risk Assessment Review",
        description: "Complete enhanced due diligence and assign risk rating",
        assignee: "David Kim",
        estimatedTime: "60 minutes",
        isComplete: false,
        order: 4,
      },
      {
        id: "1-5",
        processId: "1",
        name: "Compliance Approval",
        description: "Final review and approval by Chief Compliance Officer",
        assignee: "Amanda Foster",
        estimatedTime: "30 minutes",
        isComplete: false,
        order: 5,
      },
    ],
  },
  {
    id: "2",
    name: "Quarterly Regulatory Reporting",
    description: "Prepare and submit mandatory quarterly compliance reports to regulators",
    department: "Regulatory Affairs",
    owner: "Maria Santos",
    status: "paused",
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    progress: 45,
    createdAt: new Date(),
    steps: [
      {
        id: "2-1",
        processId: "2",
        name: "Data Collection & Validation",
        description: "Gather transaction data and validate accuracy for reporting period",
        assignee: "Data Analytics Team",
        estimatedTime: "8 hours",
        isComplete: true,
        order: 1,
      },
      {
        id: "2-2",
        processId: "2",
        name: "CFTC Form CPO-PQR Preparation",
        description: "Complete and review Commodity Pool Operator quarterly report",
        assignee: "Maria Santos",
        estimatedTime: "4 hours",
        isComplete: true,
        order: 2,
      },
      {
        id: "2-3",
        processId: "2",
        name: "SEC Form PF Review",
        description: "Prepare Private Fund Advisor reporting form for SEC submission",
        assignee: "Compliance Team",
        estimatedTime: "6 hours",
        isComplete: false,
        order: 3,
      },
      {
        id: "2-4",
        processId: "2",
        name: "Final Review & Submission",
        description: "CCO review and electronic submission to regulatory portals",
        assignee: "Amanda Foster",
        estimatedTime: "2 hours",
        isComplete: false,
        order: 4,
      },
    ],
  },
  {
    id: "3",
    name: "Anti-Money Laundering Investigation",
    description: "Investigate suspicious transaction patterns flagged by monitoring systems",
    department: "Financial Crimes",
    owner: "Robert Zhang",
    status: "overdue",
    lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    progress: 20,
    createdAt: new Date(),
    steps: [
      {
        id: "3-1",
        processId: "3",
        name: "Alert Triage & Assignment",
        description: "Review system-generated alert and assign to investigation team",
        assignee: "AML Operations",
        estimatedTime: "30 minutes",
        isComplete: true,
        order: 1,
      },
      {
        id: "3-2",
        processId: "3",
        name: "Transaction Pattern Analysis",
        description: "Analyze transaction history and identify unusual patterns",
        assignee: "Senior Investigator",
        estimatedTime: "4 hours",
        isComplete: false,
        order: 2,
      },
      {
        id: "3-3",
        processId: "3",
        name: "Customer Due Diligence Review",
        description: "Review customer profile and enhanced due diligence documentation",
        assignee: "Robert Zhang",
        estimatedTime: "2 hours",
        isComplete: false,
        order: 3,
      },
      {
        id: "3-4",
        processId: "3",
        name: "SAR Filing Decision",
        description: "Determine if Suspicious Activity Report filing is required",
        assignee: "BSA Officer",
        estimatedTime: "1 hour",
        isComplete: false,
        order: 4,
      },
    ],
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalProcesses: 47,
  completedTasks: 342,
  overdueTasks: 23,
  avgCompletionTime: "2.8d",
};

export const mockWeeklyTaskData: WeeklyTaskData[] = [
  { week: "Week 1", completed: 65, overdue: 8 },
  { week: "Week 2", completed: 78, overdue: 6 },
  { week: "Week 3", completed: 58, overdue: 12 },
  { week: "Week 4", completed: 89, overdue: 10 },
  { week: "Week 5", completed: 72, overdue: 7 },
  { week: "Week 6", completed: 85, overdue: 9 },
  { week: "Week 7", completed: 94, overdue: 4 },
  { week: "Week 8", completed: 88, overdue: 3 },
];

export const mockRecentActivities: RecentActivity[] = [
  {
    id: "1",
    description: "KYC Verification completed",
    user: "Sarah Mitchell",
    timestamp: "2 minutes ago",
    type: "completed",
  },
  {
    id: "2",
    description: "Quarterly Reporting started",
    user: "Maria Santos",
    timestamp: "5 minutes ago",
    type: "started",
  },
  {
    id: "3",
    description: "AML Investigation paused",
    user: "Robert Zhang",
    timestamp: "12 minutes ago",
    type: "paused",
  },
  {
    id: "4",
    description: "OFAC Screening completed",
    user: "Jennifer Chen",
    timestamp: "18 minutes ago",
    type: "completed",
  },
];

// Simulated API functions with delays
export const fetchProcesses = (): Promise<ProcessWithSteps[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProcesses), 2000);
  });
};

export const fetchDashboardMetrics = (): Promise<DashboardMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDashboardMetrics), 1500);
  });
};

export const fetchWeeklyTaskData = (): Promise<WeeklyTaskData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockWeeklyTaskData), 1000);
  });
};

export const fetchRecentActivities = (): Promise<RecentActivity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRecentActivities), 800);
  });
};
