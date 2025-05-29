/*
  # Create projects table for portfolio

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `category` (text, required)
      - `image` (text, required) - URL to main project image
      - `stats` (text) - Project statistics/metrics
      - `description` (text) - Short project description
      - `full_description` (text) - Detailed project description
      - `additional_images` (text[]) - Array of image URLs
      - `client` (text) - Client name
      - `year` (text) - Project year
      - `role` (text) - Role in project
      - `aspect_ratio` (text) - Image aspect ratio
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `projects` table
    - Add policies for:
      - Public read access to all projects
      - Only authenticated users can insert/update/delete projects
*/

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  stats text,
  description text,
  full_description text,
  additional_images text[],
  client text,
  year text,
  role text,
  aspect_ratio text DEFAULT '1/1',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access
CREATE POLICY "Allow public read access"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their projects
CREATE POLICY "Allow authenticated users to update"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete projects
CREATE POLICY "Allow authenticated users to delete"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();