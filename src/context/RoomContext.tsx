import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  updateDoc, 
  doc,
  orderBy
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-utils";
import { useAuth } from "./AuthContext";

export type RoomStatus = "Stay Over" | "Arrival" | "Departure" | "OOS" | "Vacant";
export type HKStatus = "Clean" | "Dirty" | "Inspected";

export interface Room {
  number: string;
  type: string;
  status: RoomStatus;
  hkStatus: HKStatus;
  guestId?: string;
  guestName?: string; // Denormalized for convenience
  notes?: string;
}

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  updateRoomStatus: (roomNumber: string, status: RoomStatus) => Promise<void>;
  updateHKStatus: (roomNumber: string, hkStatus: HKStatus) => Promise<void>;
  assignGuest: (roomNumber: string, guestId: string, guestName: string) => Promise<void>;
  checkoutGuest: (roomNumber: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const path = "rooms";
    const roomsQuery = query(collection(db, path), orderBy("number"));
    const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
      const roomData = snapshot.docs.map(doc => ({ 
        ...doc.data() 
      } as Room));
      setRooms(roomData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateRoomStatus = useCallback(async (roomNumber: string, status: RoomStatus) => {
    const path = `rooms/${roomNumber}`;
    try {
      await updateDoc(doc(db, "rooms", roomNumber), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const updateHKStatus = useCallback(async (roomNumber: string, hkStatus: HKStatus) => {
    const path = `rooms/${roomNumber}`;
    try {
      await updateDoc(doc(db, "rooms", roomNumber), { hkStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const assignGuest = useCallback(async (roomNumber: string, guestId: string, guestName: string) => {
    const path = `rooms/${roomNumber}`;
    try {
      await updateDoc(doc(db, "rooms", roomNumber), { 
        guestId, 
        guestName,
        status: "Arrival" 
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const checkoutGuest = useCallback(async (roomNumber: string) => {
    const path = `rooms/${roomNumber}`;
    try {
      await updateDoc(doc(db, "rooms", roomNumber), { 
        guestId: null, 
        guestName: null,
        status: "Vacant",
        hkStatus: "Dirty"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, loading, updateRoomStatus, updateHKStatus, assignGuest, checkoutGuest }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
}
