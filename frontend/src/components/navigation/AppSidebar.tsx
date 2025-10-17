import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../ui/sidebar';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  Shield, 
  Settings, 
  FileText,
  BarChart3,
  AlertTriangle,
  Tag,
  Building,
  Truck,
  User,
  LogOut,
  BookOpen,
  ShoppingCart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ThemeToggle } from '../theme/ThemeToggle';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor';
};

type AppSidebarProps = {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
};

export function AppSidebar({ user, activeSection, onSectionChange, onLogout }: AppSidebarProps) {
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
    <Sidebar collapsible="icon" className="border-r" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SidebarHeader className="border-b p-4" style={{ flexShrink: 0 }}>
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h1 className="text-lg">BuyApp</h1>
            <div className="text-xs text-muted-foreground">Sistema de Gestión</div>
          </div>
        </div>
        <div className="mt-3">
          {getRoleBadge(user.role)}
        </div>
      </SidebarHeader>

      <SidebarContent style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {sections.map((section) => (
          <SidebarGroup key={section.group}>
            <SidebarGroupLabel>{section.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4" style={{ flexShrink: 0 }}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}