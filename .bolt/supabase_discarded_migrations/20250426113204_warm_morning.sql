/*
  # Create portfolio projects table

  1. New Tables
    - `portfolio_projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `image_url` (text)
      - `client` (text)
      - `year` (integer)
      - `role` (text)
      - `aspect_ratio` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `portfolio_projects` table
    - Add policies for:
      - Public read access to all projects
      - Authenticated users can manage their own projects
*/

-- Create the portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  image_url text NOT NULL,
  client text,
  year integer,
  role text,
  aspect_ratio numeric DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON portfolio_projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their own projects"
  ON portfolio_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create sample data
INSERT INTO portfolio_projects (title, description, category, image_url, client, year, role, aspect_ratio)
VALUES
  (
    'Modern Art Gallery Website',
    'A minimalist website design for a contemporary art gallery',
    'Web Design',
    'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    'Art Space Gallery',
    2024,
    'Lead Designer',
    1.5
  ),
  (
    'E-commerce Mobile App',
    'A user-friendly mobile shopping experience',
    'Mobile',
    'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    'Fashion Boutique',
    2024,
    'UX Designer',
    0.75
  ),
  (
    'Corporate Branding',
    'Complete brand identity redesign for a tech startup',
    'Branding',
    'https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg',
    'TechStart Inc',
    2023,
    'Brand Designer',
    1.33
  );