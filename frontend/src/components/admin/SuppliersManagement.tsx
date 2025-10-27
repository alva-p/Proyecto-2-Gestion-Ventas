import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, Building2, Search, Phone, Mail, MapPin } from 'lucide-react';
import { getProveedores, createProveedor, deleteProveedor } from '../../services/proveedorService';
import type { Proveedor } from '../../types/Proveedor';

// Componente SupplierForm separado
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
  setNewSupplier: React.Dispatch<
    React.SetStateAction<{
      name: string;
      contact: string;
      email: string;
      phone: string;
      address: string;
      status: 'active' | 'inactive';
    }>
  >;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingSupplier: React.Dispatch<React.SetStateAction<Proveedor | null>>;
  resetForm: () => void;
};

const SupplierFormComponent = React.memo<SupplierFormProps>(
  ({ onSubmit, isEdit = false, newSupplier, setNewSupplier, setIsCreateModalOpen, setEditingSupplier, resetForm }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Proveedor *</Label>
          <Input
            id="name"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre de la empresa"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Persona de Contacto *</Label>
          <Input
            id="contact"
            value={newSupplier.contact}
            onChange={(e) => setNewSupplier((prev) => ({ ...prev, contact: e.target.value }))}
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
            onChange={(e) => setNewSupplier((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="email@empresa.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={newSupplier.phone}
            onChange={(e) => setNewSupplier((prev) => ({ ...prev, phone: e.target.value }))}
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
          onChange={(e) => setNewSupplier((prev) => ({ ...prev, address: e.target.value }))}
          placeholder="Dirección completa"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          value={newSupplier.status}
          onChange={(e) => setNewSupplier((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
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
        <Button type="submit">{isEdit ? 'Actualizar Proveedor' : 'Crear Proveedor'}</Button>
      </div>
    </form>
  )
);

SupplierFormComponent.displayName = 'SupplierForm';

export function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Proveedor[]>([]); //almacena toda la lista de proveedores que trae desde tu backend
  const [filteredSuppliers, setFilteredSuppliers] = useState<Proveedor[]>([]); //almacena la lista filtrada que se muestra en pantalla (por ejemplo, cuando el usuario busca algo).

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [, setEditingSupplier] = useState<Proveedor | null>(null);
  const [deleteAttempt, setDeleteAttempt] = useState<{ supplier: Proveedor; hasProducts: boolean } | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getProveedores();
        setSuppliers(data);
        setFilteredSuppliers(data);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = suppliers.filter(
      (s) =>
        s.nombre.toLowerCase().includes(term.toLowerCase()) ||
        s.contactoNombre.toLowerCase().includes(term.toLowerCase()) ||
        s.contactoEmail.toLowerCase().includes(term.toLowerCase()) ||
        s.telefono.includes(term)
    );
    setFilteredSuppliers(filtered);
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProv = await createProveedor({
        nombre: newSupplier.name,
        contactoNombre: newSupplier.contact,
        contactoEmail: newSupplier.email,
        telefono: newSupplier.phone,
        direccion: newSupplier.address,
        estado: newSupplier.status === 'active',
      });
      const updatedSuppliers = [...suppliers, newProv];
      setSuppliers(updatedSuppliers);
      setFilteredSuppliers(updatedSuppliers);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error al crear proveedor:', error);
    }
  };

  const handleEditSupplier = (supplier: Proveedor) => {
    setEditingSupplier(supplier);
    setNewSupplier({
      name: supplier.nombre,
      contact: supplier.contactoNombre,
      email: supplier.contactoEmail,
      phone: supplier.telefono,
      address: supplier.direccion,
      status: supplier.estado ? 'active' : 'inactive',
    });
  };

  const handleDeleteAttempt = (supplier: Proveedor) => {
    const hasProducts = supplier.cantidadProductos > 0;
    setDeleteAttempt({ supplier, hasProducts });
  };

  const handleDeleteSupplier = async () => {
    if (!deleteAttempt || deleteAttempt.hasProducts) return;
    try {
      await deleteProveedor(deleteAttempt.supplier.id);
      const updatedSuppliers = suppliers.filter((s) => s.id !== deleteAttempt.supplier.id);
      setSuppliers(updatedSuppliers);
      setFilteredSuppliers(updatedSuppliers);
      setDeleteAttempt(null);
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    }
  };

  const resetForm = () => {
    setNewSupplier({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
    });
  };

  const getStatusBadge = (status: string | boolean) => {
    const isActive = typeof status === 'boolean' ? status : status === 'active';
    return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Activo' : 'Inactivo'}</Badge>;
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '—';
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
              <CardDescription>Administra los proveedores y sus relaciones con productos</CardDescription>
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
                  <DialogDescription>Completa la información del proveedor</DialogDescription>
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
                        <div className="font-medium">{supplier.nombre}</div>
                        <div className="text-sm text-muted-foreground">ID: {supplier.id}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.contactoNombre}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{supplier.contactoEmail}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{supplier.telefono}</span>
                        </div>
                        {supplier.direccion && (
                          <div className="text-sm text-muted-foreground flex items-start space-x-1">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{supplier.direccion}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(supplier.estado)}</TableCell>

                    <TableCell>
                      <span className={supplier.cantidadProductos === 0 ? 'text-muted-foreground' : ''}>
                        {supplier.cantidadProductos} 0
                      </span>
                    </TableCell>

                    <TableCell>{formatDate(supplier.fechaRegistro)}</TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditSupplier(supplier)}>
                          <Edit className="w-4 h-4" />
                        </Button>

                        <AlertDialog
                          open={deleteAttempt?.supplier.id === supplier.id}
                          onOpenChange={(open) => !open && setDeleteAttempt(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteAttempt(supplier)}>
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
                                    No se puede eliminar el proveedor "{supplier.nombre}" porque tiene{' '}
                                    {supplier.cantidadProductos} productos asociados. Primero debes eliminar o
                                    reasignar los productos.
                                  </>
                                ) : (
                                  <>
                                    ¿Estás seguro de que deseas eliminar el proveedor "{supplier.nombre}"? Esta acción no
                                    se puede deshacer.
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
