import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../contexts/AppContext";
import { AppLogo } from "./AppLogo";
import { RoleSwitcher } from "./RoleSwitcher";
import { Wallet, TrendingUp, Package, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

// Solid Telegram plane icon
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
    </svg>
  );
}

export function DesignerProfilePage() {
  const { currentUser, earnedBalance, availableBalance, earnedStarsBalance, availableStarsBalance, designerOrders, designers, addDesignerAvailableBalance, addDesignerAvailableStarsBalance } = useApp();
  
  // Get designer stats
  const designer = designers.find(d => d.id === currentUser.id);
  const completedOrders = designerOrders.filter(o => o.status === "completed").length;

  // Modal states
  const [showRublesModal, setShowRublesModal] = useState(false);
  const [showStarsModal, setShowStarsModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleAddRubles = () => {
    if (selectedAmount && selectedAmount > 0) {
      addDesignerAvailableBalance(selectedAmount);
      toast.success(`Added ${selectedAmount} rubles to available balance!`);
      setShowRublesModal(false);
      setSelectedAmount(null);
    }
  };

  const handleAddStars = () => {
    if (selectedAmount && selectedAmount > 0) {
      addDesignerAvailableStarsBalance(selectedAmount);
      toast.success(`Added ${selectedAmount} stars to available balance!`);
      setShowStarsModal(false);
      setSelectedAmount(null);
    }
  };

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
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...smoothTransition, delay: 0.05 }}
          className="text-white mb-6"
        >
          Designer Profile
        </motion.h2>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, transition: smoothTransition }}
            className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-xl"
          >
            <ImageWithFallback
              src={currentUser.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white mb-1.5 text-2xl">{currentUser.username}</h2>
            <p className="text-white/60">{currentUser.telegramUsername}</p>
            <div className="mt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Designer
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.15 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="rounded-[28px] glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300 text-sm">Total Orders</span>
            </div>
            <p className="text-white text-2xl font-bold">{designer?.totalOrders || 0}</p>
          </div>
          <div className="rounded-[28px] glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">Completed</span>
            </div>
            <p className="text-white text-2xl font-bold">{completedOrders}</p>
          </div>
        </motion.div>

        {/* Balance Display - Earned (Pending) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.18 }}
          className="mb-4"
        >
          <div className="rounded-[28px] overflow-hidden backdrop-blur-xl p-6 relative border-2 bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-green-600/20 border-green-500/40 shadow-[0_8px_32px_rgba(34,197,94,0.25)]">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-br from-green-400 via-emerald-400 to-green-500" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br from-green-400/50 to-emerald-500/50 border-2 border-green-400/60 shadow-[0_8px_24px_rgba(34,197,94,0.4)]"
                  >
                    <TrendingUp className="w-7 h-7 text-green-300 drop-shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
                  </motion.div>
                  <div>
                    <p className="text-green-200 font-medium">Earned Balance</p>
                    <p className="text-green-200/60 text-xs">Pending payout</p>
                  </div>
                </div>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-3">
                {/* Rubles */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    <span className="text-green-200/70 text-xs">Rubles</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-bold tracking-tight">{earnedBalance.toLocaleString()}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-200/70 text-xs">Stars</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-bold tracking-tight">{earnedStarsBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Balance Display - Available */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
          className="mb-6"
        >
          <div className="rounded-[28px] overflow-hidden backdrop-blur-xl p-6 relative border-2 bg-gradient-to-br from-cyan-500/25 via-blue-500/20 to-cyan-600/25 border-cyan-400/50 shadow-[0_8px_40px_rgba(6,182,212,0.35)]">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-br from-cyan-300 via-blue-400 to-cyan-500" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br from-cyan-400/60 to-blue-500/60 border-2 border-cyan-300/70 shadow-[0_8px_32px_rgba(6,182,212,0.5)]"
                  >
                    <Wallet className="w-7 h-7 text-cyan-100 drop-shadow-[0_0_20px_rgba(165,243,252,0.9)]" />
                  </motion.div>
                  <div>
                    <p className="text-cyan-100 font-bold text-lg">Available Balance</p>
                    <p className="text-cyan-100/70 text-xs">Ready to use</p>
                  </div>
                </div>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-3">
                {/* Rubles */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm shadow-lg relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-green-300" />
                    <span className="text-green-100/80 text-xs font-medium">Rubles</span>
                  </div>
                  <div className="flex items-baseline gap-2 justify-between">
                    <span className="text-white text-2xl font-bold tracking-tight drop-shadow-lg">{availableBalance.toLocaleString()}</span>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={() => setShowRublesModal(true)}
                      className="w-8 h-8 rounded-lg bg-green-400/70 border border-green-300/80 flex items-center justify-center shadow-lg"
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Stars */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm shadow-lg relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                    <span className="text-yellow-100/80 text-xs font-medium">Stars</span>
                  </div>
                  <div className="flex items-baseline gap-2 justify-between">
                    <span className="text-white text-2xl font-bold tracking-tight drop-shadow-lg">{availableStarsBalance.toLocaleString()}</span>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={() => setShowStarsModal(true)}
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400/80 to-yellow-400/80 border border-orange-300/90 flex items-center justify-center shadow-[0_4px_20px_rgba(251,146,60,0.5)]"
                    >
                      <Plus className="w-5 h-5 text-white drop-shadow-lg" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Role Switcher (for testing) */}
        <RoleSwitcher currentRole={currentUser.role} delay={0.22} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.25 }}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2, transition: smoothTransition }}
            whileTap={{ scale: 0.98, transition: { ...smoothTransition, duration: 0.1 } }}
            onClick={() => {
              window.open('https://t.me/figma', '_blank');
              toast.success('Opening Telegram channel...');
            }}
            className="w-full rounded-[28px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-blue-600/20 border-2 border-blue-400/40 p-5 flex items-center gap-4 shadow-[0_8px_32px_rgba(59,130,246,0.25)] relative group"
          >
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/50 to-cyan-500/50 border-2 border-blue-400/60 flex items-center justify-center relative z-10 shadow-[0_8px_24px_rgba(59,130,246,0.4)]">
              <TelegramIcon className="w-7 h-7 text-blue-200 drop-shadow-[0_0_16px_rgba(147,197,253,0.8)]" />
            </div>
            <span className="text-blue-100 font-medium relative z-10">Designer Support Chat</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Rubles Modal */}
      <AnimatePresence>
        {showRublesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowRublesModal(false); setSelectedAmount(null); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[32px] glass-card p-6"
            >
              <h2 className="text-white text-xl mb-2">Add Rubles</h2>
              <p className="text-green-200/70 mb-6">Select an amount to add to your available balance</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <motion.button
                    key={amt}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => setSelectedAmount(amt)}
                    className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                      selectedAmount === amt
                        ? "bg-green-500/20 border-green-500/60 shadow-[0_0_24px_rgba(34,197,94,0.4)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {selectedAmount !== amt && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
                    )}
                    <div className="flex items-center justify-center gap-1.5 relative z-10">
                      <Wallet className="w-4 h-4 text-green-400" />
                      <span className="text-white">{amt.toLocaleString()}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mb-6">
                <label className="text-sm mb-2 block text-green-200/70">Or enter custom amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={selectedAmount || ""}
                    onChange={(e) => setSelectedAmount(Number(e.target.value))}
                    className="w-full glass-button rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/12 transition-all duration-300 pr-8"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-green-400">₽</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => { setShowRublesModal(false); setSelectedAmount(null); }}
                  className="flex-1 py-4 rounded-[20px] glass-button text-white relative overflow-hidden group flex items-center justify-center"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={handleAddRubles}
                  disabled={!selectedAmount || selectedAmount <= 0}
                  className="flex-1 py-4 rounded-[20px] text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 shadow-[0_8px_32px_rgba(34,197,94,0.4)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Add {selectedAmount ? selectedAmount.toLocaleString() : ""}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stars Modal */}
      <AnimatePresence>
        {showStarsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowStarsModal(false); setSelectedAmount(null); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[32px] glass-card p-6"
            >
              <h2 className="text-white text-xl mb-2">Add Stars</h2>
              <p className="text-orange-200/80 mb-6">Select an amount to add to your available balance</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[100, 500, 1000, 2500].map((amt) => (
                  <motion.button
                    key={amt}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => setSelectedAmount(amt)}
                    className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                      selectedAmount === amt
                        ? "bg-orange-400/25 border-orange-400/70 shadow-[0_0_32px_rgba(251,146,60,0.5)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {selectedAmount !== amt && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-400/15 to-yellow-400/15" />
                    )}
                    <div className="flex items-center justify-center gap-1.5 relative z-10">
                      <Star className="w-4 h-4 text-orange-300 fill-orange-300 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                      <span className="text-white">{amt.toLocaleString()}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mb-6">
                <label className="text-sm mb-2 block text-orange-200/80">Or enter custom amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={selectedAmount || ""}
                    onChange={(e) => setSelectedAmount(Number(e.target.value))}
                    className="w-full glass-button rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/12 transition-all duration-300 pr-8"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Star className="w-4 h-4 text-orange-300 fill-orange-300 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => { setShowStarsModal(false); setSelectedAmount(null); }}
                  className="flex-1 py-4 rounded-[20px] glass-button text-white relative overflow-hidden group flex items-center justify-center"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={handleAddStars}
                  disabled={!selectedAmount || selectedAmount <= 0}
                  className="flex-1 py-4 rounded-[20px] text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 shadow-[0_8px_40px_rgba(251,146,60,0.5)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    Add {selectedAmount ? selectedAmount.toLocaleString() : ""}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
