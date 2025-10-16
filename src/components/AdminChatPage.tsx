import { ChevronLeft, Send, XCircle, CheckCircle, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useApp, OrderStatus } from "../contexts/AppContext";
import { toast } from "sonner";

interface AdminChatPageProps {
  orderNumber: number;
  onBack: () => void;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function AdminChatPage({ orderNumber, onBack }: AdminChatPageProps) {
  const { allOrders, addMessage, closeOrder, resolveDispute, markChatAsOpened } = useApp();
  const order = allOrders.find((o) => o.orderNumber === orderNumber);
  const [messageText, setMessageText] = useState("");
  const [showCloseModal, setShowCloseModal] = useState(false);
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
          description: "Waiting for designer to accept",
          color: "text-yellow-100",
          bg: "bg-yellow-400/30",
        };
      case "accepted":
        return {
          title: "In Progress",
          description: "Designer is working on this order",
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
          title: "Disputed",
          description: "Requires admin intervention",
          color: "text-red-100",
          bg: "bg-red-400/30",
        };
      case "completed":
        return {
          title: "Completed",
          description: "Order completed successfully",
          color: "text-green-100",
          bg: "bg-green-400/30",
        };
      case "closed":
        return {
          title: "Closed",
          description: order.refunded ? "Closed with refund" : "Closed without refund",
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
        sender: "admin",
        text: messageText.trim(),
        time: timeString,
      });

      setMessageText("");
    }
  };

  const handleCloseOrder = (refund: boolean) => {
    closeOrder(orderNumber, refund);
    setShowCloseModal(false);
    toast.success(refund ? "Order closed with refund" : "Order closed, payment sent to designer");
  };

  const handleResolveDispute = () => {
    resolveDispute(orderNumber);
    toast.success("Dispute resolved");
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
                <p className="text-purple-200/80 text-sm">Admin View</p>
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

        {/* Admin Control Panel */}
        {order.status !== "closed" && order.status !== "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.15 }}
            className="mx-6 mt-4 rounded-[28px] glass-card p-5"
          >
            <h3 className="text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full" />
              Admin Actions
            </h3>
            <div className="space-y-3">
              {order.status === "disputed" && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResolveDispute}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 text-white shadow-[0_8px_32px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Resolve Dispute
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCloseModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-red-600 text-white shadow-[0_8px_32px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Close Order
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
          className="mx-6 mt-4 rounded-[28px] glass-card p-5"
        >
          <h3 className="text-white mb-3">Order Details</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Paid With</span>
              <span className="text-white font-bold">
                {order.paidWith === "stars" ? `${order.product.starsPrice} ⭐` : `${order.product.price} ₽`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Designer Earnings</span>
              <span className="text-green-400 font-bold">{order.product.designerPrice} ₽</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Platform Fee</span>
              <span className="text-purple-400 font-bold">{order.product.platformFee} ₽</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-gray-300">Assigned Designer</span>
              <span className="text-cyan-400">ID: {order.designerId}</span>
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
                message.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-[20px] p-4 backdrop-blur-xl ${
                  message.sender === "admin"
                    ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    : message.sender === "designer"
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : message.sender === "user"
                    ? "glass-card"
                    : "bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                }`}
              >
                {message.sender === "system" && (
                  <p className="text-yellow-300 text-xs mb-1">System</p>
                )}
                {message.sender === "user" && (
                  <p className="text-gray-300 text-xs mb-1">Customer</p>
                )}
                {message.sender === "designer" && (
                  <p className="text-cyan-300 text-xs mb-1">Designer</p>
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
              placeholder="Type a message as admin..."
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

      {/* Close Order Modal */}
      <AnimatePresence>
        {showCloseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCloseModal(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={smoothTransition}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[32px] glass-card p-6"
            >
              <h2 className="text-white text-xl mb-2">Close Order</h2>
              <p className="text-gray-300 mb-6">Choose how to close this order</p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCloseOrder(false)}
                  className="w-full py-4 rounded-[20px] bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white shadow-xl flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Close & Pay Designer
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCloseOrder(true)}
                  className="w-full py-4 rounded-[20px] bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white shadow-xl flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Close with Refund
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCloseModal(false)}
                  className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
