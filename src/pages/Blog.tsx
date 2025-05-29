import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  tags: string[];
  readTime: string;
  excerpt: string;
  image: string;
  content: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const savedPosts = localStorage.getItem('blog_posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    const savedPosts = localStorage.getItem('blog_posts');
    if (savedPosts) {
      console.log('Loaded blog posts from localStorage:', JSON.parse(savedPosts));
      setBlogPosts(JSON.parse(savedPosts));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F1] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light tracking-tighter"
          >
            Blogs
          </motion.h1>
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => window.location.href = '/admin'}
              className="flex items-center gap-2 bg-vansiii-black text-vansiii-white px-6 py-3 rounded-full hover:accent-bg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Blog
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-vansiii-black/10 pb-12 last:border-0"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Link>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(post.tags || []).map(tag => (
                  <span 
                    key={tag}
                    className="text-xs bg-vansiii-accent/10 text-vansiii-accent px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link to={`/blog/${post.id}`}>
                <h2 className="text-2xl font-light mb-3 tracking-tight hover:accent-text transition-colors">
                  {post.title}
                </h2>
              </Link>

              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {post.excerpt}
              </p>

              <Link 
                to={`/blog/${post.id}`}
                className="text-sm text-vansiii-accent hover:accent-text transition-colors"
              >
                Read More →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;