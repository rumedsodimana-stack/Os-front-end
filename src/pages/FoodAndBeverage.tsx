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
      case "Room Service":
      case "Inventory":
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{activeSubmenu}</h2>
            <p className="text-muted-foreground max-w-md">
              This module is currently under construction.
            </p>
          </div>
        );
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
