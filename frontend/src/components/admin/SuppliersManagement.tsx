import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, Building2, Search, Eye, Phone, Mail, MapPin } from 'lucide-react';

type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  productsCount: number;
  createdAt: string;
};

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechSource Argentina',
    contact: 'Juan Pérez',
    email: 'juan.perez@techsource.com.ar',
    phone: '+54 11 4567-8901',
    address: 'Av. Corrientes 1234, CABA',
    status: 'active',
    productsCount: 15,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Audio Equipment SA',
    contact: 'María González',
    email: 'maria.gonzalez@audioequip.com',
    phone: '+54 11 2345-6789',
    address: 'Av. Santa Fe 5678, CABA',
    status: 'active',
    productsCount: 8,
    createdAt: '2024-02-15'
  },
  {
    id: '3',
    name: 'Digital World SRL',
    contact: 'Carlos Rodríguez',
    email: 'carlos@digitalworld.ar',
    phone: '+54 11 9876-5432',
    address: 'Av. Rivadavia 9876, CABA',
    status: 'inactive',
    productsCount: 0,
    createdAt: '2024-03-20'
  }
];

// Componente SupplierForm separado para evitar re-renders
type SupplierFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  newSupplier: {
    name: string;
    contact: string;
    email: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive';
  };
  setNewSupplier: React.Dispatch<React.SetStateAction<{
    name: string;
    contact: string;
    email: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive';
  }>>;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingSupplier: React.Dispatch<React.SetStateAction<Supplier | null>>;
  resetForm: () => void;
};

const SupplierFormComponent = React.memo<SupplierFormProps>(({
  onSubmit,
  isEdit = false,
  newSupplier,
  setNewSupplier,
  setIsCreateModalOpen,
  setEditingSupplier,
  resetForm
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Proveedor *</Label>
        <Input
          id="name"
          value={newSupplier.name}
          onChange={(e) => {
            const value = e.target.value;
            setNewSupplier(prev => ({ ...prev, name: value }));
          }}
          placeholder="Nombre de la empresa"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Persona de Contacto *</Label>
        <Input
          id="contact"
          value={newSupplier.contact}
          onChange={(e) => {
            const value = e.target.value;
            setNewSupplier(prev => ({ ...prev, contact: value }));
          }}
          placeholder="Nombre del contacto"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={newSupplier.email}
          onChange={(e) => {
            const value = e.target.value;
            setNewSupplier(prev => ({ ...prev, email: value }));
          }}
          placeholder="email@empresa.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono *</Label>
        <Input
          id="phone"
          value={newSupplier.phone}
          onChange={(e) => {
            const value = e.target.value;
            setNewSupplier(prev => ({ ...prev, phone: value }));
          }}
          placeholder="+54 11 1234-5678"
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="address">Dirección</Label>
      <Textarea
        id="address"
        value={newSupplier.address}
        onChange={(e) => {
          const value = e.target.value;
          setNewSupplier(prev => ({ ...prev, address: value }));
        }}
        placeholder="Dirección completa"
        rows={2}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="status">Estado</Label>
      <select
        id="status"
        value={newSupplier.status}
        onChange={(e) => {
          const value = e.target.value as 'active' | 'inactive';
          setNewSupplier(prev => ({ ...prev, status: value }));
        }}
        className="w-full px-3 py-2 border border-input bg-background rounded-md"
      >
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
    </div>

    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => {
          setIsCreateModalOpen(false);
          setEditingSupplier(null);
          resetForm();
        }}
      >
        Cancelar
      </Button>
      <Button type="submit">
        {isEdit ? 'Actualizar Proveedor' : 'Crear Proveedor'}
      </Button>
    </div>
  </form>
));

SupplierFormComponent.displayName = 'SupplierForm';

export function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteAttempt, setDeleteAttempt] = useState<{ supplier: Supplier; hasProducts: boolean } | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(term.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(term.toLowerCase()) ||
      supplier.email.toLowerCase().includes(term.toLowerCase()) ||
      supplier.phone.includes(term)
    );
    setFilteredSuppliers(filtered);
  };

  const validateSupplierData = (supplier: typeof newSupplier, excludeId?: string) => {
    // Validar email único
    const emailExists = suppliers.some(s => 
      s.email.toLowerCase() === supplier.email.toLowerCase() && s.id !== excludeId
    );
    if (emailExists) {
      alert('Ya existe un proveedor con ese email');
      return false;
    }

    // Validar nombre único
    const nameExists = suppliers.some(s => 
      s.name.toLowerCase() === supplier.name.toLowerCase() && s.id !== excludeId
    );
    if (nameExists) {
      alert('Ya existe un proveedor con ese nombre');
      return false;
    }

    return true;
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSupplierData(newSupplier)) {
      return;
    }

    const supplier: Supplier = {
      id: Date.now().toString(),
      name: newSupplier.name,
      contact: newSupplier.contact,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      status: newSupplier.status,
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedSuppliers = [...suppliers, supplier];
    setSuppliers(updatedSuppliers);
    setFilteredSuppliers(updatedSuppliers);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setNewSupplier({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      status: supplier.status
    });
  };

  const handleUpdateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;

    if (!validateSupplierData(newSupplier, editingSupplier.id)) {
      return;
    }

    const updatedSuppliers = suppliers.map(s =>
      s.id === editingSupplier.id
        ? {
            ...s,
            name: newSupplier.name,
            contact: newSupplier.contact,
            email: newSupplier.email,
            phone: newSupplier.phone,
            address: newSupplier.address,
            status: newSupplier.status
          }
        : s
    );

    setSuppliers(updatedSuppliers);
    setFilteredSuppliers(updatedSuppliers);
    setEditingSupplier(null);
    resetForm();
  };

  const handleDeleteAttempt = (supplier: Supplier) => {
    const hasProducts = supplier.productsCount > 0;
    setDeleteAttempt({ supplier, hasProducts });
  };

  const handleDeleteSupplier = () => {
    if (!deleteAttempt || deleteAttempt.hasProducts) return;

    const updatedSuppliers = suppliers.filter(s => s.id !== deleteAttempt.supplier.id);
    setSuppliers(updatedSuppliers);
    setFilteredSuppliers(updatedSuppliers);
    setDeleteAttempt(null);
  };

  const resetForm = () => {
    setNewSupplier({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary'
    } as const;

    const labels = {
      active: 'Activo',
      inactive: 'Inactivo'
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
                <Building2 className="w-5 h-5" />
                <span>Gestión de Proveedores</span>
              </CardTitle>
              <CardDescription>
                Administra los proveedores y sus relaciones con productos
              </CardDescription>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Proveedor</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
                  <DialogDescription>
                    Completa la información del proveedor
                  </DialogDescription>
                </DialogHeader>
                <SupplierFormComponent 
                  onSubmit={handleCreateSupplier}
                  newSupplier={newSupplier}
                  setNewSupplier={setNewSupplier}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  setEditingSupplier={setEditingSupplier}
                  resetForm={resetForm}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proveedores..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Información</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {supplier.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.contact}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{supplier.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{supplier.phone}</span>
                        </div>
                        {supplier.address && (
                          <div className="text-sm text-muted-foreground flex items-start space-x-1">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{supplier.address}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                    <TableCell>
                      <span className={supplier.productsCount === 0 ? 'text-muted-foreground' : ''}>
                        {supplier.productsCount} productos
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(supplier.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Proveedor</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>ID:</strong> {supplier.id}</div>
                                <div><strong>Estado:</strong> {getStatusBadge(supplier.status)}</div>
                                <div><strong>Empresa:</strong> {supplier.name}</div>
                                <div><strong>Contacto:</strong> {supplier.contact}</div>
                                <div><strong>Email:</strong> {supplier.email}</div>
                                <div><strong>Teléfono:</strong> {supplier.phone}</div>
                                <div><strong>Productos:</strong> {supplier.productsCount}</div>
                                <div><strong>Registro:</strong> {formatDate(supplier.createdAt)}</div>
                                {supplier.address && (
                                  <div className="col-span-2">
                                    <strong>Dirección:</strong><br />
                                    {supplier.address}
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={editingSupplier?.id === supplier.id} onOpenChange={(open: boolean) => !open && setEditingSupplier(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSupplier(supplier)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Editar Proveedor</DialogTitle>
                              <DialogDescription>
                                Modifica la información del proveedor
                              </DialogDescription>
                            </DialogHeader>
                            <SupplierFormComponent 
                              onSubmit={handleUpdateSupplier}
                              isEdit
                              newSupplier={newSupplier}
                              setNewSupplier={setNewSupplier}
                              setIsCreateModalOpen={setIsCreateModalOpen}
                              setEditingSupplier={setEditingSupplier}
                              resetForm={resetForm}
                            />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog open={deleteAttempt?.supplier.id === supplier.id} onOpenChange={(open: boolean) => !open && setDeleteAttempt(null)}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteAttempt(supplier)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {deleteAttempt?.hasProducts ? 'No se puede eliminar' : 'Confirmar eliminación'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {deleteAttempt?.hasProducts ? (
                                  <>
                                    No se puede eliminar el proveedor "{supplier.name}" porque tiene {supplier.productsCount} productos asociados. 
                                    Primero debes eliminar o reasignar los productos.
                                  </>
                                ) : (
                                  <>
                                    ¿Estás seguro de que deseas eliminar el proveedor "{supplier.name}"? 
                                    Esta acción no se puede deshacer.
                                  </>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {deleteAttempt?.hasProducts ? 'Entendido' : 'Cancelar'}
                              </AlertDialogCancel>
                              {!deleteAttempt?.hasProducts && (
                                <AlertDialogAction 
                                  onClick={handleDeleteSupplier}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              )}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron proveedores.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}