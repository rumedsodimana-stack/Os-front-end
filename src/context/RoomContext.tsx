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
    if ((import.meta as any).env?.DEV) {
      // Seed mock rooms for dev preview so Mini Bar / Room Service / Housekeeping grids render
      const mockRooms: Room[] = Array.from({ length: 24 }, (_, i) => {
        const floor = Math.floor(i / 8) + 1;
        const num = `${floor}${String((i % 8) + 1).padStart(2, "0")}`;
        const types = ["Deluxe King", "Deluxe Twin", "Executive Suite", "Presidential Suite"];
        const statuses: RoomStatus[] = ["Stay Over", "Arrival", "Departure", "Vacant", "OOS"];
        const hk: HKStatus[] = ["Clean", "Dirty", "Inspected"];
        return {
          number: num,
          type: types[i % types.length],
          status: statuses[i % statuses.length],
          hkStatus: hk[i % hk.length],
          guestName: i % 3 === 0 ? `Guest ${i + 1}` : undefined,
        };
      });
      setRooms(mockRooms);
      setLoading(false);
      return;
    }
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
