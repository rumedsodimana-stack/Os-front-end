import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc, 
  doc,
  Timestamp,
  orderBy
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-utils";
import { useAuth } from "./AuthContext";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  available: boolean;
  rating?: number;
  prepTime?: string;
}

export interface Order {
  id: string;
  guestId?: string;
  roomNumber?: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "Pending" | "Preparing" | "Delivered" | "Cancelled";
  timestamp: Date;
}

interface MenuContextType {
  menuItems: MenuItem[];
  orders: Order[];
  loading: boolean;
  placeOrder: (order: Omit<Order, "id" | "timestamp" | "status">) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  updateStock: (itemId: string, newStock: number) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const menuPath = "menu";
    if ((import.meta as any).env?.DEV) { setLoading(false); return; }
    const menuQuery = query(collection(db, menuPath), orderBy("category"));
    const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenuItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, menuPath);
    });

    const ordersPath = "orders";
    const ordersQuery = query(collection(db, ordersPath), orderBy("timestamp", "desc"));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orderData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp)
        } as Order;
      });
      setOrders(orderData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, ordersPath);
      setLoading(false);
    });

    return () => {
      unsubscribeMenu();
      unsubscribeOrders();
    };
  }, [user]);

  const placeOrder = useCallback(async (order: Omit<Order, "id" | "timestamp" | "status">) => {
    const path = "orders";
    try {
      await addDoc(collection(db, path), {
        ...order,
        status: "Pending",
        timestamp: Timestamp.now()
      });

      // Update stock for each item
      for (const item of order.items) {
        const menuItem = menuItems.find(mi => mi.id === item.itemId);
        if (menuItem) {
          await updateDoc(doc(db, "menu", item.itemId), {
            stock: Math.max(0, menuItem.stock - item.quantity)
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, [menuItems]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]) => {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const updateStock = useCallback(async (itemId: string, newStock: number) => {
    const path = `menu/${itemId}`;
    try {
      await updateDoc(doc(db, "menu", itemId), { stock: newStock });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems, orders, loading, placeOrder, updateOrderStatus, updateStock }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
