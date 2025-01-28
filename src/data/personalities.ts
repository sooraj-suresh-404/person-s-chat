import { AIPersonality } from '../types';

export const personalities: AIPersonality[] = [
  {
    id: '1',
    name: 'Albert Einstein',
    avatar: 'https://images.unsplash.com/photo-1539321908154-04927596764d?w=400',
    description: 'Theoretical physicist and Nobel laureate',
    lastMessage: 'Everything is relative, my friend!',
    lastMessageTime: new Date(),
  },
  {
    id: '2',
    name: 'William Shakespeare',
    avatar: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400',
    description: 'Legendary playwright and poet',
    lastMessage: 'To chat or not to chat...',
    lastMessageTime: new Date(),
  },
  {
    id: '3',
    name: 'Marie Curie',
    avatar: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
    description: 'Pioneer in radioactivity research',
    lastMessage: "Let's discuss some chemistry!",
    lastMessageTime: new Date(),
  },
];