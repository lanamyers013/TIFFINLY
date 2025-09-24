import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, MapPin, Clock, CreditCard, Truck, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  type: string;
  description: string;
  providerId: number;
  providerName: string;
  quantity: number;
}

interface CartModalProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  trigger: React.ReactNode;
  onOrderPlace?: (order: any) => void;
}

export const CartModal = ({ cart, setCart, trigger, onOrderPlace }: CartModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const { toast } = useToast();

  const updateQuantity = (itemId: number, providerId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId, providerId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === itemId && item.providerId === providerId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeItem = (itemId: number, providerId: number) => {
    setCart(cart.filter(item => !(item.id === itemId && item.providerId === providerId)));
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = deliveryOption === 'pickup' ? 10 : 0;
    return subtotal - discount;
  };

  const getProviderGroups = () => {
    const groups: { [key: number]: CartItem[] } = {};
    cart.forEach(item => {
      if (!groups[item.providerId]) {
        groups[item.providerId] = [];
      }
      groups[item.providerId].push(item);
    });
    return groups;
  };

  const handlePlaceOrder = () => {
    if (deliveryOption === 'delivery' && !deliveryAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    const order = {
      items: cart,
      totalAmount: getTotalPrice(),
      deliveryOption,
      deliveryAddress: deliveryOption === 'delivery' ? deliveryAddress.trim() : '',
      orderNotes: orderNotes.trim(),
      paymentMethod: "Cash on Delivery",
      orderTime: new Date().toISOString(),
      status: "Placed"
    };

    // Save order (in real app, this would go to backend)
    const existingOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
    const newOrder = { ...order, id: Date.now() };
    localStorage.setItem('customer_orders', JSON.stringify([...existingOrders, newOrder]));

    // Clear cart
    setCart([]);
    setDeliveryAddress("");
    setOrderNotes("");
    setIsOpen(false);

    // Call parent callback to show order confirmation
    if (onOrderPlace) {
      onOrderPlace(newOrder);
    } else {
      toast({
        title: "Order placed successfully!",
        description: `Your order of ₹${getTotalPrice()} has been placed. You'll receive it in 30-45 minutes.`,
      });
    }
  };

  const providerGroups = getProviderGroups();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Your Cart
            <Badge variant="secondary">{cart.length} items</Badge>
          </SheetTitle>
          <SheetDescription>
            Review your items and place your order
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Your cart is empty</p>
              <p className="text-sm">Add some delicious items to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items by Provider */}
              {Object.entries(providerGroups).map(([providerId, items]) => (
                <Card key={providerId} className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{items[0].providerName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.providerId}`} className="flex gap-3">
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
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <p className="font-semibold text-accent">₹{item.price} each</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => updateQuantity(item.id, item.providerId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => updateQuantity(item.id, item.providerId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id, item.providerId)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              <Separator />

              {/* Delivery Options */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Delivery Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <div className="flex items-center gap-2 flex-1">
                        <Truck className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="delivery" className="font-medium cursor-pointer">
                            Home Delivery
                          </Label>
                          <p className="text-sm text-muted-foreground">Delivered to your doorstep • 30-45 min</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">Free</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <div className="flex items-center gap-2 flex-1">
                        <Package className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="pickup" className="font-medium cursor-pointer">
                            Self Pickup
                          </Label>
                          <p className="text-sm text-muted-foreground">Pickup from restaurant • 15-20 min</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">₹10 off</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address - Only show for delivery option */}
              {deliveryOption === 'delivery' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address *
                  </label>
                  <Textarea
                    placeholder="Enter your complete delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}

              {/* Order Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Notes (Optional)</label>
                <Textarea
                  placeholder="Any special instructions for the cook..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              {/* Pickup Location - Only show for pickup option */}
              {deliveryOption === 'pickup' && cart.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                      <MapPin className="w-5 h-5" />
                      Pickup Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {(() => {
                      // Get unique providers from cart items
                      const uniqueProviders = cart.reduce((acc: any[], item: any) => {
                        const existingProvider = acc.find(p => p.id === item.providerId);
                        if (!existingProvider && item.pickupLocation) {
                          acc.push({
                            id: item.providerId,
                            name: item.providerName,
                            pickupLocation: item.pickupLocation
                          });
                        }
                        return acc;
                      }, []);

                      return uniqueProviders.map((provider) => (
                        <div key={provider.id} className="space-y-2 mb-4 last:mb-0">
                          <h4 className="font-semibold text-orange-800">{provider.name}</h4>
                          <div className="space-y-1 text-sm text-orange-700">
                            <p className="font-medium">{provider.pickupLocation.address}</p>
                            <p>{provider.pickupLocation.landmark}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                📞 {provider.pickupLocation.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                🕒 {provider.pickupLocation.timings}
                              </span>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Order Summary */}
              <Card className="bg-gradient-primary text-white">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span>₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Delivery:</span>
                      <span>{deliveryOption === 'delivery' ? 'Free' : 'Self Pickup'}</span>
                    </div>
                    {deliveryOption === 'pickup' && (
                      <div className="flex justify-between items-center text-green-200">
                        <span>Pickup Discount:</span>
                        <span>-₹10</span>
                      </div>
                    )}
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total:</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-90 mt-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{deliveryOption === 'pickup' ? 'Cash on Pickup' : 'Cash on Delivery'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Clock className="w-4 h-4" />
                      <span>{deliveryOption === 'delivery' ? 'Delivery in 30-45 minutes' : 'Ready for pickup in 15-20 minutes'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button 
                onClick={handlePlaceOrder}
                className="w-full" 
                size="lg"
                variant="food"
              >
                Place Order - ₹{getTotalPrice()}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};