import { motion } from "motion/react";
import { useApp } from "../contexts/AppContext";

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

interface RoleSwitcherProps {
  currentRole: string;
  delay?: number;
}

export function RoleSwitcher({ currentRole, delay = 0.18 }: RoleSwitcherProps) {
  const { setCurrentUserRole } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, delay }}
      className="rounded-[28px] backdrop-blur-xl bg-white/5 border border-white/10 p-6 mb-4"
    >
      <h3 className="text-white/60 text-xs font-medium tracking-wide uppercase mb-4">Switch Role (Testing)</h3>
      <div className="grid grid-cols-3 gap-2.5">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={smoothTransition}
          onClick={() => setCurrentUserRole("user")}
          className={`py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center ${
            currentRole === "user"
              ? "bg-gradient-to-br from-blue-500/25 to-blue-600/25 text-blue-200 border-2 border-blue-400/50 shadow-[0_4px_20px_rgba(59,130,246,0.25)]"
              : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white/70"
          }`}
        >
          User
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={smoothTransition}
          onClick={() => setCurrentUserRole("designer")}
          className={`py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center ${
            currentRole === "designer"
              ? "bg-gradient-to-br from-cyan-500/25 to-cyan-600/25 text-cyan-200 border-2 border-cyan-400/50 shadow-[0_4px_20px_rgba(6,182,212,0.25)]"
              : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white/70"
          }`}
        >
          Designer
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={smoothTransition}
          onClick={() => setCurrentUserRole("admin")}
          className={`py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center ${
            currentRole === "admin"
              ? "bg-gradient-to-br from-purple-500/25 to-purple-600/25 text-purple-200 border-2 border-purple-400/50 shadow-[0_4px_20px_rgba(168,85,247,0.25)]"
              : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white/70"
          }`}
        >
          Admin
        </motion.button>
      </div>
    </motion.div>
  );
}
