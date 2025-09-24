import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Clock, MapPin, Search, Filter, Heart, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartModal } from "./CartModal";
import { ChatModal } from "./ChatModal";

// Import food images
import dalRiceImage from "@/assets/dal-rice-combo.jpg";
import chickenCurryImage from "@/assets/chicken-curry-combo.jpg";
import sambarRiceImage from "@/assets/sambar-rice.jpg";
import curdRiceImage from "@/assets/curd-rice.jpg";
import rajmaRiceImage from "@/assets/rajma-rice.jpg";
import palakPaneerImage from "@/assets/palak-paneer.jpg";
import choleBhatureImage from "@/assets/chole-bhature.jpg";
import vegCurryImage from "@/assets/veg-curry-combo.jpg";
import paneerButterMasalaImage from "@/assets/paneer-butter-masala.jpg";
import alooGobiImage from "@/assets/aloo-gobi.jpg";

// Import provider logos
import mamasKitchenLogo from "@/assets/mamas-kitchen-logo.png";
import southSpiceLogo from "@/assets/south-spice-logo.png";
import greenGardenLogo from "@/assets/green-garden-logo.png";

interface CustomerDashboardProps {
  user: any;
  onOrderPlace?: (order: any) => void;
}

// Function to get provider logo
const getProviderLogo = (providerId: number) => {
  switch (providerId) {
    case 1: return mamasKitchenLogo;
    case 2: return southSpiceLogo;
    case 3: return greenGardenLogo;
    default: return mamasKitchenLogo;
  }
};

export const CustomerDashboard = ({ user, onOrderPlace }: CustomerDashboardProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [cart, setCart] = useState([]);
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("tiffin-cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Mock data for tiffin providers
  const providers = [
    {
      id: 1,
      name: "Mama's Kitchen",
      cuisine: "North Indian",
      rating: 4.8,
      deliveryTime: "30-45 min",
      distance: "1.2 km",
      image: "/placeholder.svg",
      pickupLocation: {
        address: "123 Gandhi Road, Model Town, New Delhi - 110009",
        landmark: "Near City Mall, Opposite Metro Station",
        phone: "+91 9876543210",
        timings: "10:00 AM - 9:00 PM"
      },
      menu: [
        { id: 1, name: "Dal Rice Combo", price: 120, type: "Veg", description: "Dal, Rice, Sabzi, Roti", image: dalRiceImage },
        { id: 2, name: "Chicken Curry Combo", price: 180, type: "Non-Veg", description: "Chicken Curry, Rice, Roti", image: chickenCurryImage },
        { id: 11, name: "Rajma Rice", price: 140, type: "Veg", description: "Rajma Curry, Jeera Rice, Chapati, Salad", image: rajmaRiceImage },
        { id: 12, name: "Palak Paneer Combo", price: 160, type: "Veg", description: "Palak Paneer, Basmati Rice, Naan, Salad", image: palakPaneerImage },
        { id: 13, name: "Chole Bhature", price: 130, type: "Veg", description: "Chole, Bhature, Pickled Onions, Chutney", image: choleBhatureImage },
      ],
      specialties: ["Home-style", "Fresh Daily", "No Preservatives"]
    },
    {
      id: 2,
      name: "South Spice Tiffin",
      cuisine: "South Indian",
      rating: 4.6,
      deliveryTime: "25-40 min",
      distance: "0.8 km",
      image: "/placeholder.svg",
      pickupLocation: {
        address: "456 Temple Street, Lajpat Nagar, New Delhi - 110024",
        landmark: "Next to Hanuman Temple, Behind SBI Bank",
        phone: "+91 9876543211",
        timings: "11:00 AM - 8:00 PM"
      },
      menu: [
        { id: 3, name: "Sambar Rice", price: 100, type: "Veg", description: "Sambar, Rice, Pickle, Papad", image: sambarRiceImage },
        { id: 4, name: "Curd Rice", price: 80, type: "Veg", description: "Curd Rice, Pickle, Chips", image: curdRiceImage },
      ],
      specialties: ["Authentic", "Healthy", "Traditional"]
    },
    {
      id: 3,
      name: "Green Garden Tiffin",
      cuisine: "Vegetarian Special",
      rating: 4.7,
      deliveryTime: "20-35 min",
      distance: "1.5 km",
      image: "/placeholder.svg",
      pickupLocation: {
        address: "789 Park Avenue, Green Park, New Delhi - 110016",
        landmark: "Inside Green Park Market, Shop No. 15",
        phone: "+91 9876543212",
        timings: "9:00 AM - 10:00 PM"
      },
      menu: [
        { id: 14, name: "Mixed Veg Curry Combo", price: 110, type: "Veg", description: "Seasonal Vegetables, Quinoa Rice, Roti, Salad", image: vegCurryImage },
        { id: 15, name: "Paneer Butter Masala", price: 170, type: "Veg", description: "Paneer Butter Masala, Jeera Rice, Garlic Naan, Salad", image: paneerButterMasalaImage },
        { id: 16, name: "Aloo Gobi Combo", price: 120, type: "Veg", description: "Aloo Gobi, Brown Rice, Chapati, Pickle", image: alooGobiImage },
      ],
      specialties: ["Pure Vegetarian", "Organic", "Healthy Options"]
    },
  ];

  const addToCart = (item: any, providerId: number) => {
    const provider = providers.find(p => p.id === providerId);
    const newItem = { 
      ...item, 
      providerId, 
      providerName: provider?.name || "Unknown Provider",
      pickupLocation: provider?.pickupLocation,
      quantity: 1 
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("tiffin-cart") || "[]");
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (cartItem: any) => cartItem.id === item.id && cartItem.providerId === providerId
    );
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      updatedCart = existingCart.map((cartItem: any, index: number) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      // Add new item
      updatedCart = [...existingCart, newItem];
    }
    
    // Update localStorage and state
    localStorage.setItem("tiffin-cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    
    toast({
      title: "Added to cart",
      description: `${item.name} added successfully`,
    });
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-warm rounded-2xl p-6 text-white shadow-glow">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="opacity-90">Discover delicious home-cooked meals near you</p>
      </div>

      {/* Search & Filter */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for tiffin providers or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
            <Button variant="outline" size="icon" className="self-start">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="shadow-card border-0 hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-card overflow-hidden">
                    <img 
                      src={getProviderLogo(provider.id)} 
                      alt={`${provider.name} logo`}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {provider.name}
                      <div className="flex gap-1">
                        <ChatModal
                          providerName={provider.name}
                          providerId={provider.id}
                          customerName={user.name || user.email?.split('@')[0] || 'Customer'}
                          trigger={
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <span className="text-xs text-primary">💬</span>
                            </Button>
                          }
                        />
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>{provider.cuisine}</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        {provider.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {provider.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {provider.distance}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {provider.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Today's Menu</h4>
                {provider.menu.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                    <div 
                      className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/food/${item.id}`)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div 
                      className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/food/${item.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium truncate">{item.name}</h5>
                        <Badge 
                          variant={item.type === 'Veg' ? 'success' : 'destructive'} 
                          className="text-xs flex-shrink-0"
                        >
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <p className="font-semibold text-accent">₹{item.price}</p>
                    </div>
                    <Button
                      onClick={() => addToCart(item, provider.id)}
                      variant="food"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <CartModal 
          cart={cart} 
          setCart={(newCart) => {
            setCart(newCart);
            localStorage.setItem("tiffin-cart", JSON.stringify(newCart));
          }}
          onOrderPlace={onOrderPlace}
          trigger={
            <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 max-w-sm shadow-glow border-0 bg-gradient-primary text-white cursor-pointer hover:shadow-xl transition-all z-50 mx-auto">
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{cart.length} item(s) in cart</p>
                    <p className="text-xs sm:text-sm opacity-90">
                      Total: ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                    </p>
                  </div>
                  <Button variant="glass" size="sm" className="text-xs sm:text-sm">
                    View Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          }
        />
      )}
    </div>
  );
};