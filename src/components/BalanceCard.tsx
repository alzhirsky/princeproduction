import { Plus, Star, Wallet, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useState } from "react";
import { useApp } from "../contexts/AppContext";

interface BalanceCardProps {
  type: "stars" | "rubles";
  balance: number;
  onAddBalance: (amount: number) => void;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function BalanceCard({ type, balance, onAddBalance }: BalanceCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleAddBalance = () => {
    setShowModal(true);
  };

  const handleConfirmAdd = () => {
    if (selectedAmount) {
      onAddBalance(selectedAmount);
      toast.success(`Added ${selectedAmount} ${type === "stars" ? "stars" : "rubles"} to your balance!`);
      setShowModal(false);
      setSelectedAmount(null);
    }
  };

  const amounts = type === "stars" 
    ? [100, 500, 1000, 2500] 
    : [500, 1000, 2500, 5000];

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -2, transition: smoothTransition }}
        className={`rounded-[28px] overflow-hidden backdrop-blur-xl p-6 relative border-2 ${
          type === "stars" 
            ? "bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-yellow-600/20 border-yellow-500/40 shadow-[0_8px_32px_rgba(234,179,8,0.25)]" 
            : "bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-green-600/20 border-green-500/40 shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
        }`}
      >
        {/* Enhanced glow effect */}
        <div className={`absolute inset-0 blur-xl opacity-30 ${
          type === "stars"
            ? "bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500"
            : "bg-gradient-to-br from-green-400 via-emerald-400 to-green-500"
        }`} />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                type === "stars" 
                  ? "bg-gradient-to-br from-yellow-300/60 to-yellow-400/60 border-2 border-yellow-300/70 shadow-[0_8px_32px_rgba(250,204,21,0.5)]" 
                  : "bg-gradient-to-br from-green-400/50 to-emerald-500/50 border-2 border-green-400/60 shadow-[0_8px_24px_rgba(34,197,94,0.4)]"
              }`}
            >
              {type === "stars" ? (
                <Star className="w-8 h-8 text-yellow-100 fill-yellow-100 drop-shadow-[0_0_20px_rgba(254,240,138,0.9)]" />
              ) : (
                <Wallet className="w-8 h-8 text-green-300 drop-shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
              )}
            </motion.div>
            <div>
              <p className={`text-sm mb-1 font-medium ${type === "stars" ? "text-yellow-100" : "text-green-200"}`}>{type === "stars" ? "Telegram Stars" : "Rubles"}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-white text-3xl font-bold tracking-tight">{balance.toLocaleString()}</span>
                {type === "stars" ? (
                  <Star className="w-5 h-5 text-yellow-100 fill-yellow-100 drop-shadow-[0_0_12px_rgba(254,240,138,0.8)]" />
                ) : (
                  <span className="text-green-300 text-xl font-medium">₽</span>
                )}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleAddBalance}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden ${
              type === "stars"
                ? "bg-gradient-to-br from-orange-400/70 to-yellow-500/70 border-2 border-orange-300/80 shadow-[0_8px_28px_rgba(251,146,60,0.5)]"
                : "bg-gradient-to-br from-green-400/70 to-emerald-500/70 border-2 border-green-300/80 shadow-[0_8px_32px_rgba(34,197,94,0.5)]"
            }`}
          >
            <div className={`absolute inset-0 blur-xl opacity-30 ${
              type === "stars" 
                ? "bg-gradient-to-br from-orange-300 to-yellow-400" 
                : "bg-gradient-to-br from-green-300 to-emerald-400"
            }`} />
            <Plus className="w-8 h-8 text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </div>
      </motion.div>

      {/* Add Balance Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
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
              <h2 className="text-white text-xl mb-2">Add</h2>
              <p className={`mb-6 ${type === "stars" ? "text-yellow-100/80" : "text-green-200/70"}`}>Select an amount to add to your balance</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {amounts.map((amt) => (
                  <motion.button
                    key={amt}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => setSelectedAmount(amt)}
                    className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                      selectedAmount === amt
                        ? type === "stars"
                          ? "bg-yellow-400/25 border-yellow-400/70 shadow-[0_0_32px_rgba(250,204,21,0.5)]"
                          : "bg-green-500/20 border-green-500/60 shadow-[0_0_24px_rgba(34,197,94,0.4)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {selectedAmount !== amt && (
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        type === "stars"
                          ? "bg-gradient-to-br from-yellow-400/15 to-yellow-500/15"
                          : "bg-gradient-to-br from-green-500/10 to-emerald-500/10"
                      }`} />
                    )}
                    <div className="flex items-center justify-center gap-1.5 relative z-10">
                      {type === "stars" ? (
                        <Star className="w-4 h-4 text-yellow-200 fill-yellow-200 drop-shadow-[0_0_8px_rgba(254,240,138,0.6)]" />
                      ) : (
                        <Wallet className="w-4 h-4 text-green-400" />
                      )}
                      <span className="text-white">{amt.toLocaleString()}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="mb-6">
                <label className={`text-sm mb-2 block ${type === "stars" ? "text-yellow-100/80" : "text-green-200/70"}`}>Or enter custom amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={selectedAmount || ""}
                    onChange={(e) => setSelectedAmount(Number(e.target.value))}
                    className="w-full glass-button rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/12 transition-all duration-300 pr-8"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {type === "stars" ? (
                      <Star className="w-4 h-4 text-yellow-200 fill-yellow-200 drop-shadow-[0_0_8px_rgba(254,240,138,0.6)]" />
                    ) : (
                      <span className="text-green-400">₽</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAmount(null);
                  }}
                  className="flex-1 py-4 rounded-[20px] glass-button text-white relative overflow-hidden group flex items-center justify-center"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={handleConfirmAdd}
                  disabled={!selectedAmount || selectedAmount <= 0}
                  className={`flex-1 py-4 rounded-[20px] text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group ${
                    type === "stars"
                      ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-400 shadow-[0_8px_40px_rgba(250,204,21,0.5)]"
                      : "bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 shadow-[0_8px_32px_rgba(34,197,94,0.4)]"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {type === "stars" ? (
                      <Star className="w-5 h-5 fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    ) : (
                      <Wallet className="w-5 h-5" />
                    )}
                    Add {selectedAmount ? selectedAmount.toLocaleString() : ""}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
