import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GalleryPage from './pages/GalleryPage';
import BuilderPage from './pages/BuilderPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import Toast from './components/Toast';
import AIInsightsPanel from './components/AIInsightsPanel';
import { useStore } from './store/useStore';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isLoggedIn = localStorage.getItem('halleyx_auth') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const theme = useStore((state) => state.theme);
  console.log('HALLEYX_DEBUG: App Rendering with theme:', theme);
  
  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 theme-${theme} ${theme === 'midnight' || theme === 'cyberpunk' ? 'dark text-foreground bg-background' : 'text-foreground bg-background'}`}>
        <div className="bg-effects" />
        <AIInsightsPanel />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><GalleryPage /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
          <Route path="/builder" element={<RequireAuth><BuilderPage /></RequireAuth>} />
          <Route path="/builder/:id" element={<RequireAuth><BuilderPage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </div>
    </Router>
  );
}

export default App;
