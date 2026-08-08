/*
# App Finder — Database Schema

## Overview
Creates a mobile app discovery platform where users browse apps by category,
view details, save favorites, and leave reviews. Includes authentication.

## New Tables

1. `categories` — App categories (Productivity, Games, Social, etc.)
   - `id` (serial, primary key)
   - `name` (text, unique, not null)
   - `slug` (text, unique, not null)
   - `icon_name` (text, Lucide icon name for the category)
   - `color` (text, tailwind color class for the category accent)

2. `apps` — Mobile apps in the directory
   - `id` (uuid, primary key)
   - `name` (text, not null)
   - `developer` (text, not null)
   - `category_id` (int, FK to categories)
   - `description` (text, not null)
   - `icon_url` (text, app icon image URL)
   - `screenshot_url` (text, app screenshot image URL)
   - `rating` (numeric, default 0 — aggregate rating)
   - `reviews_count` (int, default 0)
   - `downloads` (text, e.g. "10M+", "500K+")
   - `size` (text, e.g. "45 MB")
   - `version` (text)
   - `updated_at` (timestamptz, default now())
   - `featured` (boolean, default false — shown on landing)
   - `created_at` (timestamptz, default now())

3. `favorites` — User's saved apps (owner-scoped)
   - `id` (uuid, primary key)
   - `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users)
   - `app_id` (uuid, FK to apps, ON DELETE CASCADE)
   - `created_at` (timestamptz, default now())
   - UNIQUE constraint on (user_id, app_id) to prevent duplicates

4. `reviews` — User reviews for apps (owner-scoped)
   - `id` (uuid, primary key)
   - `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users)
   - `app_id` (uuid, FK to apps, ON DELETE CASCADE)
   - `rating` (int, 1-5, not null)
   - `comment` (text, not null)
   - `created_at` (timestamptz, default now())
   - UNIQUE constraint on (user_id, app_id) — one review per user per app

## Security (RLS)

- `categories`: public read (anon + authenticated), no writes from client
- `apps`: public read (anon + authenticated), no writes from client
- `favorites`: owner-scoped CRUD — authenticated users manage only their own favorites
- `reviews`: owner-scoped CRUD — authenticated users manage only their own reviews;
  SELECT is public (anyone can read reviews) so unauthenticated visitors see them

## Notes

1. Apps and categories are read-only from the client (managed via seed/migrations).
2. Favorites use DEFAULT auth.uid() so inserts omitting user_id succeed.
3. Reviews use DEFAULT auth.uid() for the same reason.
4. One review per user per app enforced by UNIQUE constraint.
5. One favorite per user per app enforced by UNIQUE constraint.
*/

-- ===== CATEGORIES =====
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_name text NOT NULL DEFAULT 'AppWindow',
  color text NOT NULL DEFAULT 'text-brand-600'
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ===== APPS =====
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  developer text NOT NULL,
  category_id int REFERENCES categories(id) ON DELETE SET NULL,
  description text NOT NULL,
  icon_url text NOT NULL,
  screenshot_url text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  reviews_count int DEFAULT 0,
  downloads text DEFAULT '0+',
  size text DEFAULT '—',
  version text DEFAULT '1.0.0',
  updated_at timestamptz DEFAULT now(),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_apps" ON apps;
CREATE POLICY "public_read_apps"
  ON apps FOR SELECT
  TO anon, authenticated USING (true);

-- ===== FAVORITES =====
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, app_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_favorites" ON favorites;
CREATE POLICY "select_own_favorites"
  ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON favorites;
CREATE POLICY "insert_own_favorites"
  ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON favorites;
CREATE POLICY "delete_own_favorites"
  ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== REVIEWS =====
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, app_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews are publicly readable so visitors can see them
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews"
  ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews"
  ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON reviews;
CREATE POLICY "update_own_reviews"
  ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON reviews;
CREATE POLICY "delete_own_reviews"
  ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_apps_category_id ON apps(category_id);
CREATE INDEX IF NOT EXISTS idx_apps_featured ON apps(featured);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_app_id ON reviews(app_id);
