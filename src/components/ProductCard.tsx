import { Heart } from "lucide-react";
import { motion } from "motion/react";
import type { MouseEvent } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../contexts/AppContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  featured?: boolean;
  description?: string;
  onClick: () => void;
  isFavorited: boolean;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function ProductCard({
  id,
  title,
  price,
  image,
  onClick,
  isFavorited,
}: ProductCardProps) {
  const { toggleFavorite } = useApp();

  const handleFavoriteClick = (e: MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, transition: smoothTransition }}
      whileTap={{ scale: 0.97, transition: { ...smoothTransition, duration: 0.1 } }}
      onClick={onClick}
      className="relative rounded-[28px] overflow-hidden glass-card glass-card-hover cursor-pointer group"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <motion.button
          whileHover={{ scale: 1.15, transition: smoothTransition }}
          whileTap={{ scale: 0.85, transition: { ...smoothTransition, duration: 0.1 } }}
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full glass-button flex items-center justify-center ${
            isFavorited ? "glow-yellow" : ""
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isFavorited ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-white"
            }`}
          />
        </motion.button>
      </div>
      <div className="p-4 relative z-10">
        <h3 className="text-white mb-1 line-clamp-1">{title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-green-300 text-xs">RUB</span>
            <span className="text-white font-bold text-sm">{price}</span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-yellow-300 text-xs">STARS</span>
            <span className="text-white font-bold text-sm">{Math.ceil(price / 2)}</span>
          </div>
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
