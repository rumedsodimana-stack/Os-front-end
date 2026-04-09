import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, Info, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  getDocFromServer,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-utils";
import { useAuth } from "./AuthContext";

export type NotificationType = "info" | "success" | "warning" | "error" | "urgent";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  department?: string;
  timestamp: Date;
  read: boolean;
  uid?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function testConnection() {
      if (!user) return;
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const path = 'notifications';
    const q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp)
        } as Notification;
      });
      setNotifications(newNotifications);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(async (n: Omit<Notification, "id" | "timestamp" | "read">) => {
    const path = 'notifications';
    try {
      await addDoc(collection(db, path), {
        ...n,
        timestamp: Timestamp.now(),
        read: false,
        uid: auth.currentUser?.uid || 'global'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    const path = `notifications/${id}`;
    try {
      await updateDoc(doc(db, 'notifications', id), {
        read: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const path = 'notifications';
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, [notifications]);

  const removeNotification = useCallback(async (id: string) => {
    const path = `notifications/${id}`;
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
      <NotificationToast notifications={notifications.filter(n => !n.read).slice(0, 3)} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

function NotificationToast({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "w-80 p-4 rounded-2xl shadow-2xl border border-border pointer-events-auto flex gap-3 items-start bg-card/80 backdrop-blur-xl",
              n.type === "urgent" && "border-red-500/50 bg-red-500/5 dark:bg-red-500/10"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl shrink-0",
              n.type === "info" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              n.type === "success" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
              n.type === "warning" && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
              n.type === "error" && "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
              n.type === "urgent" && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {n.type === "info" && <Info className="w-5 h-5" />}
              {n.type === "success" && <CheckCircle2 className="w-5 h-5" />}
              {n.type === "warning" && <AlertTriangle className="w-5 h-5" />}
              {n.type === "error" && <AlertCircle className="w-5 h-5" />}
              {n.type === "urgent" && <Bell className="w-5 h-5 animate-bounce" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">{n.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
              {n.department && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider">
                  {n.department}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
