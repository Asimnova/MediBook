export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
  color: string;
}

export interface App {
  id: string;
  name: string;
  developer: string;
  category_id: number;
  description: string;
  icon_url: string;
  screenshot_url: string;
  rating: number;
  reviews_count: number;
  downloads: string;
  size: string;
  version: string;
  updated_at: string;
  featured: boolean;
  created_at: string;
}

export interface AppWithCategory extends App {
  category?: Category;
}

export interface Favorite {
  id: string;
  user_id: string;
  app_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  app_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewWithProfile extends Review {
  user_email?: string;
}

export interface SessionUser {
  id: string;
  email: string;
}
