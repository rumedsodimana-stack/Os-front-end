import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc, 
  doc,
  Timestamp,
  orderBy,
  where
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-utils";
import { useAuth } from "./AuthContext";

export interface FolioItem {
  id: string;
  description: string;
  amount: number;
  type: "Charge" | "Payment" | "Adjustment";
  category: "Room" | "F&B" | "Tax" | "Other";
  timestamp: Date;
}

export interface Folio {
  id: string;
  guestId: string;
  bookingId: string;
  roomNumber: string;
  status: "Open" | "Closed";
  totalBalance: number;
  items: FolioItem[];
}

interface FolioContextType {
  folios: Folio[];
  loading: boolean;
  addFolio: (folio: Omit<Folio, "id" | "items" | "totalBalance">) => Promise<void>;
  addFolioItem: (folioId: string, item: Omit<FolioItem, "id" | "timestamp">) => Promise<void>;
  closeFolio: (folioId: string) => Promise<void>;
  getFolioByBooking: (bookingId: string) => Folio | undefined;
}

const FolioContext = createContext<FolioContextType | undefined>(undefined);

export function FolioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [folios, setFolios] = useState<Folio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const path = "folios";
    const foliosQuery = query(collection(db, path));
    const unsubscribe = onSnapshot(foliosQuery, (snapshot) => {
      const folioData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          items: (data.items || []).map((item: any) => ({
            ...item,
            timestamp: item.timestamp instanceof Timestamp ? item.timestamp.toDate() : new Date(item.timestamp)
          }))
        } as Folio;
      });
      setFolios(folioData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addFolio = useCallback(async (folio: Omit<Folio, "id" | "items" | "totalBalance">) => {
    const path = "folios";
    try {
      await addDoc(collection(db, path), {
        ...folio,
        items: [],
        totalBalance: 0,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, []);

  const addFolioItem = useCallback(async (folioId: string, item: Omit<FolioItem, "id" | "timestamp">) => {
    const path = `folios/${folioId}`;
    const folio = folios.find(f => f.id === folioId);
    if (!folio) return;

    try {
      const newItem: FolioItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...item,
        timestamp: new Date()
      };

      const updatedItems = [...folio.items, newItem];
      const balanceChange = item.type === "Charge" ? item.amount : -item.amount;
      const newBalance = folio.totalBalance + balanceChange;

      await updateDoc(doc(db, "folios", folioId), {
        items: updatedItems.map(i => ({
          ...i,
          timestamp: Timestamp.fromDate(i.timestamp)
        })),
        totalBalance: newBalance
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, [folios]);

  const closeFolio = useCallback(async (folioId: string) => {
    const path = `folios/${folioId}`;
    try {
      await updateDoc(doc(db, "folios", folioId), {
        status: "Closed"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const getFolioByBooking = useCallback((bookingId: string) => {
    return folios.find(f => f.bookingId === bookingId);
  }, [folios]);

  return (
    <FolioContext.Provider value={{ folios, loading, addFolio, addFolioItem, closeFolio, getFolioByBooking }}>
      {children}
    </FolioContext.Provider>
  );
}

export function useFolios() {
  const context = useContext(FolioContext);
  if (context === undefined) {
    throw new Error("useFolios must be used within a FolioProvider");
  }
  return context;
}
