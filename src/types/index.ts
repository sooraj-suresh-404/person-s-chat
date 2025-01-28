export interface AIPersonality {
  id: string;
  name: string;
  avatar: string;
  description: string;
  expertise: string[];
  category: 'science' | 'politics' | 'philosophy' | 'art';
  era: string;
  status: 'online' | 'offline';
  languages?: string[];
  achievements?: string[];
} 