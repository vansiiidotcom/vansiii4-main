export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  client?: string;
  year?: string;
  role?: string;
  aspect_ratio?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}