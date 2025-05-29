import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

const Navbar = ({ onCategoryChange, selectedCategory }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Our Work', path: '/portfolio' },
    { title: 'Services', path: '/services' },
    { title: 'Wall of Art', path: '/art-gallery' },
    { title: 'Blogs', path: '/blog' },
    { title: 'Contact', path: '/contact' },
    { title: 'Meet the Team', path: '/team' },
    ...(location.pathname === '/admin' ? [{ title: 'Admin', path: '/admin' }] : [])
  ];
 
  const categories = [
    "All",
    "Marketing",
    "Branding",
    "UI/UX",
    "Videography",
    "Graphic Design",
    "Photography"
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 bg-vansiii" style={{ zIndex: 9999 }}>
        <div className="h-full px-6 flex items-center gap-8">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col justify-center gap-1.5 w-8 h-8"
          >
            <div className="w-8 h-0.5 bg-black"></div>
            <div className="w-8 h-0.5 bg-black"></div>
            <div className="w-8 h-0.5 bg-black"></div>
          </button>

          {location.pathname === '/portfolio' && (
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => onCategoryChange?.(category)}
                  className={`text-base font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? 'text-black' 
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              style={{ zIndex: 10000 }}
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 w-[400px] h-full bg-[#F8F5F1] p-12"
              style={{ zIndex: 10001 }}
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 text-2xl"
              >
                ×
              </button>

              <div className="mt-16 space-y-8">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to={item.path}
                      className={`text-3xl tracking-wide hover:text-vansiii-accent transition-colors block ${
                        location.pathname === item.path 
                          ? 'font-bold text-vansiii-accent' 
                          : 'font-light'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-12 left-12"
              >
                <p className="text-sm text-gray-500">
                  © 2024 VANSIII
                  <br />
                  All rights reserved
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;