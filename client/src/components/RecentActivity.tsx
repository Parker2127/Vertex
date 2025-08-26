import { RecentActivity as ActivityType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, Pause } from "lucide-react";
import { useLocation } from "wouter";

interface RecentActivityProps {
  activities: ActivityType[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const [location, setLocation] = useLocation();
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completed":
        return <CheckCircle className="text-emerald-600" size={16} />;
      case "started":
        return <Play className="text-blue-600" size={16} />;
      case "paused":
        return <Pause className="text-yellow-600" size={16} />;
      default:
        return <CheckCircle className="text-emerald-600" size={16} />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "completed":
        return "bg-emerald-100";
      case "started":
        return "bg-blue-100";
      case "paused":
        return "bg-yellow-100";
      default:
        return "bg-emerald-100";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium h-auto p-0 transition-colors"
          data-testid="button-view-all-activities"
          onClick={() => setLocation("/processes")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${activity.id}`}>
            <div
              className={`w-8 h-8 ${getActivityBgColor(
                activity.type
              )} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{activity.description}</p>
              <p className="text-xs text-slate-500">by {activity.user}</p>
              <p className="text-xs text-slate-400">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
