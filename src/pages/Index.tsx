import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleSelector } from "@/components/RoleSelector";
import { AuthForm } from "@/components/AuthForm";
import { CustomerDashboard } from "@/components/CustomerDashboard";
import { CookerDashboard } from "@/components/CookerDashboard";
import { OrderConfirmation } from "@/components/OrderConfirmation";

import { LogOut, Utensils } from "lucide-react";
import heroImage from "@/assets/hero-tiffin.jpg";

type UserRole = 'customer' | 'cooker';
type AppState = 'landing' | 'auth' | 'dashboard' | 'order-confirmation';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const roleSelectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('tiffin_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setSelectedRole(userData.role);
      setCurrentState('dashboard');
    }
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentState('auth');
  };

  const handleAuth = (userData: any) => {
    setUser(userData);
    setCurrentState('dashboard');
  };

  const handleOrderConfirmation = (order: any) => {
    setCurrentOrder(order);
    setCurrentState('order-confirmation');
  };

  const handleBackToMenu = () => {
    setCurrentState('dashboard');
    setCurrentOrder(null);
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('tiffin_user');
    setUser(null);
    setSelectedRole(null);
    setCurrentState('landing');
  };

  const renderDashboard = () => {
    if (!user || !selectedRole) return null;

    switch (selectedRole) {
      case 'customer':
        return <CustomerDashboard user={user} onOrderPlace={handleOrderConfirmation} />;
      case 'cooker':
        return <CookerDashboard user={user} />;
      default:
        return null;
    }
  };

  if (currentState === 'order-confirmation' && currentOrder) {
    return (
      <OrderConfirmation 
        order={currentOrder} 
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  if (currentState === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-card border-b border-border p-3 sm:p-4 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-food rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold">Tiffinly</h1>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto pb-20">
          {renderDashboard()}
        </main>
      </div>
    );
  }

  if (currentState === 'auth' && selectedRole) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <AuthForm 
            role={selectedRole}
            onBack={() => setCurrentState('landing')}
            onAuth={handleAuth}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-20 text-center text-white">
          <div className="animate-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-food rounded-2xl flex items-center justify-center shadow-glow animate-float">
              <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Tiffinly
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 px-4">
              Connecting home cooks with hungry hearts. Fresh, homemade meals delivered with love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                variant="hero" 
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                onClick={() => scrollToSection(roleSelectionRef)}
              >
                Get Started
              </Button>
              <Button 
                variant="glass" 
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                onClick={() => scrollToSection(featuresRef)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section ref={roleSelectionRef} className="py-12 sm:py-20 px-4 bg-gradient-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Whether you're looking for delicious meals or want to share your cooking, 
              we have something for everyone.
            </p>
          </div>
          
          <div className="animate-fade-in">
            <RoleSelector onRoleSelect={handleRoleSelect} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Why Choose Tiffinly?</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Fresh & Homemade",
                description: "Every meal is prepared fresh daily by passionate home cooks who care about quality and taste.",
                icon: "🏠"
              },
              {
                title: "Fast Delivery",
                description: "Hot meals delivered to your doorstep in 30 minutes or less. Track your order in real-time.",
                icon: "⚡"
              },
              {
                title: "Community Driven",
                description: "Support local home cooks in your neighborhood and build meaningful connections through food.",
                icon: "❤️"
              }
            ].map((feature) => (
              <Card key={feature.title} className="text-center shadow-card border-0 hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-food rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold">Tiffinly</h3>
          </div>
          <p className="opacity-80 text-sm sm:text-base">Delivering happiness, one meal at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
