import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, Mail, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  role: 'customer' | 'cooker' | 'delivery';
  onBack: () => void;
  onAuth: (userData: any) => void;
}

export const AuthForm = ({ role, onBack, onAuth }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;

        const sessionUser = data.user;
        // Get stored user data from localStorage if available
        const storedUser = localStorage.getItem('tiffin_user');
        const existingData = storedUser ? JSON.parse(storedUser) : {};
        
        const userData = {
          id: sessionUser?.id,
          role,
          name: existingData.name || sessionUser?.user_metadata?.name || sessionUser?.email?.split('@')[0] || '',
          phone: existingData.phone || sessionUser?.user_metadata?.phone || '',
          email: formData.email,
          address: existingData.address || sessionUser?.user_metadata?.address || '',
          verified: true,
        };

        localStorage.setItem('tiffin_user', JSON.stringify(userData));
        onAuth(userData);

        toast({
          title: "Welcome to Tiffinly!",
          description: `Successfully logged in as ${role}`,
        });
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { 
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
              phone: formData.phone,
              address: formData.address,
              role: role
            }
          },
        });
        if (error) throw error;

        // Store signup data temporarily for login
        const userData = {
          role,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
        };
        localStorage.setItem('tiffin_user', JSON.stringify(userData));

        toast({
          title: "Check your email",
          description: "We sent you a confirmation link. Verify, then sign in.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    customer: { title: "Customer", color: "bg-gradient-warm" },
    cooker: { title: "Tiffin Provider", color: "bg-gradient-food" },
    delivery: { title: "Delivery Partner", color: "bg-gradient-primary" }
  };

  let buttonText = '';
  if (loading) {
    buttonText = 'Processing...';
  } else if (isLogin) {
    buttonText = 'Sign In';
  } else {
    buttonText = 'Create Account';
  }

  return (
    <Card className="max-w-md mx-auto shadow-card border-0">
      <CardHeader className="text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="absolute left-4 top-4"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className={`w-16 h-16 mx-auto rounded-full ${roleConfig[role].color} flex items-center justify-center mb-4 shadow-button`}>
          <User className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </CardTitle>
        <CardDescription>
          {isLogin ? 'Sign in' : 'Sign up'} as {roleConfig[role].title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="rounded-lg"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="pl-10 rounded-lg"
                required={!isLogin}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="pl-10 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="pl-10 rounded-lg"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Your address"
                className="rounded-lg"
                required
              />
            </div>
          )}

          <Button 
            className="w-full" 
            variant="hero"
            size="lg"
            disabled={loading}
          >
            {buttonText}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};