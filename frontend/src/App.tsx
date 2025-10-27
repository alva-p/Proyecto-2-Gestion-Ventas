import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import API from './index'; // o la ruta correcta

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor';
};

function AuthRoutes({ currentUser, setCurrentUser }: { currentUser: User | null; setCurrentUser: (user: User | null) => void }) {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      // Llama al backend NestJS
      const res = await API.post('/auth/login', { correo: email, contrasena: password });
      // Guarda el token JWT en el navegador
      localStorage.setItem('token', res.data.access_token);
      // Actualiza el usuario logueado en tu estado global
      setCurrentUser({
        id: res.data.user.id,
        name: res.data.user.nombre,
        email: res.data.user.correo,
        role: res.data.user.rol.nombre
      });
      // Redirige al dashboard
      navigate('/dashboard');
    } catch (error) {
      // Si el login falla, muestra un mensaje de error
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const handleRegister = async (userData: { name: string; email: string; password: string; rol_id: number }) => {
    try {
      // Llama al backend NestJS
      await API.post('/auth/register', {
        nombre: userData.name,
        correo: userData.email,
        contrasena: userData.password
      });
      // Puedes loguear automáticamente o redirigir al login
      alert('Registro exitoso, ahora inicia sesión');
      navigate('/login');
    } catch (error) {
      alert('Error al registrar usuario');
    }
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
