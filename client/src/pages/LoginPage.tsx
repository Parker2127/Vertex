import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Lock, User } from "lucide-react";
import vertexLogo from "@/assets/vertex-logo.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "shrikar.kaduluri@vertex.app",
    password: "demo123"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      if (formData.email && formData.password) {
        const userData = {
          name: "Shrikar Kaduluri",
          email: formData.email,
          role: "Senior Software Engineer"
        };
        
        login(userData);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, Shrikar!`,
        });
        
        setLocation("/");
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={vertexLogo} alt="Vertex Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Vertex</h1>
          </div>
          <h2 className="text-lg font-medium text-slate-600">
            FinTech Compliance Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Sign in to manage regulatory compliance workflows
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="text-blue-600" size={20} />
              <span>Sign In</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  data-testid="input-email"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  data-testid="input-password"
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Email:</strong> shrikar.kaduluri@vertex.app</div>
                <div><strong>Password:</strong> demo123</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          <p>Portfolio Project by Shrikar Kaduluri</p>
          <p className="mt-1">Modern React + TypeScript Application</p>
        </div>
      </div>
    </div>
  );
}