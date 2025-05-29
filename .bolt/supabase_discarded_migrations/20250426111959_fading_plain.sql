/*
  # Portfolio Projects Schema

  1. New Tables
    - `portfolio_projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `image_url` (text)
      - `client` (text)
      - `year` (text)
      - `role` (text)
      - `aspect_ratio` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `portfolio_projects` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  image_url text NOT NULL,
  client text,
  year text,
  role text,
  aspect_ratio text DEFAULT '1/1',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Allow users to read all projects
CREATE POLICY "Anyone can view projects"
  ON portfolio_projects
  FOR SELECT
  USING (true);

-- Allow authenticated users to create projects
CREATE POLICY "Authenticated users can create projects"
  ON portfolio_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own projects
CREATE POLICY "Users can update own projects"
  ON portfolio_projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete own projects"
  ON portfolio_projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);