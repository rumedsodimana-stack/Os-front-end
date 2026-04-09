import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Hotel, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Users, 
  LayoutDashboard,
  Award,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { db, auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "../lib/utils";

interface OnboardingData {
  name: string;
  brand: string;
  category: "Luxury" | "Boutique" | "Business" | "Resort" | "Budget";
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  totalRooms: number;
  acceptedTerms: boolean;
}

const CATEGORIES = ["Luxury", "Boutique", "Business", "Resort", "Budget"];

export function Onboarding({ 
  onComplete, 
  initialData, 
  hotelId 
}: { 
  onComplete: () => void; 
  initialData?: OnboardingData;
  hotelId?: string;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>(initialData || {
    name: "",
    brand: "",
    category: "Boutique",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: auth.currentUser?.email || "",
    website: "",
    totalRooms: 50,
    acceptedTerms: false,
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!auth.currentUser || !data.acceptedTerms) return;
    setIsSubmitting(true);
    try {
      const finalHotelId = hotelId || `hotel_${Math.random().toString(36).substring(2, 9)}`;
      const hotelRef = doc(db, "hotels", finalHotelId);
      
      await setDoc(hotelRef, {
        ...data,
        ownerUid: auth.currentUser.uid,
        onboardedAt: hotelId ? undefined : serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Update user profile with hotelId
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        name: auth.currentUser.displayName || "Admin",
        email: auth.currentUser.email,
        role: "admin",
        hotelId: finalHotelId,
      }, { merge: true });

      onComplete();
    } catch (error) {
      console.error("Onboarding failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-between items-center px-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                step >= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
              </div>
              {i < 5 && (
                <div className={cn(
                  "w-8 sm:w-16 h-1 mx-2 rounded-full transition-all",
                  step > i ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Hotel Identity</h2>
                    <p className="text-muted-foreground">Tell us about your property</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Hotel Name</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={e => setData({ ...data, name: e.target.value })}
                      placeholder="e.g. Grand Plaza Hotel"
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Brand / Group (Optional)</label>
                    <input
                      type="text"
                      value={data.brand}
                      onChange={e => setData({ ...data, brand: e.target.value })}
                      placeholder="e.g. Marriott, Hilton, Independent"
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setData({ ...data, category: cat as any })}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                            data.category === cat 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-muted/50 border-border hover:border-primary/50"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!data.name}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Next Step <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Location & Contact</h2>
                    <p className="text-muted-foreground">Where can guests find you?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Street Address</label>
                    <input
                      type="text"
                      value={data.address}
                      onChange={e => setData({ ...data, address: e.target.value })}
                      placeholder="123 Luxury Ave"
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">City</label>
                      <input
                        type="text"
                        value={data.city}
                        onChange={e => setData({ ...data, city: e.target.value })}
                        placeholder="New York"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Country</label>
                      <input
                        type="text"
                        value={data.country}
                        onChange={e => setData({ ...data, country: e.target.value })}
                        placeholder="USA"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Phone</label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => setData({ ...data, phone: e.target.value })}
                        placeholder="+1 234 567 890"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Website</label>
                      <input
                        type="url"
                        value={data.website}
                        onChange={e => setData({ ...data, website: e.target.value })}
                        placeholder="https://hotel.com"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-4 text-muted-foreground font-bold hover:text-foreground transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!data.address || !data.city}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Next Step <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <LayoutDashboard className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Operations</h2>
                    <p className="text-muted-foreground">Configure your hotel capacity</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold">Total Rooms</label>
                      <span className="text-2xl font-bold text-primary">{data.totalRooms}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={data.totalRooms}
                      onChange={e => setData({ ...data, totalRooms: parseInt(e.target.value) })}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 Room</span>
                      <span>250 Rooms</span>
                      <span>500+ Rooms</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-border bg-muted/30">
                      <Users className="w-6 h-6 text-primary mb-2" />
                      <h4 className="font-bold text-sm">Staff Management</h4>
                      <p className="text-xs text-muted-foreground">Invite your team after setup</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-muted/30">
                      <ShieldCheck className="w-6 h-6 text-primary mb-2" />
                      <h4 className="font-bold text-sm">Security First</h4>
                      <p className="text-xs text-muted-foreground">Enterprise-grade encryption</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-4 text-muted-foreground font-bold hover:text-foreground transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Review <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Ready to Launch</h2>
                    <p className="text-muted-foreground">Confirm your hotel details</p>
                  </div>
                </div>

                <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border border-border">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Hotel Name</span>
                    <span className="text-sm font-bold">{data.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-bold">{data.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-bold">{data.city}, {data.country}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Capacity</span>
                    <span className="text-sm font-bold">{data.totalRooms} Rooms</span>
                  </div>
                </div>

                <div className="mt-12 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-4 text-muted-foreground font-bold hover:text-foreground transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Next Step <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Terms & Conditions</h2>
                    <p className="text-muted-foreground">Please accept our terms to proceed</p>
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-2xl border border-border h-64 overflow-y-auto mb-6 text-sm text-muted-foreground">
                  <h4 className="font-bold text-foreground mb-2">1. Acceptance of Terms</h4>
                  <p className="mb-4">By accessing or using TravelBook HOS, you agree to be bound by these Terms and Conditions...</p>
                  <h4 className="font-bold text-foreground mb-2">2. Data Privacy</h4>
                  <p className="mb-4">We take your privacy seriously. Your data is encrypted and stored securely...</p>
                  <h4 className="font-bold text-foreground mb-2">3. Usage</h4>
                  <p>You are responsible for maintaining the confidentiality of your account...</p>
                </div>

                <div className="flex items-center gap-3 mb-12">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={data.acceptedTerms}
                    onChange={e => setData({ ...data, acceptedTerms: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm font-medium">
                    I agree to the TravelBook HOS Terms and Conditions
                  </label>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-4 text-muted-foreground font-bold hover:text-foreground transition-all disabled:opacity-50"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !data.acceptedTerms}
                    className="flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Complete Setup <CheckCircle2 className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-center mt-8 text-xs text-muted-foreground">
          By completing setup, you agree to OmniStay's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
