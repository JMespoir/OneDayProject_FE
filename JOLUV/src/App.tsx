// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // 1. Layout이 import 되어 있는지

// 2. 모든 페이지들이 import 되어 있는지
import MainPage from './pages/main/Mainpage.tsx';
import LoginPage from './pages/login/index.tsx';
import SignupPage from './pages/login/signup.tsx';
import ChecklistPage from './pages/checklist/index.tsx';

// 👇 3. SummaryPage가 import 되어 있는지 확인하세요!
import SummaryPage from './pages/summary/index.tsx'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Layout 안의 모든 페이지 경로 */}
        <Route index element={<MainPage />} />
        <Route path="checklist" element={<ChecklistPage />} />
        
        {/* 👇 4. /summary 경로가 <Route>에 등록되어 있는지 확인하세요! */}
        <Route path="summary" element={<SummaryPage />} />
      </Route>

      {/* Layout 밖의 페이지 (헤더가 없는 페이지) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;