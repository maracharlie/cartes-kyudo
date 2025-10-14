import { motion, AnimatePresence } from 'motion/react';
import { FlashcardStats } from '../types/flashcard';
import { X, BarChart3, RotateCcw } from 'lucide-react';

interface StatsPanelProps {
  stats: FlashcardStats;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  totalCards: number;
}

export function StatsPanel({ stats, isOpen, onClose, onReset, totalCards }: StatsPanelProps) {
  const averageWeight = Object.values(stats.cardWeights).length > 0
    ? Object.values(stats.cardWeights).reduce((a, b) => a + b, 0) / Object.values(stats.cardWeights).length
    : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          {/* Bottom Sheet Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 right-0 bottom-0 max-h-[85vh] bg-white/95 backdrop-blur-xl text-slate-800 shadow-2xl z-50 overflow-y-auto rounded-t-3xl border-t border-sky-100"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            <div className="p-6 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-sky-600" />
                  </div>
                  <h2 className="text-xl bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    Statistiques
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-sky-50 rounded-xl transition-all duration-300 text-slate-600 hover:text-sky-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 shadow-sm border border-sky-100/50"
                >
                  <div className="text-sky-600 text-sm mb-1">Total de révisions</div>
                  <div className="text-3xl text-slate-800">{stats.reviewCount}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-sm border border-emerald-100/50"
                >
                  <div className="text-emerald-600 text-sm mb-1">Termes marqués "Je sais"</div>
                  <div className="text-3xl text-slate-800">{stats.knownCount}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-sm border border-blue-100/50"
                >
                  <div className="text-blue-600 text-sm mb-1">Total de termes</div>
                  <div className="text-3xl text-slate-800">{totalCards}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 shadow-sm border border-violet-100/50"
                >
                  <div className="text-violet-600 text-sm mb-1">Poids moyen</div>
                  <div className="text-3xl text-slate-800">{averageWeight.toFixed(2)}</div>
                  <div className="text-slate-500 text-xs mt-2">
                    Plus le poids est élevé, plus le terme apparaît fréquemment
                  </div>
                </motion.div>

                {/* Reset button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onReset}
                  className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Réinitialiser les statistiques
                </motion.button>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed shadow-sm border border-slate-100/50"
                >
                  <p className="mb-2">
                    <strong className="text-slate-800">Comment ça marche ?</strong>
                  </p>
                  <p className="mb-2">
                    • <strong>À réviser :</strong> augmente le poids × 1.5 (max 5)
                  </p>
                  <p>
                    • <strong>Je sais :</strong> diminue le poids × 0.7 (min 0.3)
                  </p>
                  <p className="mt-2 text-slate-500">
                    Les termes avec un poids plus élevé apparaissent plus souvent dans vos révisions.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
