import { motion, AnimatePresence } from 'motion/react';
import { FlashcardData } from '../types/flashcard';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

interface CardEditorProps {
  cards: FlashcardData[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (cards: FlashcardData[]) => void;
}

export function CardEditor({ cards, isOpen, onClose, onUpdate }: CardEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    kanji: '',
    romaji: '',
    definition: '',
    imageQuery: '',
  });

  const handleEdit = (card: FlashcardData) => {
    setEditingId(card.id);
    setIsAdding(false);
    setFormData({
      kanji: card.kanji,
      romaji: card.romaji,
      definition: card.definition,
      imageQuery: card.imageQuery,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      kanji: '',
      romaji: '',
      definition: '',
      imageQuery: '',
    });
  };

  const handleSave = () => {
    if (!formData.kanji || !formData.romaji || !formData.definition) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (isAdding) {
      const newCard: FlashcardData = {
        id: Date.now().toString(),
        ...formData,
        weight: 1,
      };
      onUpdate([...cards, newCard]);
    } else if (editingId) {
      const updatedCards = cards.map(card =>
        card.id === editingId
          ? { ...card, ...formData }
          : card
      );
      onUpdate(updatedCards);
    }

    setEditingId(null);
    setIsAdding(false);
    setFormData({ kanji: '', romaji: '', definition: '', imageQuery: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      onUpdate(cards.filter(card => card.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ kanji: '', romaji: '', definition: '', imageQuery: '' });
  };

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
            className="fixed left-0 right-0 bottom-0 max-h-[90vh] bg-white/95 backdrop-blur-xl text-slate-800 shadow-2xl z-50 flex flex-col rounded-t-3xl border-t border-sky-100"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            <div className="px-6 pt-4 pb-4 border-b border-sky-100">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Gérer les cartes
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md active:shadow-sm transition-all duration-200 text-sm px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-sky-50 rounded-xl transition-all duration-300 text-slate-600 hover:text-sky-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable content area */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="pb-4">
                {/* Form for editing/adding */}
                {(editingId || isAdding) && (
                  <div className="px-6 pt-6 pb-4 border-b border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 -mt-px">
                    <h3 className="text-lg mb-4 text-sky-700">
                      {isAdding ? 'Nouvelle carte' : 'Modifier la carte'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-sky-600 mb-2">
                          Kanji *
                        </label>
                        <Input
                          value={formData.kanji}
                          onChange={(e) => setFormData({ ...formData, kanji: e.target.value })}
                          placeholder="弓道"
                          className="bg-white/60 border-sky-200 text-slate-800 focus:border-sky-400 focus:ring-sky-400/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-sky-600 mb-2">
                          Romaji *
                        </label>
                        <Input
                          value={formData.romaji}
                          onChange={(e) => setFormData({ ...formData, romaji: e.target.value })}
                          placeholder="Kyūdō"
                          className="bg-white/60 border-sky-200 text-slate-800 focus:border-sky-400 focus:ring-sky-400/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-sky-600 mb-2">
                          Définition *
                        </label>
                        <Textarea
                          value={formData.definition}
                          onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                          placeholder="La Voie de l'arc"
                          className="bg-white/60 border-sky-200 text-slate-800 min-h-20 focus:border-sky-400 focus:ring-sky-400/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-sky-600 mb-2">
                          Recherche d'image
                        </label>
                        <Input
                          value={formData.imageQuery}
                          onChange={(e) => setFormData({ ...formData, imageQuery: e.target.value })}
                          placeholder="japanese archery"
                          className="bg-white/60 border-sky-200 text-slate-800 focus:border-sky-400 focus:ring-sky-400/20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </Button>
                        <Button
                          onClick={handleCancel}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cards list */}
                <div className="px-6 pb-6 space-y-3" style={{ paddingTop: (editingId || isAdding) ? '0.5rem' : '1.5rem' }}>
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/80 border border-sky-100/50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-xl text-slate-800">{card.kanji}</span>
                            <span className="text-sky-600">{card.romaji}</span>
                          </div>
                          <p className="text-sm text-slate-600">{card.definition}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Poids: {card.weight.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(card)}
                            className="p-2 hover:bg-sky-100 rounded-xl transition-all duration-300 text-sky-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(card.id)}
                            className="p-2 hover:bg-rose-100 rounded-xl transition-all duration-300 text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
