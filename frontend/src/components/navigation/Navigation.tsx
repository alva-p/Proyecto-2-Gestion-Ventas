import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LogOut, User, ShoppingBag, Package, Users, Shield, Settings } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor';
};

type NavigationProps = {
  user: User;
  onLogout: () => void;
};

export function Navigation({ user, onLogout }: NavigationProps) {
  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      auditor: 'secondary'
    } as const;
    
    const labels = {
      admin: 'Administrador',
      auditor: 'Auditor de Seguridad'
    };

    return (
      <Badge variant={variants[role as keyof typeof variants]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'auditor':
        return <Settings className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h1 className="text-xl">BuyApp</h1>
          </div>
          {getRoleBadge(user.role)}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            {getRoleIcon(user.role)}
            <span>{user.name}</span>
          </div>
          
          <ThemeToggle />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}