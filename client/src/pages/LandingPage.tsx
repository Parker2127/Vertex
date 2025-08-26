import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { BarChart3, Shield, TrendingUp, Users, CheckCircle, Lock, Globe, Palette } from "lucide-react";
import vertexLogo from "@/assets/vertex-logo.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Dashboard",
      description: "Monitor compliance metrics and KPIs with live data updates",
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "KYC verification, AML investigations, and regulatory reporting workflows",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Track completion rates and identify bottlenecks in compliance processes",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Assign tasks, track ownership, and collaborate on compliance workflows",
    },
  ];

  const benefits = [
    "Streamlined KYC verification processes",
    "Automated AML investigation workflows", 
    "Real-time regulatory reporting",
    "Audit trail and compliance documentation",
    "Interactive dashboards and analytics",
    "Customizable workflow templates"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={vertexLogo} alt="Vertex Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Vertex</h1>
                <p className="text-xs text-slate-500">FinTech Compliance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                data-testid="button-theme-toggle-landing"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'corporate' ? 'Doodle' : 'Corporate'} mode`}
              >
                <Palette className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => setLocation("/login")}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-login-nav"
              >
                <Lock className="mr-2" size={16} />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
              FinTech Compliance
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Streamline regulatory compliance workflows, monitor KYC processes, 
              and ensure audit readiness with our comprehensive dashboard solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setLocation("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
                data-testid="button-get-started"
              >
                <BarChart3 className="mr-2" size={20} />
                View Dashboard
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-slate-300"
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                data-testid="button-learn-more"
              >
                <Globe className="mr-2" size={20} />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Comprehensive Compliance Management
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for financial institutions that need to maintain regulatory compliance 
              while managing complex workflows efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Why Choose Vertex?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Our platform is designed specifically for financial services teams 
                who need to manage complex compliance requirements while maintaining 
                operational efficiency.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <CardContent className="p-8">
                  <img src={vertexLogo} alt="Vertex Logo" className="w-12 h-12 mb-4 object-contain" />
                  <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="mb-6 opacity-90">
                    Experience the power of automated compliance management. 
                    Access the demo dashboard with full functionality.
                  </p>
                  <Button 
                    size="lg"
                    variant="secondary"
                    onClick={() => setLocation("/login")}
                    className="w-full"
                    data-testid="button-demo-access"
                  >
                    Access Demo Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={vertexLogo} alt="Vertex Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold">Vertex</span>
          </div>
          <p className="text-slate-400 mb-2">
            © 2025 Shrikar Kaduluri. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Modern React + TypeScript Application showcasing enterprise-grade compliance management
          </p>
        </div>
      </footer>
    </div>
  );
}