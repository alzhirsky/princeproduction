import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

interface OrderCardProps {
  chatTitle: string;
  statusLabel: "Processing" | "Completed" | "Pending";
  time: string;
  lastMessage?: string;
  onClick?: () => void;
  isNewChat?: boolean; // Green dot
  hasNewMessage?: boolean; // Blue dot
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function OrderCard({ chatTitle, statusLabel, time, lastMessage, onClick, isNewChat, hasNewMessage }: OrderCardProps) {
  const statusColors = {
    Processing: "bg-blue-400/50 text-blue-100 border-blue-300/60",
    Completed: "bg-green-400/50 text-green-100 border-green-300/60",
    Pending: "bg-yellow-400/50 text-yellow-100 border-yellow-300/60",
  };

  const statusGlow = {
    Processing: "shadow-[0_0_20px_rgba(96,165,250,0.2)]",
    Completed: "shadow-[0_0_20px_rgba(74,222,128,0.2)]",
    Pending: "shadow-[0_0_20px_rgba(250,204,21,0.2)]",
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2, transition: smoothTransition }}
      whileTap={{ scale: 0.97, transition: { ...smoothTransition, duration: 0.1 } }}
      className={`rounded-[28px] overflow-hidden glass-card glass-card-hover p-5 cursor-pointer ${statusGlow[statusLabel]}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full glass-button flex items-center justify-center flex-shrink-0 relative">
          <MessageCircle className="w-6 h-6 text-white/80" />
          {/* Notification indicators */}
          {isNewChat && (
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-black shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
          )}
          {!isNewChat && hasNewMessage && (
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-black shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white truncate pr-2">{chatTitle}</h3>
            <Badge className={`${statusColors[statusLabel]} backdrop-blur-xl ml-2 flex-shrink-0 shadow-lg`}>
              {statusLabel}
            </Badge>
          </div>
          {lastMessage && (
            <p className="text-gray-300 text-sm mb-2 truncate">{lastMessage}</p>
          )}
          <div className="flex items-center gap-2">
            <p className="text-gray-400 text-xs">{time}</p>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
