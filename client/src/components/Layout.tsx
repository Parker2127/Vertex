import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { List, User, LogOut, Palette, BarChart3 } from "lucide-react";
import vertexLogo from "@/assets/vertex-logo.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={vertexLogo} alt="Vertex Logo" className="w-8 h-8 object-contain" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900">Vertex</h1>
              </div>

              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="no-underline">
                  <Button
                    variant={isActive("/") ? "default" : "ghost"}
                    className={`px-3 py-2 text-sm font-medium ${
                      isActive("/")
                        ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50 rounded-t-md"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    data-testid="nav-dashboard"
                  >
                    <BarChart3 className="mr-2" size={16} />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/processes" className="no-underline">
                  <Button
                    variant={isActive("/processes") ? "default" : "ghost"}
                    className={`px-3 py-2 text-sm font-medium ${
                      isActive("/processes")
                        ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50 rounded-t-md"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    data-testid="nav-processes"
                  >
                    <List className="mr-2" size={16} />
                    Compliance Workflows
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                data-testid="button-theme-toggle"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'corporate' ? 'Doodle' : 'Corporate'} mode`}
              >
                <Palette className="w-4 h-4" />
              </Button>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{user?.name || "Shrikar Kaduluri"}</div>
                  <div className="text-xs text-slate-500">{user?.role || "Senior Software Engineer"}</div>
                </div>
                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                  <User className="text-slate-600" size={20} />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                data-testid="button-logout"
                onClick={() => {
                  logout();
                  toast({
                    title: "Logged Out",
                    description: "You have been successfully logged out.",
                  });
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
