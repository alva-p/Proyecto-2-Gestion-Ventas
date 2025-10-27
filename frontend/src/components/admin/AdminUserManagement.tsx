import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Users, Search, Shield, Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'auditor';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
};

const mockUsers: User[] = [
  {
    id: '2',
    name: 'María García',
    email: 'maria.garcia@tienda.com',
    phone: '+34 698 765 432',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-10',
    lastLogin: '2024-12-21',
    permissions: ['manage_products', 'manage_users', 'manage_sales', 'view_analytics']
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos.lopez@auditoria.com',
    role: 'auditor',
    status: 'active',
    createdAt: '2024-02-01',
    lastLogin: '2024-12-19',
    permissions: ['view_audit_logs', 'export_reports']
  },
  {
    id: '4',
    name: 'Ana Martín',
    email: 'ana.martin@admin.com',
    role: 'admin',
    status: 'inactive',
    createdAt: '2024-03-10',
    lastLogin: '2024-12-15',
    permissions: ['manage_products', 'manage_sales']
  },
  {
    id: '5',
    name: 'Pedro González',
    email: 'pedro.gonzalez@security.com',
    role: 'auditor',
    status: 'active',
    createdAt: '2024-04-05',
    lastLogin: '2024-12-18',
    permissions: ['view_audit_logs', 'security_analysis']
  }
];

const rolePermissions = {
  admin: [
    { id: 'manage_products', name: 'Gestionar productos', description: 'CRUD de productos' },
    { id: 'manage_brands', name: 'Gestionar marcas', description: 'CRUD de marcas' },
    { id: 'manage_users', name: 'Gestionar usuarios', description: 'Administrar usuarios y roles' },
    { id: 'manage_sales', name: 'Gestionar ventas', description: 'Registrar y gestionar ventas' },
    { id: 'view_analytics', name: 'Ver analíticas', description: 'Acceso a reportes y estadísticas' },
    { id: 'system_settings', name: 'Configuración', description: 'Configuración del sistema' },
    { id: 'manage_suppliers', name: 'Gestionar proveedores', description: 'CRUD de proveedores' }
  ],
  auditor: [
    { id: 'view_audit_logs', name: 'Ver logs de auditoría', description: 'Acceso a registros de actividad' },
    { id: 'export_reports', name: 'Exportar reportes', description: 'Generar y exportar reportes' },
    { id: 'security_analysis', name: 'Análisis de seguridad', description: 'Análisis de eventos de seguridad' },
    { id: 'view_user_activity', name: 'Ver actividad de usuarios', description: 'Monitorear actividad del sistema' }
  ]
};

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterUsers(term, roleFilter, statusFilter);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    filterUsers(searchTerm, role, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterUsers(searchTerm, roleFilter, status);
  };

  const filterUsers = (term: string, role: string, status: string) => {
    let filtered = users;

    if (term) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }

    if (status !== 'all') {
      filtered = filtered.filter(user => user.status === status);
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateUserRole = (userId: string, newRole: 'admin' | 'auditor') => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole, permissions: rolePermissions[newRole].map(p => p.id) }
        : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleUpdatePermissions = (userId: string, permissions: string[]) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, permissions } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, permissions });
    }
  };

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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive'
    } as const;

    const labels = {
      active: 'Activo',
      inactive: 'Inactivo',
      suspended: 'Suspendido'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Gestión de Usuarios</span>
              </CardTitle>
              <CardDescription>
                Administra usuarios, roles y permisos del sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="auditor">Auditor de Seguridad</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="suspended">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(value: 'admin' | 'auditor') => handleUpdateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={user.status} 
                        onValueChange={(value: 'active' | 'inactive' | 'suspended') => handleUpdateUserStatus(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                          <SelectItem value="suspended">Suspendido</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Usuario</DialogTitle>
                              <DialogDescription>
                                Información completa y gestión de permisos
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <Tabs defaultValue="info" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="info">Información</TabsTrigger>
                                  <TabsTrigger value="permissions">Permisos</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="info" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Nombre</Label>
                                      <div className="flex items-center space-x-2">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <span>{selectedUser.name}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Rol</Label>
                                      <div>{getRoleBadge(selectedUser.role)}</div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Email</Label>
                                      <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{selectedUser.email}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Estado</Label>
                                      <div>{getStatusBadge(selectedUser.status)}</div>
                                    </div>
                                    
                                    {selectedUser.phone && (
                                      <div className="space-y-2">
                                        <Label>Teléfono</Label>
                                        <div className="flex items-center space-x-2">
                                          <Phone className="w-4 h-4 text-muted-foreground" />
                                          <span>{selectedUser.phone}</span>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="space-y-2">
                                      <Label>Registro</Label>
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>{formatDate(selectedUser.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {selectedUser.address && (
                                    <div className="space-y-2">
                                      <Label>Dirección</Label>
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{selectedUser.address}</span>
                                      </div>
                                    </div>
                                  )}
                                </TabsContent>
                                
                                <TabsContent value="permissions" className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-3">Permisos para el rol: {getRoleBadge(selectedUser.role)}</h4>
                                    <div className="space-y-3">
                                      {rolePermissions[selectedUser.role as keyof typeof rolePermissions].map((permission) => (
                                        <div key={permission.id} className="flex items-center justify-between p-3 border rounded">
                                          <div>
                                            <div className="font-medium">{permission.name}</div>
                                            <div className="text-sm text-muted-foreground">{permission.description}</div>
                                          </div>
                                          <Switch
                                            checked={selectedUser.permissions.includes(permission.id)}
                                            onCheckedChange={(checked: boolean) => {
                                              const newPermissions = checked
                                                ? [...selectedUser.permissions, permission.id]
                                                : selectedUser.permissions.filter(p => p !== permission.id);
                                              handleUpdatePermissions(selectedUser.id, newPermissions);
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}