import { useState } from 'react';
import {
  ShoppingBag,
  Package,
  ShoppingCart,
  BarChart3,
  AlertTriangle,
  Tag,
  BookOpen,
  Truck,
  Users,
  Settings,
  Shield,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ThemeToggle } from '../theme/ThemeToggle';
import { cn } from '@/lib/utils';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor';
};

type SimpleSidebarProps = {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
};

export function SimpleSidebar({ 
  user, 
  activeSection, 
  onSectionChange, 
  onLogout,
  isOpen: controlledIsOpen,
  onToggle
}: SimpleSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const toggleSidebar = () => {
    const newState = !isOpen;
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalIsOpen(newState);
    }
  };

  const adminSections = [
    {
      group: 'Operaciones',
      items: [
        { id: 'catalog', label: 'Catálogo de Productos', icon: Package },
        { id: 'sales-registration', label: 'Registro de Ventas', icon: ShoppingCart },
        { id: 'sales-dashboard', label: 'Dashboard de Ventas', icon: BarChart3 },
        { id: 'stock-alerts', label: 'Alertas de Stock', icon: AlertTriangle },
      ]
    },
    {
      group: 'Gestión de Productos',
      items: [
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'brands', label: 'Marcas', icon: Tag },
        { id: 'lines', label: 'Líneas', icon: BookOpen },
        { id: 'suppliers', label: 'Proveedores', icon: Truck },
      ]
    },
    {
      group: 'Administración',
      items: [
        { id: 'users', label: 'Gestión de Usuarios', icon: Users },
        { id: 'settings', label: 'Configuración del Sistema', icon: Settings },
        { id: 'audit', label: 'Registro de Auditoría', icon: Shield },
      ]
    },
    {
      group: 'Personal',
      items: [
        { id: 'profile', label: 'Mi Perfil', icon: User },
      ]
    }
  ];

  const auditorSections = [
    {
      group: 'Auditoría',
      items: [
        { id: 'audit', label: 'Registro de Auditoría', icon: Shield },
        { id: 'catalog', label: 'Catálogo de Productos', icon: Package },
      ]
    },
    {
      group: 'Personal',
      items: [
        { id: 'profile', label: 'Mi Perfil', icon: User },
      ]
    }
  ];

  const sections = user.role === 'admin' ? adminSections : auditorSections;

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
      <Badge variant={variants[role as keyof typeof variants]} className="text-xs">
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {/* Header */}
        <div className="flex flex-col border-b p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-8 h-8 text-primary" />
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold">BuyApp</h1>
                  <div className="text-xs text-muted-foreground">Sistema de Gestión</div>
                </div>
              </div>
            )}
            {!isOpen && (
              <ShoppingBag className="w-6 h-6 text-primary mx-auto" />
            )}
          </div>
          {isOpen && (
            <div className="mt-3">
              {getRoleBadge(user.role)}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
          {sections.map((section) => (
            <div key={section.group}>
              {isOpen && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  {section.group}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-foreground",
                        !isOpen && "justify-center"
                      )}
                      title={!isOpen ? item.label : undefined}
                    >
                      <Icon className={cn("shrink-0", isOpen ? "w-4 h-4" : "w-5 h-5")} />
                      {isOpen && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-4 space-y-3 flex-shrink-0">
          {isOpen && (
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          )}
          
          <div className={cn("flex items-center", isOpen ? "justify-between" : "flex-col gap-2")}>
            <ThemeToggle />
            <Button
              variant="outline"
              size={isOpen ? "sm" : "icon"}
              onClick={onLogout}
              className="shrink-0"
              title={!isOpen ? "Salir" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {isOpen && <span className="ml-2">Salir</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Toggle Button - Fixed position in top left of content area */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-4 z-50 p-2 rounded-lg bg-background border shadow-md hover:bg-accent transition-all duration-300",
          isOpen ? "left-[17rem]" : "left-20"
        )}
        aria-label={isOpen ? "Cerrar sidebar" : "Abrir sidebar"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </>
  );
}
