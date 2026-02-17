
export type PunctuationSign = ',' | ';' | ':' | '-';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Sentence {
  id: number;
  text: string; // The text with [?] as placeholders
  fullText: string;
  correctSigns: PunctuationSign[]; // Array for multiple placeholders
  explanation: string;
  scheme: string;
  difficulty: DifficultyLevel;
}

export enum AppStage {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  DIFFICULTY_SELECT = 'DIFFICULTY_SELECT',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT'
}

export enum GameLevel {
  SELECT = 1,
  DRAG_DROP = 2,
  SCHEME = 3
}
