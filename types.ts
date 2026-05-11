
export interface Player {
  name: string;
  image: string | null;
  country: string;
  time: string;
}

export interface PosterData {
  player1: Player;
  player2: Player;
  date: string;
  hook?: string;
}

export interface TemplateStyle {
  id: number;
  name: string;
  backgroundClass: string;
  backgroundImageUrl?: string;
  containerClass: string;
  overlayStyle?: string;
  decorationType: 'neon' | 'clean' | 'glitch' | 'royal' | 'image' | 'glass';
  isLight?: boolean; // New property to determine text color
}
