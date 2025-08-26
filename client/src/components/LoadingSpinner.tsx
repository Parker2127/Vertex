import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  description?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className, 
  text = "Loading...", 
  description 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary-600 mb-3", sizeClasses[size])} />
      {text && (
        <h3 className="text-lg font-medium text-slate-900 mb-2">{text}</h3>
      )}
      {description && (
        <p className="text-sm text-slate-600 text-center max-w-md">{description}</p>
      )}
    </div>
  );
}

export function PageLoadingSpinner({ text, description }: { text?: string; description?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner 
        size="lg" 
        text={text} 
        description={description}
      />
    </div>
  );
}