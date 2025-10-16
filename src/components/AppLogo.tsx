import { motion } from "motion/react";
import svgPaths from "../imports/svg-tb7lcrmexh";

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function AppLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={smoothTransition}
      whileHover={{ 
        scale: 1.05,
        rotate: [0, -5, 5, 0],
        transition: smoothTransition 
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { ...smoothTransition, duration: 0.1 } 
      }}
      className="relative group cursor-pointer"
    >
      <div className="w-12 h-12 relative flex items-center justify-center">
        <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" fill="none" viewBox="0 0 1482 1500">
          <path d={svgPaths.p3b02ff0} fill="white" />
        </svg>
        
        {/* Subtle glow animation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="w-10 h-10 blur-sm" fill="none" viewBox="0 0 1482 1500">
            <path d={svgPaths.p3b02ff0} fill="rgba(255, 255, 255, 0.2)" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
