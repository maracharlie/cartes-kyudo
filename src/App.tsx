import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, RotateCcw, Edit3, Info, X } from 'lucide-react';
import { Flashcard } from './components/Flashcard';
import { StatsPanel } from './components/StatsPanel';
import { CardEditor } from './components/CardEditor';
import { useFlashcards } from './hooks/useFlashcards';
import { useImageCache } from './hooks/useImageCache';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

const INSTRUCTIONS_SEEN_KEY = 'kyudo-instructions-seen';

export default function App() {
  const {
    cards,
    currentCard,
    currentIndex,
    stats,
    handleReview,
    resetStats,
    reshuffleCards,
    updateCards,
  } = useFlashcards();

  const [showStats, setShowStats] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  // Check if user has seen instructions before
  const [showInstructions, setShowInstructions] = useState(() => {
    const seen = localStorage.getItem(INSTRUCTIONS_SEEN_KEY);
    return seen !== 'true';
  });

  // Mark instructions as seen when hiding them
  const handleHideInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem(INSTRUCTIONS_SEEN_KEY, 'true');
  };

  const imageUrl = useImageCache(currentCard?.imageQuery || 'japanese archery');

  const handleSwipeLeft = () => {
    if (currentCard) {
      handleReview(currentCard.id, false);
      toast.error('À réviser', {
        description: `${currentCard.romaji} - vous verrez cette carte plus souvent`,
        duration: 2000,
      });
    }
  };

  const handleSwipeRight = () => {
    if (currentCard) {
      handleReview(currentCard.id, true);
      toast.success('Je sais !', {
        description: `${currentCard.romaji} - vous verrez cette carte moins souvent`,
        duration: 2000,
      });
    }
  };

  const handleResetStats = () => {
    resetStats();
    toast.info('Statistiques réinitialisées', {
      description: 'Tous les poids ont été remis à 1',
      duration: 2000,
    });
  };

  const handleReshuffle = () => {
    reshuffleCards();
    toast.info('Cartes mélangées', {
      description: 'Nouveau parcours de révision',
      duration: 2000,
    });
  };

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-slate-700 text-center">
          <h2 className="text-3xl mb-4">Chargement...</h2>
          <p className="text-slate-500">Préparation de vos flashcards</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white flex flex-col safe-area-inset">
      {/* Compact Mobile Header */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-slate-800 text-2xl bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Kyūdō 弓道
          </h1>
          <p className="text-slate-500 text-xs mt-1">{currentIndex + 1}/{cards.length} cartes</p>
        </motion.div>
      </header>

      {/* Mobile Instructions Banner */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-4 mb-3 bg-gradient-to-r from-sky-100 to-blue-100 backdrop-blur-md border border-sky-200/50 rounded-2xl p-4 shadow-lg overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 text-slate-700 text-sm leading-relaxed">
                <p className="mb-2">
                  <strong className="text-sky-700">Guide rapide :</strong>
                </p>
                <p className="text-xs">• Tapez la carte pour la retourner</p>
                <p className="text-xs">• Glissez à gauche pour réviser</p>
                <p className="text-xs">• Glissez à droite si vous savez</p>
              </div>
              <button
                onClick={handleHideInstructions}
                className="text-slate-500 hover:text-sky-700 transition-colors duration-300 p-1 hover:bg-white/50 rounded-lg"
                aria-label="Cacher les instructions"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleHideInstructions}
              className="mt-3 w-full py-2 bg-white/60 hover:bg-white/80 text-sky-700 rounded-xl transition-all duration-300 text-xs"
            >
              Cacher pour toujours
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <Flashcard
              card={currentCard}
              imageUrl={imageUrl}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              cardNumber={currentIndex + 1}
              totalCards={cards.length}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar (Mobile-style) */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-sky-100 shadow-lg safe-area-inset-bottom"
      >
        <div className="flex items-center justify-around px-6 py-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleReshuffle}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-sky-50 active:bg-sky-100 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Mélanger</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowStats(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-sky-50 active:bg-sky-100 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Stats</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowEditor(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-sky-50 active:bg-sky-100 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Gérer</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowInstructions(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-sky-50 active:bg-sky-100 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
              <Info className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Aide</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Panels */}
      <StatsPanel
        stats={stats}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        onReset={handleResetStats}
        totalCards={cards.length}
      />

      <CardEditor
        cards={cards}
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onUpdate={(newCards) => {
          updateCards(newCards);
          toast.success('Cartes mises à jour', {
            description: `${newCards.length} cartes au total`,
            duration: 2000,
          });
        }}
      />

      {/* Toast notifications */}
      <Toaster position="bottom-center" theme="light" />
    </div>
  );
}
