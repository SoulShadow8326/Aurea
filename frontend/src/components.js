import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { HomePage, TryPage, AboutPage } from './App';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/try" element={<TryPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default AppRoutes;
