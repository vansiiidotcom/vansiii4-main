export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  live_url: string | null;
  created_at: string;
  updated_at: string;
  featured: boolean;
  user_id: string;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags: string[];
};

export type ArtWork = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  read: boolean;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPost, 'id'>>;
      };
      art_works: {
        Row: ArtWork;
        Insert: Omit<ArtWork, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ArtWork, 'id'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'read'>;
        Update: Partial<Omit<Message, 'id'>>;
      };
    };
  };
}