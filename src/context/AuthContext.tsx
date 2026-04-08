import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from "firebase/auth";
import { auth } from "../lib/firebase";

// Dev-only auth bypass: allows previewing the app inside sandboxed previews
// that block Firebase OAuth popups (gen-lang-client-*.firebaseapp.com).
// Enabled automatically in `vite dev`. Disabled in production builds.
const DEV_BYPASS = (import.meta as any).env?.DEV ?? false;
const MOCK_USER = {
  uid: "dev-user",
  email: "dev@orbit-os.local",
  displayName: "Dev User",
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
  providerData: [],
  metadata: {},
  refreshToken: "",
  tenantId: null,
  phoneNumber: null,
  providerId: "dev",
  delete: async () => {},
  getIdToken: async () => "dev-token",
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
} as unknown as User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEV_BYPASS ? MOCK_USER : null);
  const [loading, setLoading] = useState(!DEV_BYPASS);

  useEffect(() => {
    if (DEV_BYPASS) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (DEV_BYPASS) {
      setUser(MOCK_USER);
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (DEV_BYPASS) {
      setUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
