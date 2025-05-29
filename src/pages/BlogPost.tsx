import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';

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

const BlogPost = () => {
  const { id } = useParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const savedPosts = localStorage.getItem('blog_posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  useEffect(() => {
    const savedPosts = localStorage.getItem('blog_posts');
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts));
    }
  }, []);

  const currentPost = blogPosts.find(post => post.id === Number(id));
  const relatedPosts = blogPosts
    .filter(post => post.id !== Number(id))
    .slice(0, 2);

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] pt-24">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-2xl">Post not found</h1>
          <Link to="/blog" className="text-vansiii-accent hover:accent-text">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F1]">
      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:accent-text transition-colors mb-8 bg-vansiii-white/50 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all posts
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative aspect-[16/9] mb-8 overflow-hidden rounded-xl">
            <img
              src={currentPost.image}
              alt={currentPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{currentPost.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{currentPost.readTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {currentPost.tags.map(tag => (
              <span 
                key={tag}
                className="text-xs bg-vansiii-accent/10 text-vansiii-accent px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8">{currentPost.title}</h1>

          <div 
            className="prose prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          />

          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(post => (
                <Link 
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group"
                >
                  <div className="aspect-[16/9] mb-4 overflow-hidden rounded-lg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-2 group-hover:accent-text transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;