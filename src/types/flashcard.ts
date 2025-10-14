export interface FlashcardData {
  id: string;
  kanji: string;
  romaji: string;
  definition: string;
  imageQuery: string;
  weight: number;
}

export interface FlashcardStats {
  reviewCount: number;
  knownCount: number;
  cardWeights: Record<string, number>;
}
