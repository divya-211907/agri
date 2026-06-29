import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ProductManagement from './pages/ProductManagement';
import Blockchain from './pages/Blockchain';
import AiChatbot from './pages/AiChatbot';
import ExportOpportunities from './pages/ExportOpportunities';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

const AppLayout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, height: '100vh' }}>
        <Header />
        <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: 'var(--bg-light)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Core Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } />

            <Route path="/products" element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            } />

            <Route path="/blockchain" element={
              <ProtectedRoute>
                <Blockchain />
              </ProtectedRoute>
            } />

            <Route path="/ai-chatbot" element={
              <ProtectedRoute>
                <AiChatbot />
              </ProtectedRoute>
            } />

            <Route path="/export-opportunities" element={
              <ProtectedRoute>
                <ExportOpportunities />
              </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Fallback Redirection */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
