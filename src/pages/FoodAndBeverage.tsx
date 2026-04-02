import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  UtensilsCrossed, 
  Search, 
  Filter, 
  Plus, 
  Minus,
  Trash2,
  ShoppingCart, 
  Coffee, 
  Pizza, 
  Wine, 
  ChefHat,
  Star,
  Clock,
  Info,
  CreditCard,
  Banknote,
  User,
  Printer,
  Send,
  BedDouble
} from "lucide-react";

interface FoodAndBeverageProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

export function FoodAndBeverage({ aiEnabled, activeSubmenu = "Overview" }: FoodAndBeverageProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <FAndBOverview aiEnabled={aiEnabled} />;
      case "Smart Menu (4D)":
        return <SmartMenu4D />;
      case "POS":
        return <POSSystem />;
      case "Table Management":
        return <TableManagement />;
      case "Room Service":
        return <RoomService />;
      case "Inventory":
        return <FAndBInventory />;
      case "KDS":
        return <KitchenDisplay />;
      case "Bar":
        return <BarManagement />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSubmenu}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}

function FAndBOverview({ aiEnabled }: { aiEnabled: boolean }) {
  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Food & Beverage Overview</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Revenue", value: "$4,250", sub: "+12% vs yesterday", icon: UtensilsCrossed, color: "text-blue-500" },
          { label: "Active Orders", value: "24", sub: "8 Room Service, 16 POS", icon: ShoppingCart, color: "text-amber-500" },
          { label: "Avg Prep Time", value: "18m", sub: "On target", icon: Clock, color: "text-emerald-500" },
          { label: "Low Stock Items", value: "12", sub: "Needs attention", icon: Info, color: "text-red-500" },
        ].map((kpi, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-secondary", kpi.color)}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4D Interactive Smart Menu
function SmartMenu4D() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);

  const categories = ["All", "Starters", "Mains", "Desserts", "Beverages"];

  const menuItems = [
    { id: 1, name: "Truffle Risotto", category: "Mains", price: 28, prepTime: "25m", rating: 4.8, image: "https://images.unsplash.com/photo-1633337474564-1d9e23434199?q=80&w=800&auto=format&fit=crop", description: "Creamy arborio rice with wild mushrooms and black truffle shavings." },
    { id: 2, name: "Wagyu Beef Burger", category: "Mains", price: 32, prepTime: "20m", rating: 4.9, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", description: "Premium wagyu patty, caramelized onions, aged cheddar, brioche bun." },
    { id: 3, name: "Burrata Salad", category: "Starters", price: 18, prepTime: "10m", rating: 4.7, image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=800&auto=format&fit=crop", description: "Fresh burrata, heirloom tomatoes, basil pesto, balsamic glaze." },
    { id: 4, name: "Molten Lava Cake", category: "Desserts", price: 14, prepTime: "15m", rating: 4.9, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop", description: "Warm chocolate cake with a gooey center, served with vanilla bean ice cream." },
    { id: 5, name: "Artisan Coffee", category: "Beverages", price: 6, prepTime: "5m", rating: 4.6, image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop", description: "Locally roasted single-origin espresso with steamed milk." },
    { id: 6, name: "Signature Cocktail", category: "Beverages", price: 16, prepTime: "8m", rating: 4.8, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop", description: "Gin, elderflower, fresh cucumber, and a hint of lime." },
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, {item, quantity}) => sum + (item.price * quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-primary" />
                Interactive Smart Menu (4D)
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Immersive dining experience. Tilt cards to view 4D preview.</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 bg-card p-2 rounded-2xl border border-border shadow-sm">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  activeCategory === category 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 4D Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
          {filteredItems.map((item) => (
            <MenuCard4D key={item.id} item={item} onAdd={() => addToCart(item)} />
          ))}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-8 bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
          <div className="p-4 border-b border-border bg-secondary/30">
            <h2 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Order
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
                <ShoppingCart className="w-12 h-12 mb-2" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((cartItem, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="flex items-center justify-between gap-3 bg-background p-3 rounded-xl border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{cartItem.item.name}</p>
                    <p className="text-xs text-muted-foreground">${cartItem.item.price} x {cartItem.quantity}</p>
                  </div>
                  <div className="font-semibold">
                    ${cartItem.item.price * cartItem.quantity}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border bg-secondary/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Total</span>
              <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-md"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4D Interactive Card Component
function MenuCard4D({ item, onAdd }: { item: any, onAdd: () => void }) {
  // 4D Tilt Effect state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 15 degrees)
    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className="relative perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-card rounded-2xl border border-border shadow-md overflow-hidden h-full flex flex-col transform-style-3d"
        animate={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* 4D Image Container */}
        <div className="relative h-48 overflow-hidden bg-secondary">
          <motion.img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
            animate={{
              x: rotateY * -1,
              y: rotateX * 1,
              scale: 1.1 // Slight scale to allow parallax movement
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            referrerPolicy="no-referrer"
          />
          {/* 4D Hologram Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
          
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {item.rating}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1 bg-card transform-style-3d">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg leading-tight" style={{ transform: "translateZ(20px)" }}>{item.name}</h3>
            <span className="font-bold text-primary text-lg" style={{ transform: "translateZ(30px)" }}>${item.price}</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 flex-1" style={{ transform: "translateZ(10px)" }}>
            {item.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Clock className="w-3 h-3" />
              {item.prepTime}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground p-2 rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Point of Sale System
function POSSystem() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [orderType, setOrderType] = useState<"Dine-in" | "Takeaway" | "Room Service">("Dine-in");
  const [tableOrRoom, setTableOrRoom] = useState("");
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Starters", "Mains", "Desserts", "Beverages"];

  const menuItems = [
    { id: 1, name: "Truffle Risotto", category: "Mains", price: 28, image: "https://images.unsplash.com/photo-1633337474564-1d9e23434199?q=80&w=200&auto=format&fit=crop" },
    { id: 2, name: "Wagyu Beef Burger", category: "Mains", price: 32, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" },
    { id: 3, name: "Burrata Salad", category: "Starters", price: 18, image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=200&auto=format&fit=crop" },
    { id: 4, name: "Molten Lava Cake", category: "Desserts", price: 14, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=200&auto=format&fit=crop" },
    { id: 5, name: "Artisan Coffee", category: "Beverages", price: 6, image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=200&auto=format&fit=crop" },
    { id: 6, name: "Signature Cocktail", category: "Beverages", price: 16, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop" },
    { id: 7, name: "Caesar Salad", category: "Starters", price: 15, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=200&auto=format&fit=crop" },
    { id: 8, name: "Grilled Salmon", category: "Mains", price: 29, image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=200&auto=format&fit=crop" },
    { id: 9, name: "Tiramisu", category: "Desserts", price: 12, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=200&auto=format&fit=crop" },
    { id: 10, name: "Sparkling Water", category: "Beverages", price: 5, image: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=200&auto=format&fit=crop" },
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === id) {
        const newQuantity = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQuantity };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.item.id !== id));
  };

  const subtotal = cart.reduce((sum, {item, quantity}) => sum + (item.price * quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] -mx-4 md:-mx-8 -mb-8">
      {/* Main POS Area */}
      <div className="flex-1 flex flex-col px-4 md:px-8 overflow-hidden">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            Point of Sale
          </h1>
          
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
            {(["Dine-in", "Takeaway", "Room Service"] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  orderType === type 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type === "Dine-in" && <UtensilsCrossed className="w-4 h-4" />}
                {type === "Takeaway" && <ShoppingCart className="w-4 h-4" />}
                {type === "Room Service" && <BedDouble className="w-4 h-4" />}
                <span className="hidden sm:inline">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Categories */}
        <div className="py-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  activeCategory === category 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-card border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto pb-8 pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all text-left flex flex-col group"
              >
                <div className="h-32 w-full bg-secondary relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
                    ${item.price}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-auto">{item.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket / Cart Sidebar */}
      <div className="w-full lg:w-96 bg-card border-l border-border flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Current Order</h2>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
              Ticket #4092
            </span>
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {orderType === "Dine-in" ? <UtensilsCrossed className="w-4 h-4" /> : 
               orderType === "Room Service" ? <BedDouble className="w-4 h-4" /> : 
               <User className="w-4 h-4" />}
            </div>
            <input 
              type="text" 
              placeholder={orderType === "Dine-in" ? "Table Number" : orderType === "Room Service" ? "Room Number" : "Customer Name"} 
              value={tableOrRoom}
              onChange={(e) => setTableOrRoom(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
              <ShoppingCart className="w-12 h-12 mb-2" />
              <p>No items added yet</p>
            </div>
          ) : (
            cart.map((cartItem) => (
              <div key={cartItem.item.id} className="flex flex-col gap-2 bg-background p-3 rounded-xl border border-border group">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-sm leading-tight">{cartItem.item.name}</p>
                    <p className="text-xs text-muted-foreground">${cartItem.item.price}</p>
                  </div>
                  <div className="font-semibold text-sm">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 border border-border">
                    <button 
                      onClick={() => updateQuantity(cartItem.item.id, -1)}
                      className="p-1 hover:bg-background rounded-md transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{cartItem.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(cartItem.item.id, 1)}
                      className="p-1 hover:bg-background rounded-md transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(cartItem.item.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border bg-secondary/30">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t border-border/50">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button className="py-2.5 rounded-xl bg-background border border-border hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="py-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Send className="w-4 h-4" />
              Kitchen
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              disabled={cart.length === 0}
              className="py-3 rounded-xl bg-blue-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Card
            </button>
            <button 
              disabled={cart.length === 0}
              className="py-3 rounded-xl bg-emerald-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Banknote className="w-4 h-4" />
              Cash
            </button>
          </div>
          
          {orderType === "Room Service" && (
            <button
              disabled={cart.length === 0 || !tableOrRoom}
              className="w-full mt-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <BedDouble className="w-4 h-4" />
              Charge to Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Table Management ────────────────────────────────────────────────────────

type TableStatus = "available" | "occupied" | "reserved" | "cleaning";

interface TableInfo {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  occupiedSince?: string;
  server?: string;
  x: number;
  y: number;
}

const STATUS_COLORS: Record<TableStatus, string> = {
  available: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400",
  occupied: "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400",
  reserved: "bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-400",
  cleaning: "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400",
};

const INITIAL_TABLES: TableInfo[] = [
  { id: 1, name: "T1", capacity: 2, status: "occupied", occupiedSince: "12:30", server: "Marco", x: 8, y: 10 },
  { id: 2, name: "T2", capacity: 4, status: "available", x: 28, y: 10 },
  { id: 3, name: "T3", capacity: 4, status: "reserved", x: 48, y: 10 },
  { id: 4, name: "T4", capacity: 6, status: "occupied", occupiedSince: "13:15", server: "Aisha", x: 68, y: 10 },
  { id: 5, name: "T5", capacity: 2, status: "cleaning", x: 8, y: 40 },
  { id: 6, name: "T6", capacity: 4, status: "available", x: 28, y: 40 },
  { id: 7, name: "T7", capacity: 8, status: "occupied", occupiedSince: "12:00", server: "James", x: 48, y: 40 },
  { id: 8, name: "T8", capacity: 4, status: "available", x: 72, y: 40 },
  { id: 9, name: "T9", capacity: 2, status: "reserved", x: 8, y: 70 },
  { id: 10, name: "T10", capacity: 4, status: "available", x: 28, y: 70 },
  { id: 11, name: "T11", capacity: 6, status: "occupied", occupiedSince: "13:45", server: "Priya", x: 50, y: 70 },
  { id: 12, name: "T12", capacity: 4, status: "available", x: 72, y: 70 },
];

function TableManagement() {
  const [tables, setTables] = useState<TableInfo[]>(INITIAL_TABLES);
  const [selected, setSelected] = useState<TableInfo | null>(null);

  const statusCounts = tables.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cycleStatus = (id: number) => {
    const order: TableStatus[] = ["available", "occupied", "reserved", "cleaning"];
    setTables(ts =>
      ts.map(t => {
        if (t.id !== id) return t;
        const next = order[(order.indexOf(t.status) + 1) % order.length];
        return { ...t, status: next };
      })
    );
    setSelected(s => s?.id === id ? { ...s, status: (order[(order.indexOf(s.status) + 1) % order.length]) } : s);
  };

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Table Management</h1>
          <div className="flex gap-3">
            {(["available", "occupied", "reserved", "cleaning"] as TableStatus[]).map(s => (
              <div key={s} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium capitalize", STATUS_COLORS[s])}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {statusCounts[s] || 0} {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 pb-8">
        {/* Floor Plan */}
        <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Restaurant Floor Plan</h2>
            <span className="text-xs text-muted-foreground">Click a table to change status</span>
          </div>
          <div className="relative bg-secondary/20 m-4 rounded-xl" style={{ height: 360 }}>
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 right-4 h-8 bg-secondary/50 rounded-lg flex items-center px-3">
              <span className="text-xs text-muted-foreground">Bar Counter</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 h-6 bg-secondary/40 rounded-lg flex items-center px-3">
              <span className="text-xs text-muted-foreground">Entrance</span>
            </div>
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => { setSelected(table); cycleStatus(table.id); }}
                style={{ left: `${table.x}%`, top: `${table.y + 14}%`, transform: "translate(-50%,-50%)" }}
                className={cn(
                  "absolute flex flex-col items-center justify-center border-2 rounded-xl transition-all hover:scale-110 shadow-sm",
                  table.capacity <= 2 ? "w-12 h-12" : table.capacity <= 4 ? "w-14 h-14" : "w-16 h-16",
                  STATUS_COLORS[table.status]
                )}
                title={`${table.name} — ${table.status}`}
              >
                <span className="text-xs font-bold">{table.name}</span>
                <span className="text-[9px] opacity-70">{table.capacity}p</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table List */}
        <div className="xl:w-80 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Table Status</h2>
          </div>
          <div className="divide-y divide-border overflow-y-auto" style={{ maxHeight: 400 }}>
            {tables.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
                <div className={cn("w-10 h-10 rounded-lg border flex flex-col items-center justify-center shrink-0", STATUS_COLORS[t.status])}>
                  <span className="text-xs font-bold">{t.name}</span>
                  <span className="text-[9px]">{t.capacity}p</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{t.status}</p>
                  {t.occupiedSince && <p className="text-xs text-muted-foreground">Since {t.occupiedSince} · {t.server}</p>}
                </div>
                <button
                  onClick={() => cycleStatus(t.id)}
                  className="text-xs px-2 py-1 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Change
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Room Service ────────────────────────────────────────────────────────────

interface RoomOrder {
  id: string;
  room: string;
  guest: string;
  items: string;
  total: number;
  status: "received" | "preparing" | "out-for-delivery" | "delivered";
  time: string;
}

const STATUS_STEPS = ["received", "preparing", "out-for-delivery", "delivered"] as const;

const ORDER_STATUS_STYLES: Record<string, string> = {
  received: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  preparing: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  "out-for-delivery": "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400",
  delivered: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
};

const INITIAL_ROOM_ORDERS: RoomOrder[] = [
  { id: "RS-001", room: "214", guest: "Alice Johnson", items: "Wagyu Burger, Artisan Coffee x2", total: 44, status: "out-for-delivery", time: "13:42" },
  { id: "RS-002", room: "108", guest: "Brian Chen", items: "Truffle Risotto, Signature Cocktail", total: 44, status: "preparing", time: "13:55" },
  { id: "RS-003", room: "302", guest: "Sofia Martinez", items: "Burrata Salad, Sparkling Water", total: 24, status: "received", time: "14:02" },
  { id: "RS-004", room: "415", guest: "David Kim", items: "Molten Lava Cake x2, Espresso", total: 34, status: "delivered", time: "13:20" },
  { id: "RS-005", room: "507", guest: "Emma Wilson", items: "Club Sandwich, Fresh Juice x2", total: 38, status: "preparing", time: "14:10" },
];

function RoomService() {
  const [orders, setOrders] = useState<RoomOrder[]>(INITIAL_ROOM_ORDERS);

  const advance = (id: string) => {
    setOrders(os => os.map(o => {
      if (o.id !== id) return o;
      const idx = STATUS_STEPS.indexOf(o.status as typeof STATUS_STEPS[number]);
      if (idx < STATUS_STEPS.length - 1) return { ...o, status: STATUS_STEPS[idx + 1] };
      return o;
    }));
  };

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Room Service Orders</h1>
          <div className="flex gap-3">
            {STATUS_STEPS.map(s => (
              <div key={s} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize", ORDER_STATUS_STYLES[s])}>
                {statusCounts[s] || 0} {s.replace(/-/g, " ")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-8">
        {orders.map(order => {
          const stepIdx = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);
          return (
            <div key={order.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-sm">{order.id}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium capitalize", ORDER_STATUS_STYLES[order.status])}>
                      {order.status.replace(/-/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Room <strong className="text-foreground">{order.room}</strong> · {order.guest} · Ordered at {order.time}
                  </p>
                  <p className="text-sm mt-1">{order.items}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold">${order.total}</p>
                  {order.status !== "delivered" && (
                    <button
                      onClick={() => advance(order.id)}
                      className="mt-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      Advance →
                    </button>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                {STATUS_STEPS.map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className={cn("flex items-center gap-1.5 text-xs font-medium capitalize transition-colors", idx <= stepIdx ? "text-primary" : "text-muted-foreground/40")}>
                      <div className={cn("w-2.5 h-2.5 rounded-full border-2 transition-colors", idx <= stepIdx ? "bg-primary border-primary" : "border-muted-foreground/30")} />
                      <span className="hidden sm:inline">{step.replace(/-/g, " ")}</span>
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={cn("flex-1 h-0.5 rounded transition-colors", idx < stepIdx ? "bg-primary" : "bg-muted-foreground/20")} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── F&B Inventory ───────────────────────────────────────────────────────────

interface StockItem {
  id: number;
  name: string;
  category: string;
  unit: string;
  current: number;
  par: number;
  reorderAt: number;
  supplier: string;
}

const STOCK: StockItem[] = [
  { id: 1, name: "Arborio Rice", category: "Dry Goods", unit: "kg", current: 45, par: 50, reorderAt: 20, supplier: "Metro Wholesale" },
  { id: 2, name: "Black Truffle", category: "Speciality", unit: "g", current: 120, par: 500, reorderAt: 150, supplier: "Luxury Ingredients Co." },
  { id: 3, name: "Wagyu Beef", category: "Meat", unit: "kg", current: 18, par: 30, reorderAt: 10, supplier: "Premium Meats" },
  { id: 4, name: "Fresh Burrata", category: "Dairy", unit: "pcs", current: 8, par: 24, reorderAt: 8, supplier: "Cheese & Co." },
  { id: 5, name: "Heirloom Tomatoes", category: "Produce", unit: "kg", current: 12, par: 15, reorderAt: 5, supplier: "Farm Direct" },
  { id: 6, name: "Dark Chocolate", category: "Baking", unit: "kg", current: 6, par: 10, reorderAt: 3, supplier: "Valrhona" },
  { id: 7, name: "Vanilla Ice Cream", category: "Frozen", unit: "L", current: 14, par: 20, reorderAt: 8, supplier: "Artisan Creamery" },
  { id: 8, name: "Gin (Premium)", category: "Spirits", unit: "bottles", current: 22, par: 36, reorderAt: 12, supplier: "Spirits World" },
  { id: 9, name: "Elderflower Cordial", category: "Mixer", unit: "bottles", current: 4, par: 12, reorderAt: 4, supplier: "Fever-Tree" },
  { id: 10, name: "Espresso Beans", category: "Beverages", unit: "kg", current: 8, par: 15, reorderAt: 5, supplier: "Blue Bottle Coffee" },
];

function getStockLevel(item: StockItem): "critical" | "low" | "ok" {
  const ratio = item.current / item.par;
  if (item.current <= item.reorderAt) return ratio < 0.25 ? "critical" : "low";
  return "ok";
}

const LEVEL_STYLES = {
  critical: "text-red-600 dark:text-red-400",
  low: "text-amber-600 dark:text-amber-400",
  ok: "text-emerald-600 dark:text-emerald-400",
};

const BAR_STYLES = {
  critical: "bg-red-500",
  low: "bg-amber-500",
  ok: "bg-emerald-500",
};

function FAndBInventory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(STOCK.map(i => i.category)))];
  const filtered = STOCK.filter(i =>
    (filter === "All" || i.category === filter) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const criticalCount = STOCK.filter(i => getStockLevel(i) === "critical").length;
  const lowCount = STOCK.filter(i => getStockLevel(i) === "low").length;

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">F&B Inventory</h1>
          <div className="flex gap-3 text-sm">
            {criticalCount > 0 && <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium">{criticalCount} Critical</span>}
            {lowCount > 0 && <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg font-medium">{lowCount} Low</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 min-w-0 max-w-xs">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-all border",
                  filter === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              {["Item", "Category", "Stock Level", "Current / Par", "Supplier", "Status"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(item => {
              const level = getStockLevel(item);
              const pct = Math.min(100, (item.current / item.par) * 100);
              return (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3 font-medium">{item.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-5 py-3 w-36">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", BAR_STYLES[level])} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs w-8 text-right">{Math.round(pct)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <span className={cn("font-semibold", LEVEL_STYLES[level])}>{item.current}</span> / {item.par} {item.unit}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{item.supplier}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                      level === "critical" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                      level === "low" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    )}>
                      {level === "ok" ? "In Stock" : level === "low" ? "Reorder Soon" : "Critical"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KitchenDisplay() {
  const [columns, setColumns] = useState({
    incoming: [
      { id: "0891", table: "T14", time: "12:45", items: ["2x Wagyu Burger", "1x Caesar Salad", "1x House Fries"], priority: "normal" },
      { id: "0892", table: "R305", time: "12:50", items: ["1x Grilled Fish", "2x Seasonal Vegetables"], priority: "rush" },
      { id: "0893", table: "T22", time: "13:02", items: ["1x Pasta Carbonara"], priority: "vip" },
    ],
    inProgress: [
      { id: "0890", table: "T08", time: "12:30", items: ["2x Ribeye Steak", "1x Lobster Tail"], priority: "vip" },
      { id: "0888", table: "T19", time: "12:15", items: ["3x House Burger", "2x French Fries"], priority: "normal" },
    ],
    ready: [
      { id: "0887", table: "T11", time: "12:00", items: ["1x Chicken Parmesan"], priority: "normal" },
      { id: "0886", table: "R220", time: "11:55", items: ["1x Soup", "1x Salad"], priority: "normal" },
    ],
  });

  const [station, setStation] = useState("All");
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateElapsed = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const orderTime = new Date();
    orderTime.setHours(hours, minutes, 0);
    const elapsed = Math.floor((currentTime.getTime() - orderTime.getTime()) / 60000);
    return elapsed;
  };

  const moveCard = (fromColumn: string, toColumn: string, cardId: string) => {
    const card = columns[fromColumn as keyof typeof columns].find(c => c.id === cardId);
    if (!card) return;
    setColumns(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn as keyof typeof columns].filter(c => c.id !== cardId),
      [toColumn]: [...prev[toColumn as keyof typeof columns], card],
    }));
  };

  const getCardBorderColor = (time: string) => {
    const elapsed = calculateElapsed(time);
    if (elapsed > 15) return "border-red-500";
    if (elapsed > 8) return "border-amber-500";
    return "border-emerald-500";
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "vip") return "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400";
    if (priority === "rush") return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
  };

  const TicketCard = ({ card, columnKey }: any) => {
    const elapsed = calculateElapsed(card.time);
    return (
      <motion.div
        layout
        className={cn(
          "p-4 bg-card border-2 rounded-xl shadow-sm hover:shadow-md transition-shadow",
          getCardBorderColor(card.time)
        )}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-bold text-lg text-foreground">#{card.id}</div>
            <div className="text-xs text-muted-foreground">{card.table} · {elapsed} min</div>
          </div>
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full capitalize", getPriorityBadge(card.priority))}>
            {card.priority}
          </span>
        </div>
        <div className="space-y-1 mb-4">
          {card.items.map((item: string, idx: number) => (
            <div key={idx} className="text-sm text-foreground">{item}</div>
          ))}
        </div>
        <div className="flex gap-2">
          {columnKey === "incoming" && (
            <button
              onClick={() => moveCard("incoming", "inProgress", card.id)}
              className="flex-1 px-2 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start
            </button>
          )}
          {columnKey === "inProgress" && (
            <button
              onClick={() => moveCard("inProgress", "ready", card.id)}
              className="flex-1 px-2 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Ready
            </button>
          )}
          {columnKey === "ready" && (
            <button
              onClick={() => moveCard("ready", "ready", card.id)}
              className="flex-1 px-2 py-1.5 text-xs font-medium bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Deliver
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Kitchen Display</h1>
            <div className="text-xs text-muted-foreground mt-1">{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Hot Kitchen", "Cold Kitchen", "Pastry", "Grill"].map(s => (
            <button
              key={s}
              onClick={() => setStation(s)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                station === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {["incoming", "inProgress", "ready"].map(col => {
          const headers = { incoming: "Incoming", inProgress: "In Progress", ready: "Ready" };
          const headerColors = { incoming: "bg-blue-500", inProgress: "bg-amber-500", ready: "bg-emerald-500" };
          return (
            <div key={col} className="space-y-3">
              <div className={cn("h-10 rounded-t-lg flex items-center px-4 text-sm font-semibold text-white", headerColors[col as keyof typeof headerColors])}>
                {headers[col as keyof typeof headers]}
              </div>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {columns[col as keyof typeof columns].map(card => (
                    <TicketCard key={card.id} card={card} columnKey={col} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Avg Ticket Time", value: "12m", icon: Clock, color: "from-blue-400 to-blue-500" },
          { label: "Orders Today", value: "47", icon: UtensilsCrossed, color: "from-emerald-400 to-emerald-500" },
          { label: "Pending Orders", value: "5", icon: Clock, color: "from-amber-400 to-amber-500" },
          { label: "Rush Orders", value: "2", icon: Printer, color: "from-red-400 to-red-500" },
        ].map((stat, idx) => (
          <div key={idx} className={cn("p-4 rounded-xl bg-gradient-to-r text-white shadow-sm", `${stat.color}`)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-90">{stat.label}</div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
              </div>
              <stat.icon className="w-8 h-8 opacity-80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarManagement() {
  const [tabs, setTabs] = useState([
    { id: "B001", guest: "T05", items: ["Mocktail 1", "Iced Tea"], total: "$28.50", status: "Open" },
    { id: "B002", guest: "T12", items: ["Fresh Juice", "Sparkling Water"], total: "$15.25", status: "Closed" },
    { id: "B003", guest: "R401", items: ["House Special"], total: "$12.00", status: "Open" },
    { id: "B004", guest: "T08", items: ["Mocktail 1", "Mocktail 1", "Iced Tea"], total: "$45.75", status: "On Hold" },
  ]);

  const openTabs = tabs.filter(t => t.status === "Open").length;
  const revenue = tabs.reduce((sum, t) => {
    const amount = parseFloat(t.total.replace("$", ""));
    return sum + amount;
  }, 0);
  const avgTabValue = (revenue / tabs.length).toFixed(2);
  const mostPopular = "Mocktail of the Day";

  const beverages = [
    { name: "Mocktail 1", price: "$8.50" },
    { name: "Iced Tea", price: "$4.50" },
    { name: "Fresh Juice", price: "$5.25" },
    { name: "Sparkling Water", price: "$3.00" },
    { name: "House Special", price: "$12.00" },
    { name: "Smoothie", price: "$6.75" },
  ];

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Bar</h1>
            <div className="text-xs text-muted-foreground mt-1">Shift Summary: {openTabs} open tabs · Revenue: ${revenue.toFixed(2)}</div>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Open New Tab
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Open Tabs", value: openTabs.toString(), icon: Wine, color: "from-purple-400 to-purple-500" },
          { label: "Today's Revenue", value: `$${revenue.toFixed(2)}`, icon: Banknote, color: "from-emerald-400 to-emerald-500" },
          { label: "Most Popular", value: "Mocktail", icon: Coffee, color: "from-amber-400 to-amber-500" },
          { label: "Avg Tab Value", value: `$${avgTabValue}`, icon: CreditCard, color: "from-blue-400 to-blue-500" },
        ].map((stat, idx) => (
          <div key={idx} className={cn("p-4 rounded-xl bg-gradient-to-r text-white shadow-sm", `${stat.color}`)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-90">{stat.label}</div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
              </div>
              <stat.icon className="w-8 h-8 opacity-80" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Active Tabs</h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  {["Tab ID", "Guest/Table", "Items", "Total", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tabs.map(tab => (
                  <tr key={tab.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{tab.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{tab.guest}</td>
                    <td className="px-4 py-3 text-xs">{tab.items.length} items</td>
                    <td className="px-4 py-3 font-medium">{tab.total}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        tab.status === "Open" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                        tab.status === "Closed" ? "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400" :
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      )}>
                        {tab.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs space-x-2">
                      <button className="px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors">Add</button>
                      <button className="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">Close</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Order</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-700 dark:text-red-400">3 items running low</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {beverages.map((bev, idx) => (
                <button
                  key={idx}
                  className="p-3 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-sm font-medium text-foreground transition-colors"
                >
                  {bev.name}
                  <div className="text-xs text-muted-foreground">{bev.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
