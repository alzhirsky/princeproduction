import { ChevronLeft, Heart, Star, Check, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp, Product, PaymentMethod } from "../contexts/AppContext";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { useState } from "react";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function ProductDetailPage({ product, onBack }: ProductDetailPageProps) {
  const { favorites, toggleFavorite, createOrder, starsBalance, rublesBalance, currentUser } =
    useApp();
  const isFavorited = favorites.has(product.id);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = (paymentMethod: PaymentMethod) => {
    const cost = paymentMethod === "stars" ? product.starsPrice : product.price;
    const balance = paymentMethod === "stars" ? starsBalance : rublesBalance;
    const currency = paymentMethod === "stars" ? "stars" : "rubles";

    if (balance >= cost) {
      createOrder(product, paymentMethod);
      
      setTimeout(() => {
        onBack();
        toast.success("Order created! Chat with designer is ready.", {
          description: `${cost} ${currency} deducted from your balance`,
        });
      }, 300);
    } else {
      toast.error("Insufficient balance", {
        description: `You need ${cost - balance} more ${currency}`,
      });
    }
    setShowPaymentModal(false);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={smoothTransition}
      className="fixed inset-0 z-50 bg-black overflow-y-auto"
    >
      <div className="max-w-[430px] mx-auto min-h-screen pb-32">
        {/* Header */}
        <div className="sticky top-0 z-40 backdrop-blur-2xl bg-black/60 border-b border-white/10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.1, transition: smoothTransition }}
                whileTap={{ scale: 0.9, transition: { ...smoothTransition, duration: 0.1 } }}
                onClick={onBack}
                className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
              <h1 className="text-white">Product Details</h1>
              <motion.button
                whileHover={{ scale: 1.1, transition: smoothTransition }}
                whileTap={{ scale: 0.9, transition: { ...smoothTransition, duration: 0.1 } }}
                onClick={() => {
                  toggleFavorite(product.id);
                  toast.success(
                    isFavorited ? "Removed from favorites" : "Added to favorites"
                  );
                }}
                className={`w-10 h-10 rounded-full glass-button flex items-center justify-center ${
                  isFavorited ? "glow-yellow" : ""
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isFavorited
                      ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      : "text-white"
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...smoothTransition, delay: 0.05 }}
          className="px-6 pt-6"
        >
          <div className="aspect-[4/3] rounded-[28px] overflow-hidden glass-card">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.1 }}
          className="px-6 pt-6 space-y-4"
        >
          {/* Title */}
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-white">{product.title}</h2>
          </div>

          {/* Rating Display - Prominent & Stretched */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.13 }}
            className="relative rounded-[20px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-yellow-600/20 border-2 border-yellow-500/40 shadow-[0_8px_32px_rgba(234,179,8,0.3)] p-4"
          >
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 blur-xl opacity-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] opacity-80" />
                </div>
                <span className="text-yellow-100 text-xl font-bold">4.8</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-yellow-200/80" />
                <span className="text-yellow-100/80 text-sm">
                  {product.downloads.toLocaleString()} orders
                </span>
              </div>
            </div>
          </motion.div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-green-300 text-xs">RUB</span>
                <span className="text-white font-bold text-xl">{product.price}</span>
                <span className="text-white/40">•</span>
                <span className="text-yellow-300 text-xs">STARS</span>
                <span className="text-white font-bold text-xl">{product.starsPrice}</span>
              </div>
              <p className="text-gray-400 text-sm">Choose payment method when ordering</p>
            </div>
          </div>


          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.2 }}
            className="rounded-[28px] overflow-hidden glass-card p-5"
          >
            <h3 className="text-white mb-2">Description</h3>
            <p className="text-gray-200 leading-relaxed mb-4">{product.description}</p>
            
            {/* Balance Display - Proportional Width */}
            <div className="rounded-xl bg-white px-4 py-3 flex items-center justify-between">
              <span className="text-black font-bold text-sm">You have:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-black" />
                  <span className="text-black font-medium text-sm">{rublesBalance.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-black/10" />
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-black fill-black" />
                  <span className="text-black font-medium text-sm">{starsBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.25 }}
            className="rounded-[28px] overflow-hidden glass-card p-5"
          >
            <h3 className="text-white mb-3">Features</h3>
            <ul className="space-y-2.5">
              {product.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...smoothTransition, delay: 0.3 + index * 0.03 }}
                  className="flex items-center gap-3 text-gray-200 p-2.5 rounded-xl bg-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.35 }}
          className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto backdrop-blur-3xl bg-black/70 border-t border-white/10 p-6"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2, transition: smoothTransition }}
            whileTap={{ scale: 0.97, transition: { ...smoothTransition, duration: 0.1 } }}
            onClick={() => setShowPaymentModal(true)}
            className="w-full rounded-[28px] py-5 glass-button text-white flex items-center justify-center"
          >
            <span className="text-white">Buy Now</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentModal(false)}
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
              <h2 className="text-white text-xl mb-2">Choose Payment Method</h2>
              <p className="text-white/50 text-sm mb-6">Select how you want to pay for this product</p>

              <div className="space-y-3 mb-6">
                {/* Stars Payment */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase("stars")}
                  className="w-full rounded-[28px] backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-yellow-600/20 border-2 border-yellow-500/40 p-5 flex items-center justify-between shadow-[0_8px_32px_rgba(234,179,8,0.25)] relative overflow-hidden group"
                >
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/50 to-orange-500/50 border-2 border-yellow-400/60 flex items-center justify-center shadow-[0_8px_24px_rgba(234,179,8,0.4)]">
                      <Star className="w-7 h-7 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_16px_rgba(253,224,71,0.8)]" />
                    </div>
                    <div className="text-left">
                      <p className="text-yellow-200 text-sm font-medium mb-0.5">Telegram Stars</p>
                      <p className="text-white text-xl font-bold">{product.starsPrice}</p>
                    </div>
                  </div>
                  
                  <div className="text-yellow-100/60 text-xs relative z-10">
                    Balance: {starsBalance}
                  </div>
                </motion.button>
                
                {/* Rubles Payment */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase("rubles")}
                  className="w-full rounded-[28px] backdrop-blur-xl bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-green-600/20 border-2 border-green-500/40 p-5 flex items-center justify-between shadow-[0_8px_32px_rgba(34,197,94,0.25)] relative overflow-hidden group"
                >
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/50 to-emerald-500/50 border-2 border-green-400/60 flex items-center justify-center shadow-[0_8px_24px_rgba(34,197,94,0.4)]">
                      <Wallet className="w-7 h-7 text-green-300 drop-shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
                    </div>
                    <div className="text-left">
                      <p className="text-green-200 text-sm font-medium mb-0.5">Rubles</p>
                      <p className="text-white text-xl font-bold">{product.price}</p>
                    </div>
                  </div>
                  
                  <div className="text-green-100/60 text-xs relative z-10">
                    Balance: {rublesBalance}
                  </div>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center"
              >
                Cancel
              </motion.button>



            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
