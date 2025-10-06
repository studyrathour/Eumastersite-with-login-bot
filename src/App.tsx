import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import BatchesPage from './components/BatchesPage';
import LiveClassPage from './components/LiveClassPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import EmbedWidget from './components/EmbedWidget';
import VideoPlayerDemo from './components/VideoPlayerDemo';
import ProtectedRoute from './components/ProtectedRoute';
import TokenVerificationPage from './components/TokenVerificationPage';
import TelegramBotPage from './components/TelegramBotPage';
import AccessTimer from './components/AccessTimer';
import { isAdminAuthenticated } from './utils/auth';

const App: React.FC = () => {
  const [authKey, setAuthKey] = useState(0);
  const forceUpdate = () => setAuthKey(prev => prev + 1);

  return (
    <ThemeProvider>
      <Router>
        <div className="App" key={authKey}>
          {/* Global Navigation */}
          <Navigation />
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          {/* Access Timer */}
          <AccessTimer />
          
        <Routes>
          {/* Token verification page - accessible to everyone */}
          <Route path="/verify-token" element={<TokenVerificationPage />} />
          
          {/* Telegram bot page - accessible to everyone */}
          <Route path="/telegram-bot" element={<TelegramBotPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Home page is the default route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Batches page - seamless integration */}
            <Route path="/batches" element={<BatchesPage />} />
            
            {/* Live Classes page - seamless integration */}
            <Route path="/liveclass" element={<LiveClassPage />} />

            {/* Video Player Demo Route */}
            <Route path="/video-demo" element={<VideoPlayerDemo />} />

            {/* Admin Routes */}
            <Route 
              path="/surajadminedumasterlogin" 
              element={
                isAdminAuthenticated() ? <Navigate to="/surajadminedumasterlogin/dashboard" replace /> : <AdminLogin onLogin={forceUpdate} />
              } 
            />
            <Route path="/surajadminedumasterlogin/dashboard" element={<AdminDashboard onLogout={forceUpdate} />} />
          </Route>

          {/* Embed Route for all batches */}
          <Route path="/embed/batches" element={<EmbedWidget type="batches" />} />
          
          {/* Fallback for any other path to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;