import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Phone, ArrowLeft } from "lucide-react";

interface OrderConfirmationProps {
  order: any;
  onBackToMenu: () => void;
}

export const OrderConfirmation = ({ order, onBackToMenu }: OrderConfirmationProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Order Confirmed", icon: CheckCircle, time: "Just now" },
    { label: "Preparing", icon: Clock, time: "5-10 min" },
    { label: "Ready for Pickup", icon: CheckCircle, time: "20-30 min" },
    { label: "Out for Delivery", icon: Clock, time: "25-35 min" },
    { label: "Delivered", icon: CheckCircle, time: "30-45 min" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToMenu}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center flex-1">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Your delicious meal is on its way</p>
          </div>
        </div>

        {/* Order Details */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order #{order.id}</span>
              <Badge variant="success">Confirmed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Delivery Address:</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{order.deliveryAddress}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Estimated Delivery:</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">30-45 minutes</p>
              </div>
            </div>
            
            {order.orderNotes && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Special Instructions:</p>
                <p className="text-sm text-muted-foreground">{order.orderNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Progress */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(currentStep + 1) * 20}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                        isCompleted ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'animate-pulse' : ''}`}>
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${isCompleted ? 'text-green-700' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {step.time}
                        </p>
                      </div>
                      {isCurrent && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <Badge 
                        variant={item.type === 'Veg' ? 'success' : 'destructive'} 
                        className="text-xs"
                      >
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{item.providerName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Paid:</span>
                  <span className="text-accent">₹{order.totalAmount}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Cash on Delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="shadow-card border-0 bg-gradient-primary text-white">
          <CardContent className="p-6 text-center">
            <Phone className="w-8 h-8 mx-auto mb-3 opacity-90" />
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm opacity-90 mb-4">
              Contact us if you have any questions about your order
            </p>
            <Button variant="glass" size="sm">
              Call Support
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onBackToMenu}
          >
            Order More Food
          </Button>
          <Button 
            variant="food" 
            className="flex-1"
          >
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};