import { useState, useEffect, useCallback } from 'react';
import { FlashcardData, FlashcardStats } from '../types/flashcard';
import { defaultKyudoVocabulary } from '../data/kyudo-vocabulary';

const STORAGE_KEY_STATS = 'kyudo-flashcards-stats';
const STORAGE_KEY_CARDS = 'kyudo-flashcards-cards';

export function useFlashcards() {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<FlashcardStats>({
    reviewCount: 0,
    knownCount: 0,
    cardWeights: {},
  });

  // Initialize cards and stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
    const savedCards = localStorage.getItem(STORAGE_KEY_CARDS);

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      setCards(parsedCards);
    } else {
      // Initialize with default vocabulary
      const initialCards = defaultKyudoVocabulary.map(card => ({
        ...card,
        weight: 1,
      }));
      setCards(shuffleCards(initialCards));
    }
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    if (stats.reviewCount > 0 || stats.knownCount > 0) {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    }
  }, [stats]);

  // Save cards to localStorage
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
    }
  }, [cards]);

  // Weighted shuffle algorithm
  const shuffleCards = useCallback((cardsToShuffle: FlashcardData[]) => {
    const shuffled = [...cardsToShuffle];
    
    // Sort by weight first to give higher weights more chances
    shuffled.sort((a, b) => {
      const weightDiff = (b.weight || 1) - (a.weight || 1);
      if (Math.abs(weightDiff) > 0.1) {
        return weightDiff;
      }
      return Math.random() - 0.5;
    });

    // Additional random shuffle with weight bias
    for (let i = shuffled.length - 1; i > 0; i--) {
      const weightFactor = (shuffled[i].weight || 1) / 5; // Normalize to 0-1 range
      const j = Math.floor(Math.random() * (i + 1) * (1 + weightFactor));
      const clampedJ = Math.min(j, i);
      [shuffled[i], shuffled[clampedJ]] = [shuffled[clampedJ], shuffled[i]];
    }

    return shuffled;
  }, []);

  const handleReview = useCallback((cardId: string, isKnown: boolean) => {
    setStats(prev => {
      const newWeights = { ...prev.cardWeights };
      const currentWeight = newWeights[cardId] || 1;

      if (isKnown) {
        // Decrease weight (min 0.3)
        newWeights[cardId] = Math.max(0.3, currentWeight * 0.7);
      } else {
        // Increase weight (max 5)
        newWeights[cardId] = Math.min(5, currentWeight * 1.5);
      }

      return {
        reviewCount: prev.reviewCount + 1,
        knownCount: isKnown ? prev.knownCount + 1 : prev.knownCount,
        cardWeights: newWeights,
      };
    });

    // Update card weights
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          const currentWeight = stats.cardWeights[cardId] || 1;
          const newWeight = isKnown
            ? Math.max(0.3, currentWeight * 0.7)
            : Math.min(5, currentWeight * 1.5);
          return { ...card, weight: newWeight };
        }
        return card;
      })
    );

    // Move to next card
    setCurrentIndex(prev => (prev + 1) % cards.length);
  }, [cards.length, stats.cardWeights]);

  const resetStats = useCallback(() => {
    const resetWeights: Record<string, number> = {};
    cards.forEach(card => {
      resetWeights[card.id] = 1;
    });

    const newStats = {
      reviewCount: 0,
      knownCount: 0,
      cardWeights: resetWeights,
    };

    setStats(newStats);
    
    // Reset card weights
    setCards(prevCards =>
      prevCards.map(card => ({ ...card, weight: 1 }))
    );

    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(newStats));
  }, [cards]);

  const reshuffleCards = useCallback(() => {
    setCards(prevCards => shuffleCards(prevCards));
    setCurrentIndex(0);
  }, [shuffleCards]);

  const updateCards = useCallback((newCards: FlashcardData[]) => {
    setCards(newCards);
    setCurrentIndex(0);
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(newCards));
  }, []);

  return {
    cards,
    currentCard: cards[currentIndex],
    currentIndex,
    stats,
    handleReview,
    resetStats,
    reshuffleCards,
    updateCards,
  };
}
