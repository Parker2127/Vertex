import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { WeeklyTaskData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TasksChartProps {
  data: WeeklyTaskData[];
}

export default function TasksChart({ data }: TasksChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Compliance Tasks: Completed vs. Overdue
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">Weekly regulatory workflow completion over the last 8 weeks</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-600">Overdue</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80" data-testid="chart-tasks-completed-overdue">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={{ stroke: "#e2e8f0" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[2, 2, 0, 0]} />
              <Bar dataKey="overdue" fill="#ef4444" name="Overdue" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
