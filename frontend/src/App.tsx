import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Toaster } from './components/ui/sonner';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor';
};

function AuthRoutes({ currentUser, setCurrentUser }: { currentUser: User | null; setCurrentUser: (user: User | null) => void }) {
  const navigate = useNavigate();

  const handleLogin = (email: string, _password: string) => {
    if (email.includes('auditor')) {
      setCurrentUser({
        id: '2',
        name: 'Administrador de Auditoría',
        email: email,
        role: 'auditor'
      });
    } else {
      setCurrentUser({
        id: '1',
        name: 'Administrador',
        email: email,
        role: 'admin'
      });
    }
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const handleRegister = (userData: { name: string; email: string }) => {
    setCurrentUser({
      id: '4',
      name: userData.name,
      email: userData.email,
      role: 'admin'
    });
    navigate('/dashboard');
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage 
              onLogin={handleLogin}
              onNavigateToRegister={() => navigate('/register')}
              onNavigateToForgotPassword={() => navigate('/forgot-password')}
            />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterPage 
              onRegister={handleRegister}
              onNavigateToLogin={() => navigate('/login')}
            />
          )
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPasswordPage 
              onNavigateToLogin={() => navigate('/login')}
            />
          )
        } 
      />

      {/* Rutas protegidas */}
      <Route 
        path="/dashboard/*" 
        element={
          currentUser ? (
            <Dashboard user={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Ruta por defecto */}
      <Route 
        path="/" 
        element={
          <Navigate to={currentUser ? "/dashboard" : "/login"} replace />
        } 
      />
      <Route 
        path="*" 
        element={
          <Navigate to={currentUser ? "/dashboard" : "/login"} replace />
        } 
      />
    </Routes>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <AuthRoutes currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
