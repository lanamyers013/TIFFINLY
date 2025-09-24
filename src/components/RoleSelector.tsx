import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, User } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: 'customer' | 'cooker') => void;
}

export const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'customer' as const,
      title: 'Customer',
      description: 'Order delicious home-cooked meals',
      icon: User,
      gradient: 'bg-gradient-warm',
    },
    {
      id: 'cooker' as const,
      title: 'Tiffin Provider',
      description: 'Share your cooking with the community',
      icon: ChefHat,
      gradient: 'bg-gradient-food',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <Card 
            key={role.id} 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow border-0 shadow-card"
            onClick={() => onRoleSelect(role.id)}
          >
            <CardHeader className="text-center pb-2">
              <div className={`w-16 h-16 mx-auto rounded-full ${role.gradient} flex items-center justify-center mb-4 shadow-button`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg">{role.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-sm mb-4">
                {role.description}
              </CardDescription>
              <Button variant="hero" size="sm" className="w-full">
                Continue as {role.title}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};