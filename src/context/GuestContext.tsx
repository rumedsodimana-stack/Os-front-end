import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-utils";
import { useAuth } from "./AuthContext";

export interface StayHistory {
  id: string;
  date: string;
  roomType: string;
  amount: number;
  status: "Completed" | "Cancelled" | "Upcoming";
}

export interface SpendData {
  month: string;
  amount: number;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  location?: string;
  loyaltyStatus: "Standard" | "Silver" | "Gold" | "Platinum" | "Diamond";
  vip: boolean;
  preferences: string[];
  lastStay?: Date;
  totalStays: number;
  totalSpend: number;
  loyaltyPoints: number;
  avatar?: string;
  notes?: string;
  stayHistory?: StayHistory[];
  spendData?: SpendData[];
}

interface GuestContextType {
  guests: Guest[];
  loading: boolean;
  addGuest: (guest: Omit<Guest, "id">) => Promise<void>;
  updateGuest: (id: string, data: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  validatePhoneNumber: (phone: string) => boolean;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const path = "guests";
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guestData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastStay: data.lastStay instanceof Timestamp ? data.lastStay.toDate() : (data.lastStay ? new Date(data.lastStay) : undefined)
        } as Guest;
      });
      setGuests(guestData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addGuest = useCallback(async (guest: Omit<Guest, "id">) => {
    if (guest.phone && !/^\+?[\d\s\-\(\)]{7,20}$/.test(guest.phone)) {
      throw new Error("Invalid phone number format");
    }
    const path = "guests";
    try {
      await addDoc(collection(db, path), {
        ...guest,
        lastStay: guest.lastStay ? Timestamp.fromDate(guest.lastStay) : null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, []);

  const updateGuest = useCallback(async (id: string, data: Partial<Guest>) => {
    if (data.phone && !/^\+?[\d\s\-\(\)]{7,20}$/.test(data.phone)) {
      throw new Error("Invalid phone number format");
    }
    const path = `guests/${id}`;
    try {
      const updateData = { ...data };
      if (data.lastStay) {
        updateData.lastStay = Timestamp.fromDate(data.lastStay) as any;
      }
      await updateDoc(doc(db, "guests", id), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const deleteGuest = useCallback(async (id: string) => {
    const path = `guests/${id}`;
    try {
      await deleteDoc(doc(db, "guests", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const validatePhoneNumber = useCallback((phone: string) => {
    if (!phone) return true;
    // Basic international phone format validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/;
    return phoneRegex.test(phone);
  }, []);

  return (
    <GuestContext.Provider value={{ guests, loading, addGuest, updateGuest, deleteGuest, validatePhoneNumber }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuests() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error("useGuests must be used within a GuestProvider");
  }
  return context;
}
