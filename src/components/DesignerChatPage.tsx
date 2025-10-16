import { ChevronLeft, Send, Check, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useApp, OrderStatus } from "../contexts/AppContext";
import { toast } from "sonner";

interface DesignerChatPageProps {
  orderNumber: number;
  onBack: () => void;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function DesignerChatPage({ orderNumber, onBack }: DesignerChatPageProps) {
  const { designerOrders, addMessage, acceptOrder, markOrderReady, markOrderDisputed, markChatAsOpened } = useApp();
  const order = designerOrders.find((o) => o.orderNumber === orderNumber);
  const [messageText, setMessageText] = useState("");
  const hasMarkedAsOpened = useRef(false);

  // Mark chat as opened when component mounts (only once)
  useEffect(() => {
    if (!hasMarkedAsOpened.current) {
      markChatAsOpened(orderNumber);
      hasMarkedAsOpened.current = true;
    }
  }, [orderNumber, markChatAsOpened]);

  if (!order) {
    return null;
  }

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return {
          title: "New Order",
          description: "Review the requirements and accept the order",
          color: "text-yellow-100",
          bg: "bg-yellow-400/30",
        };
      case "accepted":
        return {
          title: "Order Accepted",
          description: "Work on the order and mark as ready when done",
          color: "text-blue-100",
          bg: "bg-blue-400/30",
        };
      case "ready":
        return {
          title: "Awaiting Confirmation",
          description: "Customer needs to confirm completion",
          color: "text-green-100",
          bg: "bg-green-400/30",
        };
      case "disputed":
        return {
          title: "Dispute",
          description: "Admin is reviewing this case",
          color: "text-red-100",
          bg: "bg-red-400/30",
        };
      case "completed":
        return {
          title: "Completed",
          description: "Order has been completed successfully",
          color: "text-green-100",
          bg: "bg-green-400/30",
        };
      case "closed":
        return {
          title: "Closed",
          description: "Order has been closed by admin",
          color: "text-gray-100",
          bg: "bg-gray-400/30",
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      addMessage(orderNumber, {
        sender: "designer",
        text: messageText.trim(),
        time: timeString,
      });

      setMessageText("");
    }
  };

  const handleAcceptOrder = () => {
    acceptOrder(orderNumber);
    toast.success("Order accepted! You can now start working on it.");
  };

  const handleMarkReady = () => {
    markOrderReady(orderNumber);
    toast.success("Order marked as ready! Waiting for customer confirmation.");
  };

  const handleDispute = () => {
    markOrderDisputed(orderNumber);
    toast.success("Dispute opened. Admin will review this case.");
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={smoothTransition}
      className="fixed inset-0 z-50 bg-black overflow-y-auto"
    >
      <div className="max-w-[430px] mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 backdrop-blur-2xl bg-black/60 border-b border-white/10">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, transition: smoothTransition }}
                whileTap={{ scale: 0.9, transition: { ...smoothTransition, duration: 0.1 } }}
                onClick={onBack}
                className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
              <div className="flex-1">
                <h2 className="text-white">{order.chatTitle}</h2>
                <p className="text-cyan-200/80 text-sm">{order.product.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.1 }}
          className={`mx-6 mt-4 rounded-[20px] ${statusInfo.bg} backdrop-blur-xl border border-white/10 p-4 shadow-lg`}
        >
          <h3 className={`${statusInfo.color} mb-1`}>{statusInfo.title}</h3>
          <p className="text-gray-200 text-sm">{statusInfo.description}</p>
        </motion.div>

        {/* Designer Control Panel */}
        {(order.status === "placed" || order.status === "accepted" || order.status === "ready") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.15 }}
            className="mx-6 mt-4 rounded-[28px] glass-card p-5"
          >
            <h3 className="text-white mb-4">Order Actions</h3>
            <div className="space-y-3">
              {order.status === "placed" && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAcceptOrder}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white shadow-[0_8px_32px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Accept Order
                </motion.button>
              )}
              
              {order.status === "accepted" && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMarkReady}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white shadow-[0_8px_32px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark as Ready
                </motion.button>
              )}

              {(order.status === "accepted" || order.status === "ready") && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDispute}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white shadow-[0_8px_32px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Open Dispute
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Earnings Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
          className="mx-6 mt-4 rounded-[28px] glass-card p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Your earnings from this order</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400">₽</span>
              <span className="text-white text-xl font-bold">{order.product.designerPrice}</span>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
          {order.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.25 + index * 0.05 }}
              className={`flex ${
                message.sender === "designer" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-[20px] p-4 backdrop-blur-xl ${
                  message.sender === "designer"
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : message.sender === "user"
                    ? "glass-card"
                    : message.sender === "admin"
                    ? "bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                    : "bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                }`}
              >
                {message.sender === "system" && (
                  <p className="text-yellow-300 text-xs mb-1">System</p>
                )}
                {message.sender === "user" && (
                  <p className="text-gray-300 text-xs mb-1">Customer</p>
                )}
                {message.sender === "admin" && (
                  <p className="text-purple-300 text-xs mb-1">Admin</p>
                )}
                <p className="text-white">{message.text}</p>
                <p className="text-gray-400 text-xs mt-2">{message.time}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="sticky bottom-0 backdrop-blur-3xl bg-black/70 border-t border-white/10 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 glass-button rounded-[20px] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/12 transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.1, transition: smoothTransition }}
              whileTap={{ scale: 0.9, transition: { ...smoothTransition, duration: 0.1 } }}
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="w-12 h-12 rounded-[20px] glass-button flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
