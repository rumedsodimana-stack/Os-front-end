import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export const MagicGeneratingEffect: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto p-6 rounded-2xl overflow-hidden bg-white border border-purple-100 shadow-sm my-4">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "linear-gradient(45deg, #f3e8ff, #e0e7ff, #fae8ff)",
            "linear-gradient(45deg, #fae8ff, #f3e8ff, #e0e7ff)",
            "linear-gradient(45deg, #e0e7ff, #fae8ff, #f3e8ff)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        <div className="space-y-2 w-full max-w-[200px]">
          <div className="h-2 bg-purple-100 rounded-full w-full animate-pulse" />
          <div className="h-2 bg-purple-100 rounded-full w-4/5 mx-auto animate-pulse" />
        </div>
        <p className="text-sm font-medium text-purple-600 animate-pulse">
          Generating component...
        </p>
      </div>
    </div>
  );
};
