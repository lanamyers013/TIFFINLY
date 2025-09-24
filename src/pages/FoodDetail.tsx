import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Clock, MapPin, Star, Truck, Package, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatModal } from "@/components/ChatModal";
import { CartModal } from "@/components/CartModal";

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

// Provider data with pickup locations
const providersData = [
  {
    id: 1,
    name: "Mama's Kitchen",
    pickupLocation: {
      address: "123 Gandhi Road, Model Town, New Delhi - 110009",
      landmark: "Near City Mall, Opposite Metro Station",
      phone: "+91 9876543210",
      timings: "10:00 AM - 9:00 PM"
    }
  },
  {
    id: 2,
    name: "South Spice Tiffin",
    pickupLocation: {
      address: "456 Temple Street, Lajpat Nagar, New Delhi - 110024",
      landmark: "Next to Hanuman Temple, Behind SBI Bank",
      phone: "+91 9876543211",
      timings: "11:00 AM - 8:00 PM"
    }
  },
  {
    id: 3,
    name: "Green Garden Tiffin",
    pickupLocation: {
      address: "789 Park Avenue, Green Park, New Delhi - 110016",
      landmark: "Inside Green Park Market, Shop No. 15",
      phone: "+91 9876543212",
      timings: "9:00 AM - 10:00 PM"
    }
  }
];

const allMenuItems = [
  { id: 1, name: "Dal Rice Combo", price: 120, type: "Veg", description: "Dal, Rice, Sabzi, Roti", image: dalRiceImage, providerId: 1, providerName: "Mama's Kitchen", detailedDescription: "A wholesome combination of yellow dal (lentils), steamed basmati rice, mixed vegetable sabzi, and freshly made rotis. This traditional North Indian meal is rich in protein and provides complete nutrition. The dal is cooked with aromatic spices including turmeric, cumin, and coriander.", ingredients: ["Yellow Dal", "Basmati Rice", "Mixed Vegetables", "Whole Wheat Roti", "Onions", "Tomatoes", "Spices"], nutritionInfo: { calories: 450, protein: "18g", carbs: "65g", fat: "12g" } },
  { id: 2, name: "Chicken Curry Combo", price: 180, type: "Non-Veg", description: "Chicken Curry, Rice, Roti", image: chickenCurryImage, providerId: 1, providerName: "Mama's Kitchen", detailedDescription: "Tender chicken pieces cooked in a rich, flavorful curry with authentic Indian spices. Served with fragrant basmati rice and fresh rotis. The curry is slow-cooked to perfection with onions, tomatoes, ginger, garlic, and a blend of traditional spices.", ingredients: ["Chicken", "Basmati Rice", "Onions", "Tomatoes", "Ginger-Garlic", "Indian Spices", "Whole Wheat Roti"], nutritionInfo: { calories: 580, protein: "35g", carbs: "45g", fat: "25g" } },
  { id: 3, name: "Sambar Rice", price: 100, type: "Veg", description: "Sambar, Rice, Pickle, Papad", image: sambarRiceImage, providerId: 2, providerName: "South Spice Tiffin", detailedDescription: "Traditional South Indian comfort food featuring aromatic sambar (lentil curry) with mixed vegetables, served over steamed rice. Accompanied by spicy pickle and crispy papad. The sambar is made with tamarind, drumsticks, okra, and authentic South Indian spices.", ingredients: ["Toor Dal", "Rice", "Drumsticks", "Okra", "Tamarind", "Sambar Powder", "Pickle", "Papad"], nutritionInfo: { calories: 380, protein: "15g", carbs: "70g", fat: "8g" } },
  { id: 4, name: "Curd Rice", price: 80, type: "Veg", description: "Curd Rice, Pickle, Chips", image: curdRiceImage, providerId: 2, providerName: "South Spice Tiffin", detailedDescription: "A cooling and digestive South Indian dish made with fresh yogurt mixed with cooked rice. Tempered with mustard seeds, curry leaves, and green chilies. Served with spicy pickle and crispy banana chips for added flavor and texture.", ingredients: ["Rice", "Fresh Yogurt", "Mustard Seeds", "Curry Leaves", "Green Chilies", "Pickle", "Banana Chips"], nutritionInfo: { calories: 320, protein: "12g", carbs: "55g", fat: "6g" } },
  { id: 11, name: "Rajma Rice", price: 140, type: "Veg", description: "Rajma Curry, Jeera Rice, Chapati, Salad", image: rajmaRiceImage, providerId: 1, providerName: "Mama's Kitchen", detailedDescription: "Classic North Indian comfort food featuring red kidney beans cooked in a rich, spiced tomato gravy. Served with aromatic jeera rice, fresh chapatis, and a crisp mixed salad. High in protein and fiber, this meal is both nutritious and satisfying.", ingredients: ["Red Kidney Beans", "Jeera Rice", "Tomatoes", "Onions", "Spices", "Wheat Chapati", "Mixed Salad"], nutritionInfo: { calories: 520, protein: "22g", carbs: "75g", fat: "15g" } },
  { id: 12, name: "Palak Paneer Combo", price: 160, type: "Veg", description: "Palak Paneer, Basmati Rice, Naan, Salad", image: palakPaneerImage, providerId: 1, providerName: "Mama's Kitchen", detailedDescription: "Creamy spinach curry with soft cubes of cottage cheese, cooked with onions, tomatoes, and aromatic spices. Served with fluffy basmati rice, butter naan, and fresh garden salad. Rich in iron, calcium, and protein.", ingredients: ["Fresh Spinach", "Paneer", "Basmati Rice", "Butter Naan", "Cream", "Spices", "Mixed Salad"], nutritionInfo: { calories: 620, protein: "28g", carbs: "55g", fat: "32g" } },
  { id: 13, name: "Chole Bhature", price: 130, type: "Veg", description: "Chole, Bhature, Pickled Onions, Chutney", image: choleBhatureImage, providerId: 1, providerName: "Mama's Kitchen", detailedDescription: "Spicy chickpea curry paired with fluffy, deep-fried bread. A popular North Indian street food combination served with tangy pickled onions and fresh mint chutney. The chole is cooked with a special blend of spices for authentic flavor.", ingredients: ["Chickpeas", "Bhature Bread", "Pickled Onions", "Mint Chutney", "Tomatoes", "Spices"], nutritionInfo: { calories: 560, protein: "18g", carbs: "68g", fat: "22g" } },
  { id: 14, name: "Mixed Veg Curry Combo", price: 110, type: "Veg", description: "Seasonal Vegetables, Quinoa Rice, Roti, Salad", image: vegCurryImage, providerId: 3, providerName: "Green Garden Tiffin", detailedDescription: "A healthy medley of seasonal vegetables cooked in a light, flavorful curry. Served with nutritious quinoa rice, whole wheat roti, and fresh cucumber salad. This meal is packed with vitamins, minerals, and fiber.", ingredients: ["Seasonal Vegetables", "Quinoa Rice", "Whole Wheat Roti", "Cucumber Salad", "Light Spices"], nutritionInfo: { calories: 420, protein: "16g", carbs: "65g", fat: "10g" } },
  { id: 15, name: "Paneer Butter Masala", price: 170, type: "Veg", description: "Paneer Butter Masala, Jeera Rice, Garlic Naan, Salad", image: paneerButterMasalaImage, providerId: 3, providerName: "Green Garden Tiffin", detailedDescription: "Rich and creamy tomato-based curry with soft paneer cubes, finished with butter and cream. Served with aromatic jeera rice, garlic naan, and fresh salad. A restaurant-style favorite that's indulgent yet satisfying.", ingredients: ["Paneer", "Tomatoes", "Butter", "Cream", "Jeera Rice", "Garlic Naan", "Mixed Salad"], nutritionInfo: { calories: 680, protein: "30g", carbs: "58g", fat: "38g" } },
  { id: 16, name: "Aloo Gobi Combo", price: 120, type: "Veg", description: "Aloo Gobi, Brown Rice, Chapati, Pickle", image: alooGobiImage, providerId: 3, providerName: "Green Garden Tiffin", detailedDescription: "Classic dry curry made with potatoes and cauliflower, cooked with turmeric, cumin, and coriander. Served with nutritious brown rice, whole wheat chapati, and tangy pickle. A healthy, home-style meal.", ingredients: ["Potatoes", "Cauliflower", "Brown Rice", "Whole Wheat Chapati", "Pickle", "Turmeric", "Cumin"], nutritionInfo: { calories: 440, protein: "14g", carbs: "78g", fat: "8g" } },
];

export const FoodDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("tiffin-cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const foodItem = allMenuItems.find(item => item.id === parseInt(id || ""));

  if (!foodItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Food item not found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    const provider = providersData.find(p => p.id === foodItem.providerId);
    const cartItem = {
      ...foodItem,
      quantity,
      deliveryOption,
      pickupLocation: provider?.pickupLocation,
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("tiffin-cart") || "[]");
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === cartItem.id && item.providerId === cartItem.providerId
    );
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      updatedCart = existingCart.map((item: any, index: number) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      updatedCart = [...existingCart, cartItem];
    }
    
    localStorage.setItem("tiffin-cart", JSON.stringify(updatedCart));

    toast({
      title: "Added to cart",
      description: `${foodItem.name} added with ${deliveryOption} option`,
    });

    // Update local cart state
    setCart(updatedCart);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-2 p-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 pb-24">{/* Added bottom padding for fixed buttons */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Food Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl lg:rounded-2xl overflow-hidden shadow-glow">
              <img 
                src={foodItem.image} 
                alt={foodItem.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Food Details */}
          <div className="space-y-3 lg:space-y-4">
            <div>
              <div className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{foodItem.name}</h1>
                <Badge 
                  variant={foodItem.type === 'Veg' ? 'success' : 'destructive'}
                  className="text-xs sm:text-sm w-fit shrink-0"
                >
                  {foodItem.type}
                </Badge>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-accent mb-3">₹{foodItem.price}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-yellow-500" />
                  4.5
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  30-45 min
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  {foodItem.providerName}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{foodItem.detailedDescription}</p>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {foodItem.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Nutrition Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Nutrition Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Calories:</span> {foodItem.nutritionInfo.calories}
                  </div>
                  <div>
                    <span className="font-medium">Protein:</span> {foodItem.nutritionInfo.protein}
                  </div>
                  <div>
                    <span className="font-medium">Carbs:</span> {foodItem.nutritionInfo.carbs}
                  </div>
                  <div>
                    <span className="font-medium">Fat:</span> {foodItem.nutritionInfo.fat}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Delivery Options</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <div className="flex items-center gap-2 flex-1">
                      <Truck className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="delivery" className="font-medium cursor-pointer text-sm">
                          Home Delivery
                        </Label>
                        <p className="text-xs text-muted-foreground">Delivered to your doorstep • 30-45 min</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium">Free</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <div className="flex items-center gap-2 flex-1">
                      <Package className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="pickup" className="font-medium cursor-pointer text-sm">
                          Self Pickup
                        </Label>
                        <p className="text-xs text-muted-foreground">Pickup from restaurant • 15-20 min</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600">₹10 off</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-sm sm:text-base">Quantity:</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 sm:w-9 sm:h-9 text-sm"
                >
                  -
                </Button>
                <span className="w-8 sm:w-10 text-center font-medium text-sm sm:text-base">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 text-sm"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Bottom Action Buttons - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t p-3 sm:p-4 z-50 lg:hidden">
          <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3">
            <ChatModal
              trigger={
                <Button variant="outline" size="lg" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Chat with Provider</span>
                  <span className="xs:hidden">Chat</span>
                </Button>
              }
              providerName={foodItem.providerName}
              providerId={foodItem.providerId}
              customerName="Customer"
            />
            <Button 
              onClick={addToCart}
              className="flex-[2] bg-gradient-primary text-white shadow-glow hover:shadow-xl transition-all text-xs sm:text-sm px-2 sm:px-4"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Add to Cart • ₹{(foodItem.price * quantity) - (deliveryOption === 'pickup' ? 10 : 0)}</span>
              <span className="xs:hidden">₹{(foodItem.price * quantity) - (deliveryOption === 'pickup' ? 10 : 0)}</span>
            </Button>
          </div>
        </div>
        
        {/* Cart Modal for when items are in cart */}
        {cart.length > 0 && (
          <CartModal 
            cart={cart} 
            setCart={(newCart) => {
              setCart(newCart);
              localStorage.setItem("tiffin-cart", JSON.stringify(newCart));
            }}
            trigger={
              <div className="fixed bottom-20 right-4 lg:bottom-4 z-40">
                <Button className="bg-gradient-primary text-white shadow-glow hover:shadow-xl transition-all rounded-full w-14 h-14">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  </div>
                </Button>
              </div>
            }
          />
        )}
        
        {/* Desktop Action Buttons */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="flex gap-3 mt-6">
            <ChatModal
              trigger={
                <Button variant="outline" size="lg" className="flex-1">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with Provider
                </Button>
              }
              providerName={foodItem.providerName}
              providerId={foodItem.providerId}
              customerName="Customer"
            />
            <Button 
              onClick={addToCart}
              className="flex-[2] bg-gradient-primary text-white shadow-glow hover:shadow-xl transition-all"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart • ₹{(foodItem.price * quantity) - (deliveryOption === 'pickup' ? 10 : 0)}
            </Button>
          </div>
        </div>
        
        {/* Cart Modal for when items are in cart */}
        {cart.length > 0 && (
          <CartModal 
            cart={cart} 
            setCart={(newCart) => {
              setCart(newCart);
              localStorage.setItem("tiffin-cart", JSON.stringify(newCart));
            }}
            trigger={
              <div className="fixed bottom-20 right-4 lg:bottom-4 z-40">
                <Button className="bg-gradient-primary text-white shadow-glow hover:shadow-xl transition-all rounded-full w-14 h-14">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  </div>
                </Button>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};