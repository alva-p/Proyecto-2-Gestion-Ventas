import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, List, Search, Eye, AlertTriangle, Tag } from 'lucide-react';

type Brand = {
  id: string;
  name: string;
};

type BrandLine = {
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  status: 'active' | 'inactive';
  productsCount: number;
  createdAt: string;
};

const mockBrands: Brand[] = [
  { id: '1', name: 'TechBrand' },
  { id: '2', name: 'AudioTech' },
  { id: '3', name: 'GameTech' }
];

const mockBrandLines: BrandLine[] = [
  {
    id: '1',
    name: 'Pro',
    description: 'Línea premium con las mejores especificaciones',
    brandId: '1',
    brandName: 'TechBrand',
    status: 'active',
    productsCount: 2,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Professional',
    description: 'Equipos diseñados para uso profesional',
    brandId: '1',
    brandName: 'TechBrand',
    status: 'active',
    productsCount: 1,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Premium',
    description: 'Audio de alta gama con tecnología superior',
    brandId: '2',
    brandName: 'AudioTech',
    status: 'active',
    productsCount: 1,
    createdAt: '2024-02-05'
  },
  {
    id: '4',
    name: 'Outdoor',
    description: 'Equipos resistentes para uso exterior',
    brandId: '2',
    brandName: 'AudioTech',
    status: 'active',
    productsCount: 1,
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    name: 'Gaming',
    description: 'Equipos y accesorios especializados para gaming',
    brandId: '3',
    brandName: 'GameTech',
    status: 'active',
    productsCount: 1,
    createdAt: '2024-03-01'
  },
  {
    id: '6',
    name: 'Esports',
    description: 'Periféricos profesionales para esports',
    brandId: '3',
    brandName: 'GameTech',
    status: 'active',
    productsCount: 1,
    createdAt: '2024-03-05'
  }
];

export function BrandLinesManagement() {
  const [brandLines, setBrandLines] = useState<BrandLine[]>(mockBrandLines);
  const [filteredLines, setFilteredLines] = useState<BrandLine[]>(mockBrandLines);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<BrandLine | null>(null);
  const [deleteAttempt, setDeleteAttempt] = useState<{ line: BrandLine; hasProducts: boolean } | null>(null);
  const [newLine, setNewLine] = useState({
    name: '',
    description: '',
    brandId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedBrand);
  };

  const handleBrandFilter = (brandId: string) => {
    setSelectedBrand(brandId);
    applyFilters(searchTerm, brandId);
  };

  const applyFilters = (term: string, brandId: string) => {
    let filtered = brandLines;

    if (term) {
      filtered = filtered.filter(line =>
        line.name.toLowerCase().includes(term.toLowerCase()) ||
        line.description.toLowerCase().includes(term.toLowerCase()) ||
        line.brandName.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (brandId && brandId !== 'all') {
      filtered = filtered.filter(line => line.brandId === brandId);
    }

    setFilteredLines(filtered);
  };

  const validateLineName = (name: string, brandId: string, excludeId?: string) => {
    return !brandLines.some(line => 
      line.name.toLowerCase() === name.toLowerCase() && 
      line.brandId === brandId && 
      line.id !== excludeId
    );
  };

  const handleCreateLine = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLineName(newLine.name, newLine.brandId)) {
      alert('Ya existe una línea con ese nombre en esta marca');
      return;
    }

    const selectedBrand = mockBrands.find(b => b.id === newLine.brandId);
    if (!selectedBrand) {
      alert('Debe seleccionar una marca válida');
      return;
    }

    const line: BrandLine = {
      id: Date.now().toString(),
      name: newLine.name,
      description: newLine.description,
      brandId: newLine.brandId,
      brandName: selectedBrand.name,
      status: newLine.status,
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedLines = [...brandLines, line];
    setBrandLines(updatedLines);
    setFilteredLines(updatedLines);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditLine = (line: BrandLine) => {
    setEditingLine(line);
    setNewLine({
      name: line.name,
      description: line.description,
      brandId: line.brandId,
      status: line.status
    });
  };

  const handleUpdateLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLine) return;

    if (!validateLineName(newLine.name, newLine.brandId, editingLine.id)) {
      alert('Ya existe una línea con ese nombre en esta marca');
      return;
    }

    const selectedBrand = mockBrands.find(b => b.id === newLine.brandId);
    if (!selectedBrand) {
      alert('Debe seleccionar una marca válida');
      return;
    }

    const updatedLines = brandLines.map(line =>
      line.id === editingLine.id
        ? {
            ...line,
            name: newLine.name,
            description: newLine.description,
            brandId: newLine.brandId,
            brandName: selectedBrand.name,
            status: newLine.status
          }
        : line
    );

    setBrandLines(updatedLines);
    setFilteredLines(updatedLines);
    setEditingLine(null);
    resetForm();
  };

  const handleDeleteAttempt = (line: BrandLine) => {
    const hasProducts = line.productsCount > 0;
    setDeleteAttempt({ line, hasProducts });
  };

  const handleDeleteLine = () => {
    if (!deleteAttempt || deleteAttempt.hasProducts) return;

    const updatedLines = brandLines.filter(line => line.id !== deleteAttempt.line.id);
    setBrandLines(updatedLines);
    setFilteredLines(updatedLines);
    setDeleteAttempt(null);
  };

  const resetForm = () => {
    setNewLine({
      name: '',
      description: '',
      brandId: '',
      status: 'active'
    });
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

  const LineForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="brandId">Marca *</Label>
        <Select value={newLine.brandId} onValueChange={(value: string) => setNewLine(prev => ({ ...prev, brandId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar marca" />
          </SelectTrigger>
          <SelectContent>
            {mockBrands.map(brand => (
              <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Línea *</Label>
        <Input
          id="name"
          value={newLine.name}
          onChange={(e) => setNewLine(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nombre de la línea"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={newLine.description}
          onChange={(e) => setNewLine(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descripción de la línea"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <Select value={newLine.status} onValueChange={(value: 'active' | 'inactive') => setNewLine(prev => ({ ...prev, status: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activa</SelectItem>
            <SelectItem value="inactive">Inactiva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingLine(null);
            resetForm();
          }}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {isEdit ? 'Actualizar Línea' : 'Crear Línea'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <List className="w-5 h-5" />
                <span>Gestión de Líneas por Marca</span>
              </CardTitle>
              <CardDescription>
                Administra las líneas de productos organizadas por marca
              </CardDescription>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nueva Línea</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Línea</DialogTitle>
                  <DialogDescription>
                    Completa la información de la línea de productos
                  </DialogDescription>
                </DialogHeader>
                <LineForm onSubmit={handleCreateLine} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar líneas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <Select value={selectedBrand} onValueChange={handleBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {mockBrands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Línea</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{line.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {line.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span>{line.brandName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{line.description || 'Sin descripción'}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(line.status)}</TableCell>
                    <TableCell>
                      <span className={line.productsCount === 0 ? 'text-muted-foreground' : ''}>
                        {line.productsCount} productos
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(line.createdAt)}</TableCell>
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
                              <DialogTitle>Detalles de la Línea</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>ID: {line.id}</div>
                                <div>Marca: {line.brandName}</div>
                                <div>Estado: {getStatusBadge(line.status)}</div>
                                <div>Productos: {line.productsCount}</div>
                                <div>Creación: {formatDate(line.createdAt)}</div>
                                <div></div>
                                <div className="col-span-2">
                                  <strong>Descripción:</strong><br />
                                  {line.description || 'Sin descripción'}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={editingLine?.id === line.id} onOpenChange={(open: boolean) => !open && setEditingLine(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditLine(line)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Editar Línea</DialogTitle>
                              <DialogDescription>
                                Modifica la información de la línea
                              </DialogDescription>
                            </DialogHeader>
                            <LineForm onSubmit={handleUpdateLine} isEdit />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog open={deleteAttempt?.line.id === line.id} onOpenChange={(open: boolean) => !open && setDeleteAttempt(null)}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteAttempt(line)}
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
                                    No se puede eliminar la línea "{line.name}" porque tiene {line.productsCount} productos asociados. 
                                    Primero debes eliminar o reasignar los productos.
                                  </>
                                ) : (
                                  <>
                                    ¿Estás seguro de que deseas eliminar la línea "{line.name}"? 
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
                                  onClick={handleDeleteLine}
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

          {filteredLines.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron líneas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}