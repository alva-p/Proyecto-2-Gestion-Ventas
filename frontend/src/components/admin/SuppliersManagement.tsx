// src/components/admin/SuppliersManagement.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui";
import { Plus, Edit, Trash2, Building2, Search, Eye, Phone, Mail, MapPin } from "lucide-react";
import type { Proveedor } from "../../types/Proveedor";
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../../services/proveedorService";

// -----------------------------------------------------------------------------
// FORM COMPONENT
// -----------------------------------------------------------------------------
type SupplierFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  newSupplier: {
    nombre: string;
    contactoNombre: string;
    contactoEmail: string;
    telefono: string;
    direccion: string;
    estado: "active" | "inactive";
  };
  setNewSupplier: React.Dispatch<
    React.SetStateAction<{
      nombre: string;
      contactoNombre: string;
      contactoEmail: string;
      telefono: string;
      direccion: string;
      estado: "active" | "inactive";
    }>
  >;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingSupplier: React.Dispatch<React.SetStateAction<Proveedor | null>>;
  resetForm: () => void;
};

const SupplierFormComponent = React.memo<SupplierFormProps>(
  ({
    onSubmit,
    isEdit = false,
    newSupplier,
    setNewSupplier,
    setIsCreateModalOpen,
    setEditingSupplier,
    resetForm,
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Proveedor *</Label>
          <Input
            id="nombre"
            value={newSupplier.nombre}
            onChange={(e) =>
              setNewSupplier((prev) => ({ ...prev, nombre: e.target.value }))
            }
            placeholder="Nombre de la empresa"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactoNombre">Persona de Contacto *</Label>
          <Input
            id="contactoNombre"
            value={newSupplier.contactoNombre}
            onChange={(e) =>
              setNewSupplier((prev) => ({
                ...prev,
                contactoNombre: e.target.value,
              }))
            }
            placeholder="Nombre del contacto"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactoEmail">Email *</Label>
          <Input
            id="contactoEmail"
            type="email"
            value={newSupplier.contactoEmail}
            onChange={(e) =>
              setNewSupplier((prev) => ({
                ...prev,
                contactoEmail: e.target.value,
              }))
            }
            placeholder="email@empresa.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={newSupplier.telefono}
            onChange={(e) =>
              setNewSupplier((prev) => ({ ...prev, telefono: e.target.value }))
            }
            placeholder="+54 11 1234-5678"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Textarea
          id="direccion"
          value={newSupplier.direccion}
          onChange={(e) =>
            setNewSupplier((prev) => ({ ...prev, direccion: e.target.value }))
          }
          placeholder="Dirección completa"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <select
          id="estado"
          value={newSupplier.estado}
          onChange={(e) =>
            setNewSupplier((prev) => ({
              ...prev,
              estado: e.target.value as "active" | "inactive",
            }))
          }
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
          {isEdit ? "Actualizar Proveedor" : "Crear Proveedor"}
        </Button>
      </div>
    </form>
  )
);

SupplierFormComponent.displayName = "SupplierForm";

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
export function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Proveedor[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Proveedor | null>(
    null
  );
  const [deleteAttempt, setDeleteAttempt] = useState<{
    supplier: Proveedor;
    hasProducts: boolean;
  } | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    nombre: "",
    contactoNombre: "",
    contactoEmail: "",
    telefono: "",
    direccion: "",
    estado: "active" as "active" | "inactive",
  });

  // ---------------------------------------------------------------------------
  // CRUD HANDLERS
  // ---------------------------------------------------------------------------

  useEffect(() => {
    getProveedores().then((data) => {
      setSuppliers(data);
      setFilteredSuppliers(data);
    });
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.nombre.toLowerCase().includes(term.toLowerCase()) ||
        supplier.contactoNombre.toLowerCase().includes(term.toLowerCase()) ||
        supplier.contactoEmail.toLowerCase().includes(term.toLowerCase()) ||
        supplier.telefono.includes(term)
    );
    setFilteredSuppliers(filtered);
  };

  const resetForm = () => {
    setNewSupplier({
      nombre: "",
      contactoNombre: "",
      contactoEmail: "",
      telefono: "",
      direccion: "",
      estado: "active",
    });
  };

  const handleCreateSupplier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...newSupplier,
      estado: newSupplier.estado === "active",
    };
    const created = await createProveedor(payload);
    const updated = [...suppliers, created];
    setSuppliers(updated);
    setFilteredSuppliers(updated);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditSupplier = (supplier: Proveedor) => {
    setEditingSupplier(supplier);
    setNewSupplier({
      nombre: supplier.nombre,
      contactoNombre: supplier.contactoNombre,
      contactoEmail: supplier.contactoEmail,
      telefono: supplier.telefono,
      direccion: supplier.direccion,
      estado: supplier.estado ? "active" : "inactive",
    });
  };

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;
    const payload = {
      ...newSupplier,
      estado: newSupplier.estado === "active",
    };
    const updated = await updateProveedor(editingSupplier.id, payload);
    const newList = suppliers.map((s) =>
      s.id === updated.id ? updated : s
    );
    setSuppliers(newList);
    setFilteredSuppliers(newList);
    setEditingSupplier(null);
    resetForm();
  };

  const handleDeleteAttempt = (supplier: Proveedor) => {
    const hasProducts = (supplier.cantidadProductos ?? 0) > 0;
    setDeleteAttempt({ supplier, hasProducts });
  };

  const handleDeleteSupplier = async () => {
    if (!deleteAttempt || deleteAttempt.hasProducts) return;
    await deleteProveedor(deleteAttempt.supplier.id);
    const updated = suppliers.filter((s) => s.id !== deleteAttempt.supplier.id);
    setSuppliers(updated);
    setFilteredSuppliers(updated);
    setDeleteAttempt(null);
  };

  const getStatusBadge = (estado: boolean) => {
    return (
      <Badge variant={estado ? "default" : "secondary"}>
        {estado ? "Activo" : "Inactivo"}
      </Badge>
    );
  };

  const formatDate = (date?: Date) =>
    date ? new Date(date).toLocaleDateString("es-ES") : "-";

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
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
          {/* 🔍 Búsqueda */}
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

          {/* 🧾 Tabla */}
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {supplier.contactoNombre}
                        </div>
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
                            <span className="line-clamp-2">
                              {supplier.direccion}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(supplier.estado)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          supplier.cantidadProductos === 0
                            ? "text-muted-foreground"
                            : ""
                        }
                      >
                        {supplier.cantidadProductos} productos
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(supplier.fechaRegistro)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {/* ✏️ Editar */}
                        <Dialog
                          open={editingSupplier?.id === supplier.id}
                          onOpenChange={(open) =>
                            !open && setEditingSupplier(null)
                          }
                        >
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

                        {/* 🗑️ Eliminar */}
                        <AlertDialog
                          open={deleteAttempt?.supplier.id === supplier.id}
                          onOpenChange={(open) =>
                            !open && setDeleteAttempt(null)
                          }
                        >
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
                                {deleteAttempt?.hasProducts
                                  ? "No se puede eliminar"
                                  : "Confirmar eliminación"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {deleteAttempt?.hasProducts ? (
                                  <>
                                    No se puede eliminar el proveedor "
                                    {supplier.nombre}" porque tiene{" "}
                                    {supplier.cantidadProductos} productos
                                    asociados.
                                  </>
                                ) : (
                                  <>
                                    ¿Estás seguro de que deseas eliminar el
                                    proveedor "{supplier.nombre}"?
                                  </>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {deleteAttempt?.hasProducts
                                  ? "Entendido"
                                  : "Cancelar"}
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
