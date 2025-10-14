import { motion } from 'motion/react';
import { FlashcardData } from '../types/flashcard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface FlashcardProps {
  card: FlashcardData;
  imageUrl: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  cardNumber: number;
  totalCards: number;
}

export function Flashcard({ 
  card, 
  imageUrl, 
  onSwipeLeft, 
  onSwipeRight,
  cardNumber,
  totalCards 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      onSwipeLeft();
    }
    
    setDragDirection(null);
  };

  const handleDrag = (_event: any, info: any) => {
    if (info.offset.x > 50) {
      setDragDirection('right');
    } else if (info.offset.x < -50) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Progress indicator with dots */}
      <motion.div
        className="mb-4 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-1">
          {[...Array(Math.min(totalCards, 5))].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i < (cardNumber % 5 || 5) ? 'bg-sky-500 w-6' : 'bg-sky-200'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Swipe indicators */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-10 mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: dragDirection === 'left' ? 1 : 0,
            scale: dragDirection === 'left' ? 1 : 0.8,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="ml-8 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm"
        >
          <span className="text-sm">À réviser</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: dragDirection === 'right' ? 1 : 0,
            scale: dragDirection === 'right' ? 1 : 0.8,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mr-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm"
        >
          <span className="text-sm">Je sais</span>
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
        className="cursor-grab active:cursor-grabbing"
      >
        <motion.div
          className="w-full h-[520px] relative"
          style={{ perspective: '1000px' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="w-full h-full relative"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front - Split design */}
            <div
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Photo section - 60% */}
              <div className="relative h-[60%] w-full overflow-hidden">
                <ImageWithFallback
                  src={imageUrl}
                  alt={card.romaji}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
              </div>
              
              {/* Content section - 40% */}
              <div className="h-[40%] bg-white flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  className="text-slate-800 text-5xl mb-3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {card.kanji}
                </motion.div>
                <motion.div
                  className="text-sky-600 text-xl mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {card.romaji}
                </motion.div>
                <motion.div
                  className="text-slate-400 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Tapez pour voir la définition
                </motion.div>
              </div>
            </div>

            {/* Back - Split design */}
            <div
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              {/* Photo section - 60% with overlay */}
              <div className="relative h-[60%] w-full overflow-hidden">
                <ImageWithFallback
                  src={imageUrl}
                  alt={card.romaji}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-sky-500/20 via-blue-500/20 to-white" />
              </div>
              
              {/* Content section - 40% */}
              <div className="h-[40%] bg-white flex flex-col items-center justify-center px-8 py-6 text-center">
                <div className="text-sky-600 text-base mb-3">{card.romaji}</div>
                <div className="text-slate-700 text-lg leading-relaxed">
                  {card.definition}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Action buttons - Enhanced mobile design */}
      <div className="flex gap-3 justify-center mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSwipeLeft}
          className="flex-1 max-w-[160px] py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full shadow-lg active:shadow-md transition-all duration-200 font-medium"
        >
          À réviser
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSwipeRight}
          className="flex-1 max-w-[160px] py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full shadow-lg active:shadow-md transition-all duration-200 font-medium"
        >
          Je sais
        </motion.button>
      </div>
    </div>
  );
}
