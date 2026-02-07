export interface FlashcardData {
  id: string;
  kanji: string;
  romaji: string;
  definition: string;
  imageQuery: string;
  weight: number;
  // Optional theme/category for filtering (e.g. "Équipement", "Étapes", "Lieux")
  theme?: string;
}

export interface FlashcardStats {
  reviewCount: number;
  knownCount: number;
  cardWeights: Record<string, number>;
}
