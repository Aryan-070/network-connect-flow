
import React from 'react';
import { motion } from "framer-motion";
import { Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionToggleProps {
  activeView: "networking" | "sessions";
  onViewChange: (view: "networking" | "sessions") => void;
}

const ConnectionToggle = ({
  activeView,
  onViewChange
}: ConnectionToggleProps) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="relative bg-muted rounded-full p-1 w-64 h-12 flex items-center mb-4">
        {/* Animated background pill */}
        <motion.div 
          className="absolute h-10 rounded-full bg-background shadow-sm"
          initial={false}
          animate={{ 
            x: activeView === "networking" ? 4 : "50%" 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: "48%" }}
        />
        
        {/* Toggle buttons */}
        <button 
          className={cn(
            "relative flex items-center justify-center gap-2 z-10 w-1/2 h-10 rounded-full transition-colors",
            activeView === "networking" ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => onViewChange("networking")}
        >
          <Users className="h-4 w-4" />
          <span className="font-medium">Networking</span>
        </button>
        
        <button 
          className={cn(
            "relative flex items-center justify-center gap-2 z-10 w-1/2 h-10 rounded-full transition-colors",
            activeView === "sessions" ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => onViewChange("sessions")}
        >
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Sessions</span>
        </button>
      </div>
      
      {/* Animated icons */}
      <motion.div 
        initial={false}
        animate={{
          scale: activeView === "networking" ? 1 : 0.6,
          opacity: activeView === "networking" ? 1 : 0.4
        }}
        className={cn(
          "flex items-center justify-center gap-2 mb-2",
          activeView === "networking" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Users className="h-6 w-6" />
        <span className="font-medium text-sm">Find relevant people</span>
      </motion.div>
      
      <motion.div 
        initial={false}
        animate={{
          scale: activeView === "sessions" ? 1 : 0.6,
          opacity: activeView === "sessions" ? 1 : 0.4
        }}
        className={cn(
          "flex items-center justify-center gap-2",
          activeView === "sessions" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Calendar className="h-6 w-6" />
        <span className="font-medium text-sm">Discover sessions</span>
      </motion.div>
    </div>
  );
};

export default ConnectionToggle;
