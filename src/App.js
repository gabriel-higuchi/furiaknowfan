import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProfilePage from './components/ProfilePage';
import DocumentUpload from './components/teste';
import ChatAnalysisPage from './components/chat-analysis';
import HomePage from './components/HomePage';

import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/upload" element={<DocumentUpload />} />
        <Route path="/chat-analysis" element={<ChatAnalysisPage />} />

      </Routes>
    </Router>
  );
}

export default App;
