import { ChevronLeft, Send, CheckCircle2, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useApp, OrderStatus } from "../contexts/AppContext";
import { toast } from "sonner";

interface ChatPageProps {
  orderNumber: number;
  onBack: () => void;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function ChatPage({ orderNumber, onBack }: ChatPageProps) {
  const { orders, addMessage, confirmOrderCompletion, rateOrder, markChatAsOpened } = useApp();
  const order = orders.find((o) => o.orderNumber === orderNumber);
  const [messageText, setMessageText] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
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
          title: "Order Placed",
          description: "Please describe your requirements below",
          color: "text-yellow-100",
          bg: "bg-yellow-400/30",
        };
      case "accepted":
        return {
          title: "Order Accepted",
          description: "Designer is working on your order",
          color: "text-blue-100",
          bg: "bg-blue-400/30",
        };
      case "ready":
        return {
          title: "Order Ready",
          description: "Please confirm the work has been completed",
          color: "text-green-100",
          bg: "bg-green-400/30",
        };
      case "completed":
        return {
          title: "Completed",
          description: "Order has been completed",
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
      case "closed":
        return {
          title: "Closed",
          description: "Order has been closed",
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
        sender: "user",
        text: messageText.trim(),
        time: timeString,
      });

      setMessageText("");
    }
  };

  const handleConfirmOrder = () => {
    confirmOrderCompletion(orderNumber);
    setShowRatingModal(true);
  };

  const handleRating = (rating: number) => {
    rateOrder(orderNumber, rating);
    setShowRatingModal(false);
    toast.success("Thank you for your rating!", {
      description: "Order completed! Payment sent to designer.",
    });
  };

  const handleSkipRating = () => {
    setShowRatingModal(false);
    toast.success("Order confirmed!", {
      description: "Payment sent to designer.",
    });
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

        {/* Confirm Order Button (only for ready status) */}
        {order.status === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.15 }}
            className="mx-6 mt-4 rounded-[28px] glass-card p-5"
          >
            <h3 className="text-white mb-3">Order Ready</h3>
            <p className="text-gray-300 text-sm mb-4">
              The designer has completed your order. Please confirm to download the files and complete the order.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmOrder}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white shadow-[0_8px_32px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirm & Download
            </motion.button>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
          {order.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.2 + index * 0.05 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-[20px] p-4 backdrop-blur-xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : message.sender === "designer"
                    ? "glass-card"
                    : message.sender === "admin"
                    ? "bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                    : "bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                }`}
              >
                {message.sender === "system" && (
                  <p className="text-yellow-300 text-xs mb-1">System</p>
                )}
                {message.sender === "designer" && (
                  <p className="text-gray-300 text-xs mb-1">Designer</p>
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

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSkipRating}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={smoothTransition}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-[400px] mx-auto"
            >
              <div className="rounded-[32px] overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                {/* Close Button */}
                <button
                  onClick={handleSkipRating}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

                {/* Content */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...smoothTransition, delay: 0.1 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </motion.div>

                  <h3 className="text-white mb-2">Order Completed!</h3>
                  <p className="text-white/60 text-sm mb-6">
                    How would you rate your experience?
                  </p>

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => {
                          setSelectedRating(star);
                          setTimeout(() => handleRating(star), 400);
                        }}
                        className="transition-all duration-200"
                      >
                        <Star
                          className={`w-10 h-10 transition-all duration-200 ${
                            star <= (hoveredRating || selectedRating)
                              ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                              : "text-white/20 fill-white/5"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {/* Skip Button */}
                  <button
                    onClick={handleSkipRating}
                    className="text-white/50 text-sm hover:text-white/80 transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
