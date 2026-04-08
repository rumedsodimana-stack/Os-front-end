import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc,
  updateDoc, 
  doc,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-utils";
import { useAuth } from "./AuthContext";

export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: "Confirmed" | "Checked In" | "Checked Out" | "Cancelled";
  amount: number;
}

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: Omit<Booking, "id">) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const path = "bookings";
    const bookingsQuery = query(collection(db, path), orderBy("checkIn", "desc"), limit(50));
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingData = snapshot.docs.map(doc => ({ 
        id: doc.id,
        ...doc.data() 
      } as Booking));
      setBookings(bookingData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addBooking = useCallback(async (booking: Omit<Booking, "id">) => {
    const path = "bookings";
    try {
      await addDoc(collection(db, path), booking);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId: string, status: Booking["status"]) => {
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, loading, addBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
}
