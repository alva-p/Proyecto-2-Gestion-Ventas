import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, Tag, Upload, Search, Eye, AlertTriangle, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

type Brand = {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'active' | 'inactive';
  productsCount: number;
  createdAt: string;
};

const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'TechBrand',
    description: 'Marca líder en tecnología innovadora',
    logo: 'https://images.unsplash.com/photo-1622465911368-72162f8da3e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGxvZ28lMjBjb21wYW55fGVufDF8fHx8MTc1OTM0ODIwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    productsCount: 15,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'AudioTech',
    description: 'Especialistas en equipos de audio profesional',
    logo: 'https://images.unsplash.com/photo-1622465911368-72162f8da3e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGxvZ28lMjBjb21wYW55fGVufDF8fHx8MTc1OTM0ODIwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    productsCount: 8,
    createdAt: '2024-02-10'
  },
  {
    id: '3',
    name: 'GameTech',
    description: 'Gaming y entretenimiento de alta gama',
    logo: 'https://images.unsplash.com/photo-1622465911368-72162f8da3e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGxvZ28lMjBjb21wYW55fGVufDF8fHx8MTc1OTM0ODIwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'inactive',
    productsCount: 0,
    createdAt: '2024-03-05'
  }
];

// Componente BrandForm separado para evitar re-renders
type BrandFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  newBrand: {
    name: string;
    description: string;
    logo: string;
    status: 'active' | 'inactive';
  };
  setNewBrand: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    logo: string;
    status: 'active' | 'inactive';
  }>>;
  validationError: string;
  setValidationError: React.Dispatch<React.SetStateAction<string>>;
  uploadedFile: File | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearUploadedFile: () => void;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingBrand: React.Dispatch<React.SetStateAction<Brand | null>>;
  resetForm: () => void;
};

const BrandFormComponent = React.memo<BrandFormProps>(({
  onSubmit,
  isEdit = false,
  newBrand,
  setNewBrand,
  validationError,
  setValidationError,
  uploadedFile,
  setUploadedFile,
  fileInputRef,
  handleFileUpload,
  clearUploadedFile,
  setIsCreateModalOpen,
  setEditingBrand,
  resetForm,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {validationError && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="block sm:inline">{validationError}</span>
        </div>
      </div>
    )}

    <div className="space-y-2">
      <Label htmlFor="name">Nombre de la Marca *</Label>
      <Input
        id="name"
        value={newBrand.name}
        onChange={(e) => {
          const value = e.target.value;
          setNewBrand(prev => ({ ...prev, name: value }));
          setValidationError('');
        }}
        placeholder="Nombre de la marca"
        required
        className={validationError.includes('nombre') ? 'border-red-500' : ''}
      />
      <p className="text-sm text-muted-foreground">
        El nombre debe ser único en el sistema
      </p>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Descripción</Label>
      <Textarea
        id="description"
        value={newBrand.description}
        onChange={(e) => {
          const value = e.target.value;
          setNewBrand(prev => ({ ...prev, description: value }));
        }}
        placeholder="Descripción de la marca"
        rows={3}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="logo">Logo de la Marca</Label>
      
      {/* Opción 1: Subir archivo local */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadedFile ? 'Cambiar Archivo' : 'Subir Archivo Local'}
          </Button>
          {uploadedFile && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={clearUploadedFile}
              title="Eliminar archivo"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {uploadedFile && (
          <p className="text-sm text-green-600 flex items-center space-x-1">
            <span>✓</span>
            <span>{uploadedFile.name}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Formatos aceptados: JPG, JPEG, PNG (máx. 5MB)
        </p>
      </div>

      {/* Opción 2: URL desde internet */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O ingresa una URL</span>
        </div>
      </div>

      <Input
        id="logo"
        value={uploadedFile ? '' : newBrand.logo}
        onChange={(e) => {
          const value = e.target.value;
          setNewBrand(prev => ({ ...prev, logo: value }));
          setUploadedFile(null);
        }}
        placeholder="https://ejemplo.com/logo.png"
        disabled={!!uploadedFile}
        className={uploadedFile ? 'opacity-50' : ''}
      />

      {/* Vista previa del logo */}
      {newBrand.logo && (
        <div className="mt-2 p-4 border rounded-lg bg-muted/50">
          <p className="text-sm font-medium mb-2">Vista previa:</p>
          <ImageWithFallback
            src={newBrand.logo}
            alt="Vista previa del logo"
            className="w-20 h-20 object-contain rounded border bg-white p-2"
          />
        </div>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="status">Estado</Label>
      <select
        id="status"
        value={newBrand.status}
        onChange={(e) => {
          const value = e.target.value as 'active' | 'inactive';
          setNewBrand(prev => ({ ...prev, status: value }));
        }}
        className="w-full px-3 py-2 border border-input bg-background rounded-md"
      >
        <option value="active">Activa</option>
        <option value="inactive">Inactiva</option>
      </select>
    </div>

    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => {
          setIsCreateModalOpen(false);
          setEditingBrand(null);
          resetForm();
        }}
      >
        Cancelar
      </Button>
      <Button type="submit">
        {isEdit ? 'Actualizar Marca' : 'Crear Marca'}
      </Button>
    </div>
  </form>
));

BrandFormComponent.displayName = 'BrandForm';

export function AdminBrandManagement() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>(mockBrands);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteAttempt, setDeleteAttempt] = useState<{ brand: Brand; hasProducts: boolean } | null>(null);
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    logo: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [validationError, setValidationError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(term.toLowerCase()) ||
      brand.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  const validateBrandName = (name: string, excludeId?: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: 'El nombre de la marca es obligatorio' };
    }

    const existingBrand = brands.find(brand => 
      brand.name.toLowerCase() === name.toLowerCase() && brand.id !== excludeId
    );

    if (existingBrand) {
      return { 
        isValid: false, 
        error: `Ya existe una marca con el nombre "${name}". Por favor, elige un nombre diferente.` 
      };
    }

    return { isValid: true };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Solo se permiten archivos .jpg, .jpeg o .png');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setValidationError('El archivo no debe superar los 5MB');
      return;
    }

    setValidationError('');
    setUploadedFile(file);

    // Convertir a base64 para preview y almacenamiento
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBrand(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setNewBrand(prev => ({ ...prev, logo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateBrandName(newBrand.name);
    if (!validation.isValid) {
      setValidationError(validation.error || '');
      return;
    }

    const brand: Brand = {
      id: Date.now().toString(),
      name: newBrand.name.trim(),
      description: newBrand.description.trim(),
      logo: newBrand.logo || 'https://images.unsplash.com/photo-1622465911368-72162f8da3e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGxvZ28lMjBjb21wYW55fGVufDF8fHx8MTc1OTM0ODIwOXww&ixlib=rb-4.1.0&q=80&w=1080',
      status: newBrand.status,
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedBrands = [...brands, brand];
    setBrands(updatedBrands);
    setFilteredBrands(updatedBrands);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setNewBrand({
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
      status: brand.status
    });
  };

  const handleUpdateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    const validation = validateBrandName(newBrand.name, editingBrand.id);
    if (!validation.isValid) {
      setValidationError(validation.error || '');
      return;
    }

    const updatedBrands = brands.map(b =>
      b.id === editingBrand.id
        ? {
            ...b,
            name: newBrand.name.trim(),
            description: newBrand.description.trim(),
            logo: newBrand.logo,
            status: newBrand.status
          }
        : b
    );

    setBrands(updatedBrands);
    setFilteredBrands(updatedBrands);
    setEditingBrand(null);
    resetForm();
  };

  const handleDeleteAttempt = (brand: Brand) => {
    const hasProducts = brand.productsCount > 0;
    setDeleteAttempt({ brand, hasProducts });
  };

  const handleDeleteBrand = () => {
    if (!deleteAttempt || deleteAttempt.hasProducts) return;

    const updatedBrands = brands.filter(b => b.id !== deleteAttempt.brand.id);
    setBrands(updatedBrands);
    setFilteredBrands(updatedBrands);
    setDeleteAttempt(null);
  };

  const resetForm = () => {
    setNewBrand({
      name: '',
      description: '',
      logo: '',
      status: 'active'
    });
    setValidationError('');
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary'
    } as const;

    const labels = {
      active: 'Activa',
      inactive: 'Inactiva'
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
                <Tag className="w-5 h-5" />
                <span>Gestión de Marcas</span>
              </CardTitle>
              <CardDescription>
                Administra las marcas del catálogo
              </CardDescription>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nueva Marca</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Marca</DialogTitle>
                  <DialogDescription>
                    Completa la información de la marca
                  </DialogDescription>
                </DialogHeader>
                <BrandFormComponent
                  onSubmit={handleCreateBrand}
                  newBrand={newBrand}
                  setNewBrand={setNewBrand}
                  validationError={validationError}
                  setValidationError={setValidationError}
                  uploadedFile={uploadedFile}
                  setUploadedFile={setUploadedFile}
                  fileInputRef={fileInputRef}
                  handleFileUpload={handleFileUpload}
                  clearUploadedFile={clearUploadedFile}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  setEditingBrand={setEditingBrand}
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
                placeholder="Buscar marcas..."
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
                  <TableHead>Marca</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={brand.logo}
                          alt={brand.name}
                          className="w-10 h-10 object-contain rounded border p-1"
                        />
                        <div>
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {brand.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{brand.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(brand.status)}</TableCell>
                    <TableCell>
                      <span className={brand.productsCount === 0 ? 'text-muted-foreground' : ''}>
                        {brand.productsCount} productos
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(brand.createdAt)}</TableCell>
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
                              <DialogTitle>Detalles de la Marca</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <ImageWithFallback
                                  src={brand.logo}
                                  alt={brand.name}
                                  className="w-16 h-16 object-contain rounded border p-2"
                                />
                                <div>
                                  <h3 className="font-medium">{brand.name}</h3>
                                  {getStatusBadge(brand.status)}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>ID: {brand.id}</div>
                                <div>Productos: {brand.productsCount}</div>
                                <div>Creación: {formatDate(brand.createdAt)}</div>
                                <div>Estado: {brand.status}</div>
                                <div className="col-span-2">
                                  Descripción: {brand.description || 'Sin descripción'}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={editingBrand?.id === brand.id} onOpenChange={(open: boolean) => !open && setEditingBrand(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditBrand(brand)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Editar Marca</DialogTitle>
                              <DialogDescription>
                                Modifica la información de la marca
                              </DialogDescription>
                            </DialogHeader>
                            <BrandFormComponent
                              onSubmit={handleUpdateBrand}
                              isEdit
                              newBrand={newBrand}
                              setNewBrand={setNewBrand}
                              validationError={validationError}
                              setValidationError={setValidationError}
                              uploadedFile={uploadedFile}
                              setUploadedFile={setUploadedFile}
                              fileInputRef={fileInputRef}
                              handleFileUpload={handleFileUpload}
                              clearUploadedFile={clearUploadedFile}
                              setIsCreateModalOpen={setIsCreateModalOpen}
                              setEditingBrand={setEditingBrand}
                              resetForm={resetForm}
                            />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog open={deleteAttempt?.brand.id === brand.id} onOpenChange={(open: boolean) => !open && setDeleteAttempt(null)}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteAttempt(brand)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center space-x-2">
                                {deleteAttempt?.hasProducts && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                                <span>
                                  {deleteAttempt?.hasProducts ? 'No se puede eliminar' : 'Confirmar eliminación'}
                                </span>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {deleteAttempt?.hasProducts ? (
                                  <>
                                    No se puede eliminar la marca "{brand.name}" porque tiene {brand.productsCount} productos asociados. 
                                    Primero debes eliminar o reasignar los productos.
                                  </>
                                ) : (
                                  <>
                                    ¿Estás seguro de que deseas eliminar la marca "{brand.name}"? 
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
                                  onClick={handleDeleteBrand}
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

          {filteredBrands.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron marcas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}