export type UserRole = 'ADMIN' | 'BACK_OFFICE' | 'MEMBER';

export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  location?: string;
  accesses: string[]; // IDs of permissions
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  pillar: 'Live' | 'Earn' | 'Grow';
  format: 'Guide' | 'Template' | 'Course' | 'Tool';
  price: number | 'Free';
  rating?: number;
  tags: string[];
  thumbnail: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  replies: Comment[];
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  pillar: 'Live' | 'Earn' | 'Grow';
  likes: number;
  replies: number;
  date: string;
  comments?: Comment[];
}

export interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  perks: string[];
  color: string;
}

export interface CountryData {
  id: string;
  name: string;
  overview: string;
  visaOptions: { name: string; difficulty: string; description: string }[];
  costs: { housing: number; food: number; transport: number; healthcare: number };
  techMarket: string;
  language: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: 'financial' | 'career' | 'cultural' | 'language' | 'mindset';
  options: { text: string; score: number }[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  pillar: string;
  readTime: string;
  image: string;
}

export interface NewsletterSuggestion {
  topic: string;
  reason: string;
  sources: { title: string; uri: string }[];
}