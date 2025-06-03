import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#F8F5F1] text-vansiii-black flex items-center justify-center">
      <div className="flex items-center justify-center w-full px-4">
        {/* Mascot Illustration */}
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          src="src/assets/images/og mascot.jpg"
          alt="Vansiii Branded Illustration"
          className="mb-8 max-w-[80vw] h-auto object-contain w-full sm:max-w-[500px] max-h-[50vh] sm:max-h-[450px] mr-8"
        />

        {/* Buttons Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-6 items-center"
        >
          <Link
            to="/portfolio"
            className="bg-vansiii-black text-vansiii-white px-8 py-4 rounded-full text-lg hover:accent-bg transition-colors text-center w-48"
          >
            View Work
          </Link>

          <Link
            to="/contact"
            className="bg-transparent border-2 border-vansiii-black text-vansiii-black px-8 py-4 rounded-full text-lg hover:accent-bg hover:text-vansiii-white hover:accent-border transition-colors text-center w-48"
          >
            Get in Touch
          </Link>

          <Link
            to="/art-gallery"
            className="bg-transparent border-2 border-vansiii-black text-vansiii-black px-8 py-4 rounded-full text-lg hover:accent-bg hover:text-vansiii-white hover:accent-border transition-colors text-center w-48"
          >
            Wall of Art
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;