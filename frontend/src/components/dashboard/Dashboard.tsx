import { useState } from 'react';
import { SimpleSidebar } from '../navigation/SimpleSidebar';
import { UserProfile } from '../user/UserProfile';
import { ProductCatalog } from '../products/ProductCatalog';
import { EnhancedProductManagement } from '../admin/EnhancedProductManagement';
import { AdminBrandManagement } from '../admin/AdminBrandManagement';
import { BrandLinesManagement } from '../admin/BrandLinesManagement';
import { SuppliersManagement } from '../admin/SuppliersManagement';
import { SalesDashboard } from '../admin/SalesDashboard';
import { SalesRegistration } from '../admin/SalesRegistration';
import { StockAlerts } from '../admin/StockAlerts';
import { AdminUserManagement } from '../admin/AdminUserManagement';
import { SystemSettings } from '../admin/SystemSettings';
import { AuditLog } from '../admin/AuditLog';
import { cn } from '@/lib/utils';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor';
};

type DashboardProps = {
  user: User;
  onLogout: () => void;
};

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('catalog');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getComponentForSection = (section: string) => {
    switch (section) {
      case 'catalog':
        return <ProductCatalog />;
      case 'sales-registration':
        return <SalesRegistration />;
      case 'sales-dashboard':
        return <SalesDashboard />;
      case 'stock-alerts':
        return <StockAlerts />;
      case 'products':
        return <EnhancedProductManagement />;
      case 'brands':
        return <AdminBrandManagement />;
      case 'lines':
        return <BrandLinesManagement />;
      case 'suppliers':
        return <SuppliersManagement />;
      case 'users':
        return <AdminUserManagement />;
      case 'settings':
        return <SystemSettings />;
      case 'audit':
        return <AuditLog />;
      case 'profile':
        return <UserProfile user={user} />;
      default:
        return <ProductCatalog />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <SimpleSidebar
        user={user}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      
      {/* Main Content - adjusts based on sidebar state */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        <div className="container mx-auto p-6 max-w-full">
          {getComponentForSection(activeSection)}
        </div>
      </main>
    </div>
  );
}