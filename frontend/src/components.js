import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { HomePage, TryPage, AboutPage } from './App';
import QueriesPage from './QueriesPage';
import ChatPage from './ChatPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/try" element={<TryPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/queries" element={<QueriesPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default AppRoutes;
