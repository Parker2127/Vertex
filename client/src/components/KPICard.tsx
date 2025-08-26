import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useLocation } from "wouter";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  onClick?: () => void;
}

export default function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBgColor,
  iconColor,
  onClick,
}: KPICardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]" 
      data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 group-hover:scale-105 transition-transform inline-block" data-testid={`kpi-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  changeType === "positive" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
              <span className="text-slate-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className={`${iconColor} text-xl group-hover:animate-pulse`} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
