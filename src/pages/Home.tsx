import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({
  //       x: e.clientX,
  //       y: e.clientY,
  //     });
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  return (
    <div className="relative min-h-screen bg-[#F8F5F1] text-vansiii-black flex items-center justify-center">
      {/* Custom cursor
      <motion.div
        className="cursor-effect"
        animate={{
          x: mousePosition.x - 1,
          y: mousePosition.y - 1,
        }}
      /> */}

      <div className="text-center w-full px-4">
        {/* Custom Illustration */}
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          src="src/assets/images/vansiii mascot png.png"
          alt="Vansiii Branded Illustration"
          className="mb-8 mx-auto max-w-[80vw] h-auto object-contain w-full sm:max-w-[500px] max-h-[50vh] sm:max-h-[450px]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-600 mb-12 max-w-lg mx-auto"
        >
          Creative developer & digital artist crafting unique experiences
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-6 justify-center"
        >
          <Link
            to="/portfolio"
            className="bg-vansiii-black text-vansiii-white px-8 py-4 rounded-full text-lg hover:accent-bg transition-colors"
          >
            View Work
          </Link>

          <Link
            to="/contact"
            className="bg-transparent border-2 border-vansiii-black text-vansiii-black px-8 py-4 rounded-full text-lg hover:accent-bg hover:text-vansiii-white hover:accent-border transition-colors"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;