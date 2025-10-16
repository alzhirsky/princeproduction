import { motion } from "motion/react";
import type { MouseEvent } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Edit2, Trash2 } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  onClick: () => void;
  onEdit?: (e: MouseEvent) => void;
  onDelete?: (e: MouseEvent) => void;
  isAdmin?: boolean;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function CategoryCard({ id, name, image, onClick, onEdit, onDelete, isAdmin }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02, transition: smoothTransition }}
      whileTap={{ scale: 0.97, transition: { ...smoothTransition, duration: 0.1 } }}
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Admin buttons */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onEdit}
              className="w-8 h-8 rounded-full bg-gray-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Edit2 className="w-4 h-4 text-white" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="w-8 h-8 rounded-full bg-red-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </div>
      )}

      {/* Image */}
      <div className="aspect-[3/1] relative overflow-hidden rounded-2xl">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Glass overlay with blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent backdrop-blur-[2px]" />
        
        {/* Glass card effect */}
        <div className="absolute inset-0 border border-white/10 rounded-2xl" />
        
        {/* Category Name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-medium">{name}</h3>
        </div>
      </div>
    </motion.div>
  );
}
