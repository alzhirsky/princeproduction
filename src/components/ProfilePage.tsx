import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../contexts/AppContext";
import { AppLogo } from "./AppLogo";
import { BalanceCard } from "./BalanceCard";
import { RoleSwitcher } from "./RoleSwitcher";
import { toast } from "sonner";

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

export function ProfilePage() {
  const { currentUser, starsBalance, rublesBalance, addStarsBalance, addRublesBalance } = useApp();

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
          Profile
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
              <span className={`text-xs px-3 py-1 rounded-full ${
                currentUser.role === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                currentUser.role === "designer" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" :
                "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}>
                {currentUser.role === "admin" ? "Admin" : currentUser.role === "designer" ? "Designer" : "User"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Balance Cards - Only for Users */}
        {currentUser.role === "user" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.15 }}
            className="space-y-3 mb-6"
          >
            <BalanceCard
              type="stars"
              balance={starsBalance}
              onAddBalance={addStarsBalance}
            />
            <BalanceCard
              type="rubles"
              balance={rublesBalance}
              onAddBalance={addRublesBalance}
            />
          </motion.div>
        )}

        {/* Balance Card for Designer - Only Rubles */}
        {currentUser.role === "designer" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.15 }}
            className="mb-6"
          >
            <BalanceCard
              type="rubles"
              balance={rublesBalance}
              onAddBalance={addRublesBalance}
            />
          </motion.div>
        )}

        {/* Role Switcher (for testing) */}
        <RoleSwitcher currentRole={currentUser.role} delay={0.18} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
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
            <span className="text-blue-100 font-medium relative z-10">Join our Telegram</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
