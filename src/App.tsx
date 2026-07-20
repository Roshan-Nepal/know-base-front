import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Unauthorized } from './pages/Unauthorized';
import { Database } from 'lucide-react';

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-white dark:bg-[#171717] flex items-center justify-center text-slate-800 dark:text-slate-100 flex-col gap-4">
    <div className="relative flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border-4 border-[#3b82f6]/10 border-t-[#3b82f6] animate-spin" />
      <Database className="h-6 w-6 text-[#3b82f6] absolute" />
    </div>
    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-widest uppercase animate-pulse">
      Initializing Session...
    </span>
  </div>
);

// Route guard for authenticated paths
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Route guard for guest paths (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Protected Dashboard Panel */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* General Protected Routes */}
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Unauthorized Access Denied Page */}
      <Route 
        path="/unauthorized" 
        element={
          <ProtectedRoute>
            <Unauthorized />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
