import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  type: 'Veg' | 'Non-Veg';
  description: string;
  category: string;
  orderCount: number;
  image?: string;
}

interface AddMenuItemModalProps {
  trigger: React.ReactNode;
  onAddItem: (item: Omit<MenuItem, 'id' | 'orderCount'>) => void;
}

export const AddMenuItemModal = ({ trigger, onAddItem }: AddMenuItemModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "" as 'Veg' | 'Non-Veg' | "",
    description: "",
    category: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.type || !formData.description || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload an image of your dish",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    const newItem = {
      name: formData.name,
      price: price,
      type: formData.type as 'Veg' | 'Non-Veg',
      description: formData.description,
      category: formData.category,
      image: imagePreview // Store the preview URL for display
    };

    onAddItem(newItem);
    
    // Reset form
    setFormData({
      name: "",
      price: "",
      type: "",
      description: "",
      category: ""
    });
    setImageFile(null);
    setImagePreview(null);
    
    setIsOpen(false);
    
    toast({
      title: "Item added successfully!",
      description: `${newItem.name} has been added to your menu`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Menu Item</SheetTitle>
          <SheetDescription>
            Add a delicious new item to your menu with an appetizing photo
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Dish Image *</Label>
            {!imagePreview ? (
              <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a photo of your dish
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    JPG, PNG or WEBP (max 5MB)
                  </p>
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Dish preview"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-8 h-8"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Image uploaded successfully! You can change it by clicking the X button.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Butter Chicken Combo"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="e.g., 150"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Food Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Veg">Vegetarian</SelectItem>
                  <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main Course">Main Course</SelectItem>
                <SelectItem value="Combo">Combo Meal</SelectItem>
                <SelectItem value="Rice">Rice Items</SelectItem>
                <SelectItem value="Curry">Curry</SelectItem>
                <SelectItem value="Bread">Bread Items</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Beverages">Beverages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the items included in this dish..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="food"
              className="flex-1"
            >
              Add Item
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};