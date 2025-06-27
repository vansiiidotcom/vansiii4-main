import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<div>Portfolio</div>} />
        <Route path="/contact" element={<div>Contact</div>} />
        <Route path="/art-gallery" element={<div>Art Gallery</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;