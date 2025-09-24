import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Plus, Edit, Eye, CheckCircle, Clock, IndianRupee, TrendingUp, Trash, Bell, AlertCircle, ImageIcon, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddMenuItemModal } from "./AddMenuItemModal";
import { ChatModal } from "./ChatModal";

interface CookerDashboardProps {
  user: any;
}

export const CookerDashboard = ({ user }: CookerDashboardProps) => {
  const [menu, setMenu] = useState([
    {
      id: 1,
      name: "Dal Rice Combo",
      price: 120,
      type: "Veg" as const,
      description: "Yellow dal, steamed rice, mixed vegetables, 2 rotis",
      category: "Combo",
      orderCount: 45,
      available: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Chicken Curry Combo",
      price: 180,
      type: "Non-Veg" as const,
      description: "Chicken curry, basmati rice, salad, 2 rotis",
      category: "Combo",
      orderCount: 32,
      available: true,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop"
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "Firdous Ansari",
      items: ["Dal Rice Combo", "Jeera Rice"],
      total: 200,
      status: "new", // Changed to 'new' for pending orders
      time: "10:30 AM",
      address: "Sector 15, Gurgaon",
      phone: "+91 98765 43210",
      deliveryOption: "delivery"
    },
    {
      id: 2,
      customerName: "Priya Singh",
      items: ["Chicken Curry Combo"],
      total: 180,
      status: "new",
      time: "11:00 AM", 
      address: "Cyber City, Gurgaon",
      phone: "+91 87654 32109",
      deliveryOption: "pickup"
    },
    {
      id: 3,
      customerName: "Amit Kumar",
      items: ["Dal Rice Combo", "Chicken Curry Combo"],
      total: 300,
      status: "preparing",
      time: "11:15 AM",
      address: "DLF Phase 2, Gurgaon",
      phone: "+91 76543 21098",
      deliveryOption: "delivery"
    }
  ]);

  const { toast } = useToast();

  // Mock data
  const stats = {
    todayOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
    rating: 4.8,
    totalCustomers: 156
  };

  const handleAddItem = (newItemData: any) => {
    const newItem = {
      ...newItemData,
      id: Date.now(),
      orderCount: 0,
      available: true
    };
    setMenu(prev => [...prev, newItem]);
  };

  const acceptOrder = (orderId: number) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'preparing' } : order
    ));
    toast({
      title: "Order accepted",
      description: `Order #${orderId} has been accepted and is now being prepared`,
    });
  };

  const updateOrderStatus = (orderId: number, status: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    toast({
      title: "Order updated",
      description: `Order #${orderId} marked as ${status}`,
    });
  };

  const deleteMenuItem = (itemId: number) => {
    setMenu(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "Menu item has been removed successfully",
    });
  };

  const toggleItemAvailability = (itemId: number) => {
    setMenu(prev => prev.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
    toast({
      title: "Availability updated",
      description: "Item availability has been updated",
    });
  };

  // Get order counts by status
  const newOrdersCount = orders.filter(order => order.status === 'new').length;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-food rounded-2xl p-4 sm:p-6 text-white shadow-glow">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome, Chef {user.name}!</h1>
        <p className="opacity-90 text-sm sm:text-base">Manage your kitchen and delight customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent">{stats.todayOrders}</p>
            <p className="text-sm text-muted-foreground">Today's Orders</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent">₹{stats.revenue}</p>
            <p className="text-sm text-muted-foreground">Today's Revenue</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent">{stats.rating}</p>
            <p className="text-sm text-muted-foreground">Rating</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-food rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent">{stats.totalCustomers}</p>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
      </div>

      {/* New Orders Notification */}
      {newOrdersCount > 0 && (
        <Card className="shadow-card border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full">
                <Bell className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">
                  {newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''} Received!
                </h3>
                <p className="text-sm text-orange-600">
                  Please review and accept the pending orders below
                </p>
              </div>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incoming Orders */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Incoming Orders
            {newOrdersCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {newOrdersCount} New
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No orders yet today</p>
              <p className="text-sm">Orders will appear here when customers place them</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={`p-4 rounded-lg border-2 transition-all ${
                order.status === 'new' 
                  ? 'bg-orange-50 border-orange-200 shadow-md' 
                  : 'bg-muted border-transparent'
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-base">{order.customerName}</h4>
                      {order.status === 'new' && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          NEW ORDER
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.time}
                      </p>
                      <p className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {order.deliveryOption === 'delivery' ? '🚚 Delivery' : '📦 Pickup'}
                        </Badge>
                      </p>
                      <p className="text-xs">{order.address}</p>
                      <p className="text-xs font-mono">{order.phone}</p>
                    </div>
                  </div>
                  {(() => {
                    let badgeVariant;
                    if (order.status === 'new') {
                      badgeVariant = 'destructive';
                    } else if (order.status === 'preparing') {
                      badgeVariant = 'secondary';
                    } else {
                      badgeVariant = 'success';
                    }
                    return (
                      <Badge 
                        variant={badgeVariant}
                        className="capitalize self-start"
                      >
                        {order.status === 'new' ? 'Pending' : order.status}
                      </Badge>
                    );
                  })()}
                </div>
                
                <div className="space-y-2 mb-4">
                  <h5 className="font-medium text-sm">Items:</h5>
                  {order.items.map((item) => (
                    <p key={item} className="text-sm pl-2">• {item}</p>
                  ))}
                  <p className="font-semibold text-accent text-lg">Total: ₹{order.total}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {order.status === 'new' && (
                    <>
                      <Button 
                        onClick={() => acceptOrder(order.id)}
                        variant="success" 
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept Order
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1">
                        Decline
                      </Button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      variant="success" 
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Ready
                    </Button>
                  )}
                  <div className="flex gap-2 flex-1">
                    <ChatModal
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                      }
                      providerName="Mama's Kitchen" // In real app, get from auth
                      providerId={1}
                      customerName={order.customerName}
                    />
                    <Button variant="outline" size="sm" className="flex-1">
                      Call Customer
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Menu Management */}
      <Card className="shadow-card border-0">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Today's Menu</CardTitle>
          <AddMenuItemModal 
            onAddItem={handleAddItem}
            trigger={
              <Button variant="food" size="sm" className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {menu.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No menu items yet</p>
              <p className="text-sm">Add your first dish to get started</p>
            </div>
          ) : (
            menu.map((item) => (
              <div key={item.id} className="p-4 bg-muted rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  {item.image && (
                    <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-base">{item.name}</h4>
                      <Badge 
                        variant={item.type === 'Veg' ? 'success' : 'destructive'}
                        className="text-xs"
                      >
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.orderCount} orders
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                    <p className="font-semibold text-accent text-lg">₹{item.price}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col gap-2 sm:w-auto w-full">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`flex-1 sm:flex-none text-xs ${
                        item.available ? 'text-green-700 border-green-700' : 'text-red-700 border-red-700'
                      }`}
                    >
                      {item.available ? '✓ Available' : '✗ Unavailable'}
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => deleteMenuItem(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};