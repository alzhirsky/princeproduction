import { ShoppingBag, MessageCircle, User, Briefcase, Shield } from "lucide-react";
import { motion } from "motion/react";
import { UserRole } from "../contexts/AppContext";

interface BottomNavProps {
  activeTab: "catalog" | "orders" | "profile" | "works";
  onTabChange: (tab: "catalog" | "orders" | "profile" | "works") => void;
  userRole: UserRole;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function BottomNav({ activeTab, onTabChange, userRole }: BottomNavProps) {
  // Different tabs based on user role
  const getTabs = () => {
    if (userRole === "designer") {
      return [
        { id: "catalog" as const, icon: ShoppingBag, label: "Catalog" },
        { id: "orders" as const, icon: MessageCircle, label: "Orders" },
        { id: "works" as const, icon: Briefcase, label: "Works" },
        { id: "profile" as const, icon: User, label: "Profile" },
      ];
    } else if (userRole === "admin") {
      return [
        { id: "catalog" as const, icon: ShoppingBag, label: "Catalog" },
        { id: "orders" as const, icon: Shield, label: "All Orders" },
        { id: "profile" as const, icon: User, label: "Admin" },
      ];
    } else {
      return [
        { id: "catalog" as const, icon: ShoppingBag, label: "Catalog" },
        { id: "orders" as const, icon: MessageCircle, label: "Orders" },
        { id: "profile" as const, icon: User, label: "Profile" },
      ];
    }
  };

  const tabs = getTabs();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto">
      <div className="relative">
        {/* Enhanced glass background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none" />
        <div className="backdrop-blur-3xl bg-black/60 border-t border-white/10 px-4 pb-safe relative">
          <div className="flex items-center justify-around py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  whileTap={{ scale: 0.9, transition: { ...smoothTransition, duration: 0.1 } }}
                  className="flex flex-col items-center gap-1.5 py-2.5 px-7 relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 glass-button rounded-[20px]"
                      transition={smoothTransition}
                    />
                  )}
                  <motion.div
                    animate={{ 
                      y: isActive ? -2 : 0,
                      scale: isActive ? 1.1 : 1
                    }}
                    transition={smoothTransition}
                  >
                    <Icon
                      className={`w-6 h-6 relative z-10 transition-all duration-300 ${
                        isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-gray-500"
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`text-xs relative z-10 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
