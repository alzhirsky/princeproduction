import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../contexts/AppContext";
import { AppLogo } from "./AppLogo";
import { RoleSwitcher } from "./RoleSwitcher";
import { Shield, Users, DollarSign, Calendar, TrendingUp, Star, Wallet, UserPlus, X, Plus } from "lucide-react";
import { toast } from "sonner";

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function AdminProfilePage() {
  const { currentUser, designers, payoutDesigner, addDesigner, allOrders, adminStarsBalance, adminRublesBalance, addAdminStarsBalance, addAdminRublesBalance } = useApp();
  const [showPayoutConfirm, setShowPayoutConfirm] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState<{ id: number; name: string; earnedBalance: number; earnedStarsBalance: number } | null>(null);
  const [showAddDesigner, setShowAddDesigner] = useState(false);
  const [newDesignerTelegramUsername, setNewDesignerTelegramUsername] = useState("");
  const [showRublesModal, setShowRublesModal] = useState(false);
  const [showStarsModal, setShowStarsModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const totalEarnings = designers.reduce((sum, d) => sum + d.earnedBalance, 0);
  const totalDesigners = designers.length;
  const totalOrders = allOrders.length;
  const activeOrders = allOrders.filter(o => o.status !== "completed" && o.status !== "closed").length;

  const handlePayoutClick = (designer: { id: number; username: string; earnedBalance: number; earnedStarsBalance: number }) => {
    setSelectedDesigner({ id: designer.id, name: designer.username, earnedBalance: designer.earnedBalance, earnedStarsBalance: designer.earnedStarsBalance });
    setShowPayoutConfirm(true);
  };

  const confirmPayout = () => {
    if (selectedDesigner) {
      payoutDesigner(selectedDesigner.id);
      toast.success(`Paid out to ${selectedDesigner.name}!`);
      setShowPayoutConfirm(false);
      setSelectedDesigner(null);
    }
  };

  const handleAddDesigner = () => {
    if (!newDesignerTelegramUsername.trim()) {
      toast.error("Please enter telegram username");
      return;
    }
    
    // Generate a mock telegram ID (in real app, this would come from Telegram)
    const telegramId = Math.floor(Math.random() * 1000000) + 1000;
    
    // Use telegram username as the display name (remove @ if present)
    const username = newDesignerTelegramUsername.startsWith('@') 
      ? newDesignerTelegramUsername.slice(1) 
      : newDesignerTelegramUsername;
    
    const telegramHandle = newDesignerTelegramUsername.startsWith('@') 
      ? newDesignerTelegramUsername 
      : `@${newDesignerTelegramUsername}`;
    
    addDesigner(telegramId, username, telegramHandle);
    toast.success(`Designer ${telegramHandle} added successfully!`);
    setNewDesignerTelegramUsername("");
    setShowAddDesigner(false);
  };

  const handleAddRubles = () => {
    if (selectedAmount && selectedAmount > 0) {
      addAdminRublesBalance(selectedAmount);
      toast.success(`Added ${selectedAmount} rubles to admin balance!`);
      setShowRublesModal(false);
      setSelectedAmount(null);
    }
  };

  const handleAddStars = () => {
    if (selectedAmount && selectedAmount > 0) {
      addAdminStarsBalance(selectedAmount);
      toast.success(`Added ${selectedAmount} stars to admin balance!`);
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
          Admin Panel
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
            className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-purple-500/30 flex-shrink-0 shadow-xl"
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
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Administrator
              </span>
            </div>
          </div>
        </motion.div>

        {/* Admin Balances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.15 }}
          className="mb-6"
        >
          <div className="rounded-[28px] overflow-hidden backdrop-blur-xl p-6 relative border-2 bg-gradient-to-br from-purple-500/30 via-violet-500/25 to-purple-600/30 border-purple-400/60 shadow-[0_8px_40px_rgba(168,85,247,0.4)]">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-br from-purple-400 via-violet-400 to-purple-500" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br from-purple-400/70 to-violet-500/70 border-2 border-purple-300/80 shadow-[0_8px_32px_rgba(168,85,247,0.6)]"
                  >
                    <Shield className="w-7 h-7 text-purple-100 drop-shadow-[0_0_20px_rgba(216,180,254,0.9)]" />
                  </motion.div>
                  <div>
                    <p className="text-purple-100 font-bold text-lg">Admin Balance</p>
                    <p className="text-purple-100/70 text-xs">Platform funds</p>
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
                    <span className="text-white text-2xl font-bold tracking-tight drop-shadow-lg">{adminRublesBalance.toLocaleString()}</span>
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
                    <span className="text-white text-2xl font-bold tracking-tight drop-shadow-lg">{adminStarsBalance.toLocaleString()}</span>
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="rounded-[28px] glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-sm">Designers</span>
            </div>
            <p className="text-white text-2xl">{totalDesigners}</p>
          </div>
          <div className="rounded-[28px] glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300 text-sm">Total Orders</span>
            </div>
            <p className="text-white text-2xl">{totalOrders}</p>
          </div>
          <div className="rounded-[28px] glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Active</span>
            </div>
            <p className="text-white text-2xl">{activeOrders}</p>
          </div>
          <div className="rounded-[28px] glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">Pending</span>
            </div>
            <p className="text-white text-xl">{totalEarnings}</p>
          </div>
        </motion.div>

        {/* Role Switcher */}
        <RoleSwitcher currentRole={currentUser.role} delay={0.3} />

        {/* Designers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.33 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Designers</h3>
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddDesigner(true)}
              className="px-4 py-2 rounded-xl glass-button text-gray-300 text-sm flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Designer
            </motion.button>
          </div>
          <div className="space-y-3">
            {designers.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smoothTransition, delay: 0.35 + index * 0.05 }}
                className="rounded-[28px] glass-card p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                    <ImageWithFallback
                      src={designer.avatar}
                      alt={designer.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white">{designer.username}</h4>
                    <p className="text-gray-400 text-sm">{designer.telegramUsername}</p>
                  </div>
                </div>
                
                {/* Earned Balance */}
                <div className="bg-white/5 rounded-xl p-2.5 mb-3">
                  <p className="text-gray-400 text-xs mb-1.5">Earned (Pending payout)</p>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">{designer.earnedBalance}</span>
                    <span className="text-yellow-400 font-bold">{designer.earnedStarsBalance}</span>
                    <div className="flex-1" />
                    <span className="text-white text-xs">{designer.totalOrders} orders</span>
                  </div>
                </div>
                
                {designer.earnedBalance > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePayoutClick(designer)}
                    className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Payout
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role Switcher */}
        <RoleSwitcher currentRole={currentUser.role} />
      </div>

      {/* Payout Confirmation Modal */}
      <AnimatePresence>
        {showPayoutConfirm && selectedDesigner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPayoutConfirm(false)}
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
              <h2 className="text-white text-xl mb-2">Confirm Payout</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to payout to <span className="text-white font-bold">{selectedDesigner.name}</span>?
              </p>

              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-gray-400 text-xs mb-2">Payout amount:</p>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 font-bold text-xl">{selectedDesigner.earnedBalance.toLocaleString()}</span>
                  <span className="text-yellow-400 font-bold text-xl">{selectedDesigner.earnedStarsBalance.toLocaleString()}</span>
                </div>
                <p className="text-gray-400 text-xs mt-3">This will reset earned balance to zero.</p>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmPayout}
                  className="w-full py-4 rounded-[20px] bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white shadow-xl flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Confirm Payout
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPayoutConfirm(false)}
                  className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Designer Modal */}
      <AnimatePresence>
        {showAddDesigner && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDesigner(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={smoothTransition}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div className="rounded-[28px] glass-card p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-xl">Add Designer</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddDesigner(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Telegram Username</label>
                    <input
                      type="text"
                      value={newDesignerTelegramUsername}
                      onChange={(e) => setNewDesignerTelegramUsername(e.target.value)}
                      placeholder="@username"
                      className="w-full glass-button rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddDesigner}
                    className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Designer
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddDesigner(false)}
                    className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              <p className="text-green-200/70 mb-6">Select an amount to add to admin balance</p>
              
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
              <p className="text-orange-200/80 mb-6">Select an amount to add to admin balance</p>
              
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
