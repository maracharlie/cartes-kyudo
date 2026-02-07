import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  RotateCcw,
  Edit3,
  Info,
  X,
  Target,
  MapPin,
  ListOrdered,
  Sparkles,
  Layers,
  Menu
} from 'lucide-react';
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
    setThemeFilter,
  } = useFlashcards();

  // Theme categories: Tous, Équipement, Lieux, Étapes, Divers
  const themeCategories = [
    { id: 'all', label: 'Tous', themes: null },
    { id: 'equipement', label: 'Équipement', themes: ['Équipement'] },
    { id: 'lieux', label: 'Lieux', themes: ['Lieux'] },
    { id: 'etapes', label: 'Étapes', themes: ['Étapes'] },
    { id: 'divers', label: 'Divers', themes: ['Flèches', 'Position', 'Tenue', 'Cérémonie', 'Philosophie', 'Entraînement'] },
  ];

  // Theme icons mapping
  const getThemeIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'all': return <Layers className="w-5 h-5" />;
      case 'equipement': return <Target className="w-5 h-5" />;
      case 'lieux': return <MapPin className="w-5 h-5" />;
      case 'etapes': return <ListOrdered className="w-5 h-5" />;
      case 'divers': return <Sparkles className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const getThemeColors = (categoryId: string) => {
    switch (categoryId) {
      case 'all': return { color: '#0284c7', bg: '#e0f2fe', ring: '#38bdf8' };
      case 'equipement': return { color: '#d97706', bg: '#fef3c7', ring: '#fbbf24' };
      case 'lieux': return { color: '#16a34a', bg: '#dcfce7', ring: '#4ade80' };
      case 'etapes': return { color: '#2563eb', bg: '#dbeafe', ring: '#60a5fa' };
      case 'divers': return { color: '#9333ea', bg: '#f3e8ff', ring: '#c084fc' };
      default: return { color: '#0284c7', bg: '#e0f2fe', ring: '#38bdf8' };
    }
  };

  // Track active category
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategorySelect = (categoryId: string, themes: string[] | null) => {
    setActiveCategory(categoryId);
    if (themes === null) {
      setThemeFilter(null);
    } else if (themes.length === 1) {
      setThemeFilter(themes[0]);
    } else {
      setThemeFilter(themes);
    }
  };

  const [showStats, setShowStats] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
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
      <header className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="w-10" />
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
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(true)}
            className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Theme Filter Icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: 6,
            marginBottom: 0,
            paddingTop: 12,
            paddingBottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {themeCategories.map((category) => {
            const colors = getThemeColors(category.id);
            const isSelected = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCategorySelect(category.id, category.themes)}
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  minHeight: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.bg,
                  color: colors.color,
                  opacity: isSelected ? 1 : 0.5,
                  boxShadow: isSelected ? `0 0 0 2px white, 0 0 0 4px ${colors.ring}` : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {getThemeIcon(category.id)}
              </motion.button>
            );
          })}
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
      <main className="flex-1 flex items-center justify-center px-4 pb-4">
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

      {/* Drop-down Menu from top */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 bg-white shadow-2xl z-50 rounded-b-3xl safe-area-inset"
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-slate-800">Menu</h2>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-row justify-around">
                  <button
                    onClick={() => { handleReshuffle(); setShowMenu(false); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-xs text-slate-600">Mélanger</span>
                  </button>

                  <button
                    onClick={() => { setShowStats(true); setShowMenu(false); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-xs text-slate-600">Stats</span>
                  </button>

                  <button
                    onClick={() => { setShowEditor(true); setShowMenu(false); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                      <Edit3 className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-xs text-slate-600">Gérer</span>
                  </button>

                  <button
                    onClick={() => { setShowInstructions(true); setShowMenu(false); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                      <Info className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-xs text-slate-600">Aide</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
