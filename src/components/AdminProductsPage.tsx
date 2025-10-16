import { motion } from "motion/react";
import { useApp } from "../contexts/AppContext";
import { AppLogo } from "./AppLogo";
import { Package, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function AdminProductsPage() {
  const { products, designers } = useApp();

  const getDesignerName = (designerId: number) => {
    const designer = designers.find(d => d.id === designerId);
    return designer ? designer.username : `Designer #${designerId}`;
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...smoothTransition, delay: 0.05 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/30 to-violet-500/30 border border-purple-500/50 flex items-center justify-center">
            <Package className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-white">Product Management</h1>
        </motion.div>

        <div className="space-y-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.1 + index * 0.03 }}
              className="rounded-[28px] glass-card p-4"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-1">{product.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.category}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-sm">{getDesignerName(product.assignedDesignerId)}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-xl p-2">
                      <p className="text-gray-400 text-xs">Designer</p>
                      <p className="text-green-400 text-sm font-bold">{product.designerPrice} ₽</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2">
                      <p className="text-gray-400 text-xs">Fee</p>
                      <p className="text-purple-400 text-sm font-bold">{product.platformFee} ₽</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2">
                      <p className="text-gray-400 text-xs">Total</p>
                      <p className="text-white text-sm font-bold">{product.price} ₽</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
