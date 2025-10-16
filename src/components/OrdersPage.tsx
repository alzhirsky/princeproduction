import { ChevronLeft, Circle } from "lucide-react";
import { motion } from "motion/react";
import { OrderCard } from "./OrderCard";
import { useApp } from "../contexts/AppContext";
import { AppLogo } from "./AppLogo";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

interface OrdersPageProps {
  onOrderClick: (orderNumber: number) => void;
}

export function OrdersPage({ onOrderClick }: OrdersPageProps) {
  const { orders, currentUser, hasUnreadMessages, isNewChatForRole } = useApp();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "closed"
  );
  const completedOrders = orders.filter(
    (order) => order.status === "completed" || order.status === "closed"
  );

  const displayOrders = activeTab === "active" ? activeOrders : completedOrders;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={smoothTransition}
      className="min-h-screen bg-black pb-24"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-2xl bg-black/60 border-b border-white/10">
        <div className="px-6 py-4 flex justify-center">
          <AppLogo />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...smoothTransition, delay: 0.05 }}
          className="text-white mb-6"
        >
          My Orders
        </motion.h1>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.1 }}
          className="flex gap-2 mb-6"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
              activeTab === "active"
                ? "glass-button text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "bg-white/5 text-gray-300 border border-white/10"
            }`}
          >
            <span>Active ({activeOrders.length})</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
              activeTab === "completed"
                ? "glass-button text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "bg-white/5 text-gray-300 border border-white/10"
            }`}
          >
            <span>Completed ({completedOrders.length})</span>
          </motion.button>
        </motion.div>

        <div className="space-y-3">
          {displayOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.15 }}
              className="rounded-[28px] glass-card p-12 text-center"
            >
              <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white mb-2">No Orders Yet</h3>
              <p className="text-white/50">
                {activeTab === "active" 
                  ? "Your active orders will appear here" 
                  : "Your completed orders will appear here"}
              </p>
            </motion.div>
          ) : (
            displayOrders.map((order, index) => (
              <motion.div
                key={order.orderNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smoothTransition, delay: 0.15 + index * 0.03 }}
              >
                <OrderCard 
                  {...order} 
                  onClick={() => onOrderClick(order.orderNumber)}
                  isNewChat={isNewChatForRole(order, currentUser.role)}
                  hasNewMessage={hasUnreadMessages(order, currentUser.role)}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Empty State */}
        {displayOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-16 px-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ ...smoothTransition, delay: 0.2 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-6"
            >
              <Circle className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <h3 className="text-white text-xl mb-2">
              No {activeTab} orders
            </h3>
            <p className="text-gray-300 text-center">
              {activeTab === "active"
                ? "You don't have any active orders at the moment"
                : "You haven't completed any orders yet"}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
