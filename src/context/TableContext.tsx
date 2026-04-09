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

export interface Table {
  id: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved" | "Needs Cleaning";
  time?: string;
  server?: string;
  x: number;
  y: number;
}

interface TableContextType {
  tables: Table[];
  loading: boolean;
  updateTableStatus: (tableId: string, status: Table["status"], additionalData?: Partial<Table>) => Promise<void>;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const path = "tables";
    const tablesQuery = query(collection(db, path), orderBy("id"));
    const unsubscribe = onSnapshot(tablesQuery, (snapshot) => {
      const tableData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Table));
      setTables(tableData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateTableStatus = useCallback(async (tableId: string, status: Table["status"], additionalData?: Partial<Table>) => {
    const path = `tables/${tableId}`;
    try {
      await updateDoc(doc(db, "tables", tableId), { 
        status,
        ...additionalData
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  return (
    <TableContext.Provider value={{ tables, loading, updateTableStatus }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTables() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTables must be used within a TableProvider");
  }
  return context;
}
