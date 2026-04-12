import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useMenu, MenuItem } from "../context/MenuContext";
import { useTables, Table } from "../context/TableContext";
import { useBookings } from "../context/BookingContext";
import { useGuests } from "../context/GuestContext";
import { KPICard } from "../components/ui/KPICard";
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
  BedDouble,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

interface FoodAndBeverageProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

export function FoodAndBeverage({ aiEnabled, activeSubmenu = "Overview" }: FoodAndBeverageProps) {
  const { loading } = useMenu();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <FAndBOverview aiEnabled={aiEnabled} />;
      case "Smart Menu (4D)":
        return <SmartMenu4D />;
      case "POS":
        return <POSSystem />;
      case "Kitchen Display (KDS)":
        return <KitchenDisplay />;
      case "Table Management":
        return <TableManagement />;
      case "Room Service":
        return <RoomService />;
      case "Inventory":
        return <FAndBInventory />;
      case "Settings":
        return <FAndBSettings />;
      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Food & Beverage</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and view {activeSubmenu.toLowerCase()} information.</p>
          </div>
        </div>
      </div>
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
    </div>
  );
}

function FAndBOverview({ aiEnabled }: { aiEnabled: boolean }) {
  const { menuItems, orders } = useMenu();
  
  const todayRevenue = orders
    .filter(o => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);
  
  const activeOrdersCount = orders.filter(o => ["Pending", "Preparing"].includes(o.status)).length;
  const lowStockItems = menuItems.filter(i => i.stock < 10).length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          label="Today's Revenue" 
          value={`$${todayRevenue.toLocaleString()}`} 
          change="Real-time" 
          trend="up" 
          icon={UtensilsCrossed} 
          color="blue" 
        />
        <KPICard 
          label="Active Orders" 
          value={activeOrdersCount.toString()} 
          change="Needs attention" 
          trend="up" 
          icon={ShoppingCart} 
          color="amber" 
        />
        <KPICard 
          label="Avg Prep Time" 
          value="18m" 
          change="On target" 
          trend="neutral" 
          icon={Clock} 
          color="emerald" 
        />
        <KPICard 
          label="Low Stock Items" 
          value={lowStockItems.toString()} 
          change="Needs attention" 
          trend="down" 
          icon={Info} 
          color="rose" 
        />
      </div>
    </div>
  );
}

// 4D Interactive Smart Menu
function SmartMenu4D() {
  const { menuItems, placeOrder } = useMenu();
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
  const [selectedItemForWine, setSelectedItemForWine] = useState<MenuItem | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const categories = ["All", "Starters", "Mains", "Desserts", "Beverages"];

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  const addToCart = (item: MenuItem) => {
    if (item.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      await placeOrder({
        items: cart.map(c => ({
          itemId: c.item.id,
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price
        })),
        total: cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0)
      });
      setCart([]);
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const cartTotal = cart.reduce((sum, {item, quantity}) => sum + (item.price * quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="mb-6">
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
            <MenuCard4D 
              key={item.id} 
              item={item} 
              onAdd={() => addToCart(item)} 
              onWinePairing={() => setSelectedItemForWine(item)}
            />
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
              disabled={cart.length === 0 || isPlacingOrder}
              onClick={handlePlaceOrder}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedItemForWine && (
          <WinePairingModal 
            item={selectedItemForWine} 
            onClose={() => setSelectedItemForWine(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 4D Interactive Card Component
function MenuCard4D({ item, onAdd, onWinePairing }: { item: any, onAdd: () => void, onWinePairing: () => void, key?: any }) {
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
          
          <p className="text-sm text-muted-foreground mb-2 flex-1" style={{ transform: "translateZ(10px)" }}>
            {item.description}
          </p>

          <div className="flex items-center gap-4 mb-4" style={{ transform: "translateZ(15px)" }}>
            <div className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
              item.stock > 10 ? "bg-emerald-100 text-emerald-700" :
              item.stock > 0 ? "bg-amber-100 text-amber-700" :
              "bg-rose-100 text-rose-700"
            )}>
              {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
            </div>
            {item.category === "Mains" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onWinePairing();
                }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full hover:bg-purple-100 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                AI Wine Pairing
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Clock className="w-3 h-3" />
              {item.prepTime}
            </div>
            <button 
              disabled={item.stock <= 0}
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  const { menuItems, placeOrder } = useMenu();
  const { tables, updateTableStatus } = useTables();
  const { bookings } = useBookings();
  const { guests, updateGuest } = useGuests();

  const [activeCategory, setActiveCategory] = useState("All");
  const [orderType, setOrderType] = useState<"Dine-in" | "Takeaway" | "Room Service">("Dine-in");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cart, setCart] = useState<{item: MenuItem, quantity: number, notes?: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(10); // Default 10%
  const [splitCount, setSplitCount] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Room Charge">("Cash");
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [showRecentOrders, setShowRecentOrders] = useState(false);

  const categories = ["All", "Starters", "Mains", "Desserts", "Beverages"];

  const checkedInBookings = useMemo(() => {
    return bookings.filter(b => b.status === "Checked In");
  }, [bookings]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, menuItems]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id && !i.notes);
      if (existing) {
        return prev.map(i => (i.item.id === item.id && !i.notes) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number, notes?: string) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === id && i.notes === notes) {
        const newQuantity = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQuantity };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const updateNotes = (id: string, currentNotes: string | undefined, newNotes: string) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === id && i.notes === currentNotes) {
        return { ...i, notes: newNotes };
      }
      return i;
    }));
  };

  const removeFromCart = (id: string, notes?: string) => {
    setCart(prev => prev.filter(i => !(i.item.id === id && i.notes === notes)));
  };

  const subtotal = cart.reduce((sum, {item, quantity}) => sum + (item.price * quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const serviceChargeAmount = (subtotal * serviceCharge) / 100;
  
  const selectedBooking = useMemo(() => checkedInBookings.find(b => b.id === selectedBookingId), [checkedInBookings, selectedBookingId]);
  const selectedGuest = useMemo(() => guests.find(g => g.firstName + " " + g.lastName === selectedBooking?.guestName), [guests, selectedBooking]);
  
  // Calculate total before points to determine max points value
  const prePointsTax = (subtotal - discountAmount + serviceChargeAmount) * 0.08;
  const prePointsTotal = subtotal - discountAmount + serviceChargeAmount + prePointsTax;
  
  const pointsValue = redeemPoints && selectedGuest ? Math.min(selectedGuest.loyaltyPoints / 100, prePointsTotal) : 0; // 100 points = $1
  
  const tax = (subtotal - discountAmount + serviceChargeAmount - pointsValue) * 0.08; // 8% tax
  const total = Math.max(0, subtotal - discountAmount + serviceChargeAmount + tax - pointsValue);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const booking = checkedInBookings.find(b => b.id === selectedBookingId);
      
      await placeOrder({
        items: cart.map(c => ({
          itemId: c.item.id,
          name: c.item.name + (c.notes ? ` (${c.notes})` : ""),
          quantity: c.quantity,
          price: c.item.price
        })),
        total: total,
        roomNumber: orderType === "Room Service" ? booking?.roomNumber : undefined,
        guestId: booking?.id
      });

      if (selectedTableId && orderType === "Dine-in") {
        await updateTableStatus(selectedTableId, "Occupied");
      }

      // Deduct loyalty points if redeemed
      if (redeemPoints && selectedGuest) {
        const pointsToDeduct = Math.min(selectedGuest.loyaltyPoints, Math.floor(pointsValue * 100));
        await updateGuest(selectedGuest.id, {
          loyaltyPoints: selectedGuest.loyaltyPoints - pointsToDeduct
        });
      }

      setCart([]);
      setSelectedTableId(null);
      setSelectedBookingId(null);
      setShowPaymentModal(false);
      setRedeemPoints(false);
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] -mx-4 md:-mx-8 -mb-8">
      {/* Main POS Area */}
      <div className="flex-1 flex flex-col px-4 md:px-8 overflow-hidden">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
              {(["Dine-in", "Takeaway", "Room Service"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setOrderType(type);
                    setSelectedTableId(null);
                    setSelectedBookingId(null);
                  }}
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
            
            <button 
              onClick={() => setShowRecentOrders(!showRecentOrders)}
              className={cn(
                "p-2 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium",
                showRecentOrders ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden md:inline">Recent Orders</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {orderType === "Dine-in" && (
              <select 
                value={selectedTableId || ""} 
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select Table</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id} disabled={t.status === "Occupied"}>
                    Table {t.id} ({t.status})
                  </option>
                ))}
              </select>
            )}
            {orderType === "Room Service" && (
              <select 
                value={selectedBookingId || ""} 
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select Room / Guest</option>
                {checkedInBookings.map(b => (
                  <option key={b.id} value={b.id}>
                    Room {b.roomNumber} - {b.guestName}
                  </option>
                ))}
              </select>
            )}
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

        {/* Menu Grid or Recent Orders */}
        <div className="flex-1 overflow-y-auto pb-8 pr-2">
          {showRecentOrders ? (
            <RecentOrdersView />
          ) : (
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
          )}
        </div>
      </div>

      {/* Ticket / Cart Sidebar */}
      <div className="w-full lg:w-96 bg-card border-l border-border flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Current Order</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCart([])}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
              >
                Clear
              </button>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                Ticket #4092
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {orderType === "Dine-in" && (
                <>
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Table: {selectedTableId || "Not Selected"}</span>
                </>
              )}
              {orderType === "Room Service" && (
                <>
                  <BedDouble className="w-4 h-4" />
                  <span>Room: {checkedInBookings.find(b => b.id === selectedBookingId)?.roomNumber || "Not Selected"}</span>
                </>
              )}
              {orderType === "Takeaway" && (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Takeaway Order</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
              <ShoppingCart className="w-12 h-12 mb-2" />
              <p>No items added yet</p>
            </div>
          ) : (
            cart.map((cartItem, idx) => (
              <div key={`${cartItem.item.id}-${idx}`} className="flex flex-col gap-2 bg-background p-3 rounded-xl border border-border group">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-sm leading-tight">{cartItem.item.name}</p>
                    <p className="text-xs text-muted-foreground">${cartItem.item.price}</p>
                  </div>
                  <div className="font-semibold text-sm">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </div>
                </div>
                
                {/* Modifiers / Notes */}
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Add note (e.g. No onions)" 
                    value={cartItem.notes || ""}
                    onChange={(e) => updateNotes(cartItem.item.id, cartItem.notes, e.target.value)}
                    className="flex-1 bg-secondary/50 border-none text-[10px] px-2 py-1 rounded focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 border border-border">
                    <button 
                      onClick={() => updateQuantity(cartItem.item.id, -1, cartItem.notes)}
                      className="p-1 hover:bg-background rounded-md transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{cartItem.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(cartItem.item.id, 1, cartItem.notes)}
                      className="p-1 hover:bg-background rounded-md transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(cartItem.item.id, cartItem.notes)}
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
            
            {/* Discount & Service Charge Controls */}
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-muted-foreground">Disc %</span>
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-12 bg-background border border-border rounded px-1 py-0.5 text-xs"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-xs text-muted-foreground">Svc %</span>
                <input 
                  type="number" 
                  value={serviceCharge} 
                  onChange={(e) => setServiceCharge(Number(e.target.value))}
                  className="w-12 bg-background border border-border rounded px-1 py-0.5 text-xs"
                />
              </div>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>Discount ({discount}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Service Charge ({serviceCharge}%)</span>
              <span>+${serviceChargeAmount.toFixed(2)}</span>
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
          
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowPaymentModal(true)}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Checkout / Pay
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowPaymentModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <h3 className="font-bold text-lg">Checkout</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-secondary/20 p-4 rounded-2xl border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount Due</p>
                  <p className="text-3xl font-bold text-primary">${total.toFixed(2)}</p>
                  {pointsValue > 0 && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      Includes ${pointsValue.toFixed(2)} points discount
                    </p>
                  )}
                </div>

                {selectedGuest && selectedGuest.loyaltyPoints > 0 && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-emerald-900">Loyalty Points</p>
                        <p className="text-[10px] text-emerald-700">{selectedGuest.loyaltyPoints} points available</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setRedeemPoints(!redeemPoints)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
                        redeemPoints 
                          ? "bg-emerald-600 text-white" 
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      )}
                    >
                      {redeemPoints ? "Redeemed" : "Redeem"}
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-semibold">Split Bill</p>
                  <div className="flex items-center gap-4 bg-secondary/50 p-3 rounded-xl border border-border">
                    <span className="text-sm text-muted-foreground flex-1">Split between</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))} className="p-1 bg-background rounded border border-border"><Minus className="w-4 h-4"/></button>
                      <span className="font-bold w-4 text-center">{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount + 1)} className="p-1 bg-background rounded border border-border"><Plus className="w-4 h-4"/></button>
                    </div>
                  </div>
                  {splitCount > 1 && (
                    <p className="text-xs text-center text-muted-foreground">
                      Each person pays: <span className="font-bold text-foreground">${(total / splitCount).toFixed(2)}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Cash", "Card", "Room Charge"] as const).map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        disabled={method === "Room Charge" && orderType !== "Room Service" && !selectedBookingId}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                          paymentMethod === method 
                            ? "bg-primary/10 border-primary text-primary shadow-sm" 
                            : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                          method === "Room Charge" && orderType !== "Room Service" && !selectedBookingId && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {method === "Cash" && <Banknote className="w-5 h-5" />}
                        {method === "Card" && <CreditCard className="w-5 h-5" />}
                        {method === "Room Charge" && <BedDouble className="w-5 h-5" />}
                        <span className="text-[10px] font-bold uppercase">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={isPlacingOrder || (paymentMethod === "Room Charge" && !selectedBookingId)}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  {isPlacingOrder ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Complete Payment & Order
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecentOrdersView() {
  const { orders } = useMenu();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Recent Tickets</h3>
        <p className="text-xs text-muted-foreground">{orders.length} orders found</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">Ticket #{order.id.slice(-4).toUpperCase()}</span>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                    order.status === "Preparing" ? "bg-amber-100 text-amber-700" :
                    order.status === "Cancelled" ? "bg-rose-100 text-rose-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {order.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">{order.roomNumber ? `Room ${order.roomNumber}` : "Dine-in"}</p>
              </div>
            </div>
            
            <div className="space-y-1 border-t border-border/50 pt-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WinePairingModal({ item, onClose }: { item: any, onClose: () => void }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPairing = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Suggest a specific wine pairing for this dish: "${item.name} - ${item.description}". Keep it short and professional, like a sommelier's recommendation. Mention why it pairs well.`,
          config: {
            systemInstruction: "You are a world-class sommelier. Provide concise, elegant wine pairing suggestions.",
          }
        });
        setSuggestion(response.text || "A crisp Chardonnay would pair beautifully with this dish.");
      } catch (error) {
        console.error("AI Pairing Error:", error);
        setSuggestion("We recommend a full-bodied Cabernet Sauvignon to complement the rich flavors of this dish.");
      } finally {
        setLoading(false);
      }
    };

    fetchPairing();
  }, [item]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden relative z-10"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">AI Sommelier</h3>
              <p className="text-xs text-muted-foreground">Perfect pairing for {item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-purple-500" />
              </motion.div>
              <p className="text-sm text-muted-foreground animate-pulse">Consulting the cellar...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-secondary/20 p-6 rounded-2xl border border-border italic text-foreground leading-relaxed relative">
                <span className="absolute -top-3 -left-2 text-4xl text-purple-200 font-serif">"</span>
                {suggestion}
                <span className="absolute -bottom-6 -right-2 text-4xl text-purple-200 font-serif">"</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Wine className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-900">Sommelier's Choice</p>
                    <p className="text-[10px] text-purple-700">Available by the glass or bottle</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm">
                  Add to Order
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 bg-secondary/10 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-card border border-border text-foreground rounded-xl text-xs font-medium hover:bg-secondary transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TableManagement() {
  const { tables, updateTableStatus } = useTables();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleUpdateStatus = (id: string, newStatus: Table["status"]) => {
    updateTableStatus(id, newStatus);
    setSelectedTable(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-6 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium text-muted-foreground">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-sm font-medium text-muted-foreground">Needs Cleaning</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Table
          </button>
        </div>
      </div>

      {/* Visual Floor Plan */}
      <div className="bg-card border border-border rounded-3xl shadow-lg p-8 min-h-[600px] relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-secondary/50 px-8 py-2 rounded-b-2xl border-x border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Entrance
        </div>
        
        <div className="absolute bottom-0 right-0 bg-secondary/50 px-8 py-4 rounded-tl-3xl border-t border-l border-border flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-primary" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Kitchen Area</span>
        </div>

        <div className="relative w-full h-full">
          {tables.map(table => (
            <motion.div
              key={table.id}
              layoutId={table.id}
              onClick={() => setSelectedTable(table)}
              initial={false}
              animate={{ 
                left: `${table.x}%`, 
                top: `${table.y}%`,
                scale: selectedTable?.id === table.id ? 1.1 : 1
              }}
              className={cn(
                "absolute w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-md z-10",
                table.status === "Available" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" :
                table.status === "Occupied" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" :
                table.status === "Reserved" ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400" :
                "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400"
              )}
            >
              <span className="text-xl font-black">{table.id}</span>
              <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
                <User className="w-3 h-3" />
                {table.capacity}
              </div>
              {table.status === "Occupied" && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                  <Clock className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedTable && (
          <TableActionModal 
            table={selectedTable} 
            onClose={() => setSelectedTable(null)} 
            onUpdate={handleUpdateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TableActionModal({ table, onClose, onUpdate }: { table: Table, onClose: () => void, onUpdate: (id: string, status: Table["status"]) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden relative z-10"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div>
            <h3 className="font-bold text-lg">Table {table.id}</h3>
            <p className="text-xs text-muted-foreground">Capacity: {table.capacity} guests</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {([
              { status: "Available", icon: CheckCircle2, color: "emerald" },
              { status: "Occupied", icon: User, color: "blue" },
              { status: "Reserved", icon: Calendar, color: "amber" },
              { status: "Needs Cleaning", icon: AlertCircle, color: "rose" }
            ] as const).map(opt => (
              <button
                key={opt.status}
                onClick={() => onUpdate(table.id, opt.status)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                  table.status === opt.status 
                    ? `bg-${opt.color}-500 text-white border-transparent shadow-md` 
                    : "bg-background border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <opt.icon className="w-6 h-6" />
                <span className="text-xs font-bold">{opt.status}</span>
              </button>
            ))}
          </div>

          {table.status === "Reserved" && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Upcoming Reservation</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-medium text-amber-800">Mr. Anderson</span>
                </div>
                <span className="text-xs font-bold text-amber-700">7:30 PM</span>
              </div>
            </div>
          )}

          {table.status === "Occupied" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Server</span>
                <span className="font-bold">{table.server || "Not Assigned"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Time Seated</span>
                <span className="font-bold">{table.time || "Just now"}</span>
              </div>
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors">
                Open POS Order
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RoomService() {
  const { orders, updateOrderStatus } = useMenu();
  const [view, setView] = useState<"Orders" | "Delivery Tracking">("Orders");
  
  const roomServiceOrders = useMemo(() => {
    return orders.filter(o => o.roomNumber !== undefined);
  }, [orders]);

  const activeDeliveries = useMemo(() => {
    return roomServiceOrders.filter(o => o.status === "Delivered");
  }, [roomServiceOrders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
          {(["Orders", "Delivery Tracking"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v}
            </button>
          ))}
        </div>
        {view === "Delivery Tracking" && (
          <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            {activeDeliveries.length} Active Deliveries
          </div>
        )}
      </div>

      {view === "Orders" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Preparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Delivering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Completed</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 grid gap-4">
              {roomServiceOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No room service orders found.
                </div>
              ) : (
                roomServiceOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-2 rounded-full mt-1",
                        order.status === "Pending" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                        order.status === "Preparing" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                        order.status === "Delivered" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      )}>
                        <BedDouble className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Room {order.roomNumber}</h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            order.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                            order.status === "Preparing" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                            order.status === "Delivered" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          )}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Order {order.id.slice(-6)} • {order.items.length} items • ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {order.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="bg-secondary text-foreground rounded-md px-2 py-1 text-xs border-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeliveries.length === 0 ? (
            <div className="col-span-full bg-card border border-dashed border-border rounded-3xl p-20 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">No active deliveries at the moment.</p>
            </div>
          ) : (
            activeDeliveries.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">Room {order.roomNumber}</h3>
                    <p className="text-xs text-muted-foreground">Ticket #{order.id.slice(-4).toUpperCase()}</p>
                  </div>
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-y-0 left-0 bg-emerald-500"
                  />
                </div>
                
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Kitchen</span>
                  <span className="text-emerald-600">Delivering</span>
                  <span>Guest</span>
                </div>
                
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">John (Staff)</span>
                  </div>
                  <button 
                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Mark as Received
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function KitchenDisplay() {
  const { orders, updateOrderStatus } = useMenu();
  
  const activeOrders = useMemo(() => {
    return orders.filter(o => ["Pending", "Preparing"].includes(o.status))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Live Kitchen Feed</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-muted-foreground font-medium">New Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground font-medium">In Progress</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeOrders.length === 0 ? (
          <div className="col-span-full bg-card border border-dashed border-border rounded-3xl p-20 text-center">
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Kitchen is clear. No active orders.</p>
          </div>
        ) : (
          activeOrders.map((order) => (
            <motion.div 
              layout
              key={order.id} 
              className={cn(
                "bg-card border-2 rounded-2xl overflow-hidden flex flex-col shadow-sm",
                order.status === "Pending" ? "border-amber-500/30" : "border-blue-500/30"
              )}
            >
              <div className={cn(
                "p-4 flex justify-between items-center",
                order.status === "Pending" ? "bg-amber-500/10" : "bg-blue-500/10"
              )}>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ticket</span>
                  <p className="font-black text-lg">#{order.id.slice(-4).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Wait Time</span>
                  <p className="font-bold flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {Math.floor((new Date().getTime() - order.timestamp.getTime()) / 60000)}m
                  </p>
                </div>
              </div>

              <div className="p-4 flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-2">
                  {order.roomNumber ? (
                    <><BedDouble className="w-3 h-3" /> Room {order.roomNumber}</>
                  ) : (
                    <><UtensilsCrossed className="w-3 h-3" /> Dine-in</>
                  )}
                </div>
                
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-tight">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-secondary/30 border-t border-border mt-auto grid grid-cols-2 gap-2">
                {order.status === "Pending" ? (
                  <button 
                    onClick={() => updateOrderStatus(order.id, "Preparing")}
                    className="col-span-2 py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    Start Cooking
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order.id, "Delivered")}
                      className="py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      Ready
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, "Pending")}
                      className="py-3 bg-secondary text-foreground rounded-xl font-bold text-sm hover:bg-secondary/80 transition-colors"
                    >
                      Hold
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function FAndBInventory() {
  const { menuItems, updateStock } = useMenu();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  const handleStartEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setTempStock(item.stock);
  };

  const handleSaveStock = async (id: string) => {
    await updateStock(id, tempStock);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-muted-foreground">In Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium text-muted-foreground">Low Stock (&lt;10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Stock Level</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={tempStock} 
                          onChange={(e) => setTempStock(Number(e.target.value))}
                          className="w-20 bg-background border border-border rounded px-2 py-1 text-sm"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveStock(item.id)}
                          className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-1 bg-secondary text-foreground rounded hover:bg-secondary/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span className="font-bold text-lg">{item.stock}</span>
                        <button 
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.stock > 10 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      item.stock > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {item.stock > 10 ? "In Stock" : item.stock > 0 ? "Low Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function FAndBSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Food & Beverage Settings</h3>
          <p className="text-sm text-muted-foreground">Configure global parameters for POS, menus, and inventory.</p>
        </div>
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-primary" />
              Point of Sale (POS)
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Auto-Print Kitchen Tickets</p>
                  <p className="text-sm text-muted-foreground">Automatically send orders to the kitchen printer.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Default Gratuity</p>
                  <p className="text-sm text-muted-foreground">Standard service charge applied to all checks.</p>
                </div>
                <div className="relative">
                  <input type="number" defaultValue="18" className="bg-background border border-border rounded-lg pl-3 pr-7 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 w-24" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-primary" />
              Room Service
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Delivery Fee</p>
                  <p className="text-sm text-muted-foreground">Standard delivery charge for in-room dining.</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input type="number" defaultValue="5" className="bg-background border border-border rounded-lg pl-7 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 w-24" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Estimated Delivery Time</p>
                  <p className="text-sm text-muted-foreground">Default time shown to guests when ordering.</p>
                </div>
                <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50">
                  <option>30 mins</option>
                  <option>45 mins</option>
                  <option>60 mins</option>
                </select>
              </div>
            </div>
          </div>

        </div>
        <div className="p-6 border-t border-border bg-secondary/30 flex justify-end">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function GenericView({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">{title}</h3>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>No {title.toLowerCase()} records found.</p>
        </div>
      </div>
    </div>
  );
}
