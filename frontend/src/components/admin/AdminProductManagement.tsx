import React, { useState, useEffect, useRef, act } from 'react';
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
import { Plus, Edit, Trash2, Package, Upload, Search, Eye, X, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import API from '../../index';
import { createLinea } from '../../services/lineaService';
import { createMarca } from '../../services/marcaService';
import type { Marca } from "../../types/Marca";
import type { Linea } from "../../types/Linea";

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: boolean;
  linea?: { nombre: string; marca?: { nombre: string } };
};

export function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [lines, setLines] = useState<Linea[]>([]);
  const [brands, setBrands] = useState<Marca[]>([]);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    lineaId: '',
    precio: '',
    stock: '',
    estado: true,
  });

  // Imagenes (local o URL) para crear/editar producto
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imageValidationError, setImageValidationError] = useState<string>('');
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  // Estados para crear línea y marca
  const [isCreateLineDialogOpen, setIsCreateLineDialogOpen] = useState(false);
  const [isCreateBrandDialogOpen, setIsCreateBrandDialogOpen] = useState(false);
  const [newLineData, setNewLineData] = useState({ nombre: '', descripcion: '', marcaId: '', estado: true });
  const [newBrandData, setNewBrandData] = useState({ nombre: '', descripcion: '' });

  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageValidationError('Solo se permiten archivos .jpg, .jpeg o .png');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageValidationError('El archivo no debe superar los 5MB');
      return;
    }

    setImageValidationError('');
    setUploadedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedImageFile = () => {
    setUploadedImageFile(null);
    setNewImageUrl('');
    setImageValidationError('');
    if (imageFileInputRef.current) imageFileInputRef.current.value = '';
  };

  // Funciones para crear línea y marca
  const handleCreateLine = async () => {
    if (!newLineData.nombre.trim()) {
      alert('El nombre de la línea es obligatorio');
      return;
    }
    if (!newLineData.marcaId) {
      alert('Debe seleccionar una marca para la línea');
      return;
    }

    // Validar que no exista una línea con el mismo nombre
    const exists = lines.some((l) => l.nombre.toLowerCase() === newLineData.nombre.trim().toLowerCase());
    if (exists) {
      alert('Ya existe una línea con ese nombre');
      return;
    }
    try {
      const response = await createLinea({
      nombre: newLineData.nombre.trim(),
      descripcion: newLineData.descripcion.trim() || undefined,
      estado: newLineData.estado,
      marcaId: parseInt(newLineData.marcaId),
      });
      
      // Recargar las líneas desde el backend para tener datos completos
      const lineasRes = await API.get('/lineas');
      setLines(lineasRes.data);
      
      // Seleccionar automáticamente la nueva línea en el formulario
      setNewProduct(prev => ({ ...prev, lineaId: response.id.toString() }));
      
      // Resetear y cerrar diálogo
      setNewLineData({ nombre: '', descripcion: '', marcaId: '', estado: true });
      setIsCreateLineDialogOpen(false);
      
      alert('Línea creada exitosamente');
    } catch (err) {
      console.error('Error creando línea:', err);
      alert('Error al crear la línea');
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandData.nombre.trim()) {
      alert('El nombre de la marca es obligatorio');
      return;
    }

    // Validar que no exista una marca con el mismo nombre
    const exists = brands.some((m) => m.nombre.toLowerCase() === newBrandData.nombre.trim().toLowerCase());
    if (exists) {
      alert('Ya existe una marca con ese nombre');
      return;
    }

    try {
      await createMarca({
        nombre: newBrandData.nombre.trim(),
        descripcion: newBrandData.descripcion.trim() || undefined,
      });
      
      // Recargar las marcas desde el backend
      const marcasRes = await API.get('/marca');
      setBrands(marcasRes.data);
      
      // Resetear y cerrar diálogo
      setNewBrandData({ nombre: '', descripcion: '' });
      setIsCreateBrandDialogOpen(false);
      
      alert('Marca creada exitosamente. Ahora puede crear una línea asociada a esta marca.');
    } catch (err) {
      console.error('Error creando marca:', err);
      alert('Error al crear la marca');
    }
  };

  // 🔹 Cargar productos, líneas y marcas desde backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, lineasRes, marcasRes] = await Promise.all([
          API.get('/producto'),
          API.get('/lineas'),
          API.get('/marca'),
        ]);
        setProducts(productosRes.data);
        setFilteredProducts(productosRes.data);
        setLines(lineasRes.data);
        setBrands(marcasRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    fetchData();
  }, []);

  // 🔍 Búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = products.filter(p =>
      p.nombre.toLowerCase().includes(term.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(term.toLowerCase()) ||
      p.linea?.nombre?.toLowerCase().includes(term.toLowerCase()) ||
      p.linea?.marca?.nombre?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // 🟢 Crear producto
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/producto', {
        nombre: newProduct.nombre,
        descripcion: newProduct.descripcion,
        lineaId: parseInt(newProduct.lineaId),
        precio: parseFloat(newProduct.precio),
        stock: parseInt(newProduct.stock),
        estado: newProduct.estado,
        image: newImageUrl || null,
      });
      const updated = [...products, res.data];
      setProducts(updated);
      setFilteredProducts(updated);
      setIsCreateModalOpen(false);
      setNewProduct({
        nombre: '',
        descripcion: '',
        lineaId: '',
        precio: '',
        stock: '',
        estado: true,
      });
      // limpiar imagenes
      clearUploadedImageFile();
      setNewImageUrl('');
    } catch (error) {
      console.error('Error creando producto:', error);
    }
  };

  // 🟡 Editar producto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      nombre: product.nombre,
      descripcion: product.descripcion,
      lineaId: product.linea ? String(lines.find(l => l.nombre === product.linea?.nombre)?.id || '') : '',
      precio: String(product.precio),
      stock: String(product.stock),
      estado: product.estado,
    });
    // si el producto tiene imagen en el backend, cargarla en el preview
    // usamos any por si el tipo no la define
    const img = (product as any).image || '';
    setNewImageUrl(img);
    setUploadedImageFile(null);
    setImageValidationError('');
  };

  // 🔵 Actualizar producto
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await API.patch(`/producto/${editingProduct.id}`, {
        nombre: newProduct.nombre,
        descripcion: newProduct.descripcion,
        lineaId: parseInt(newProduct.lineaId),
        precio: parseFloat(newProduct.precio),
        stock: parseInt(newProduct.stock),
        estado: newProduct.estado,
        image: newImageUrl || null,
      });
      const updated = products.map(p => (p.id === editingProduct.id ? res.data : p));
      setProducts(updated);
      setFilteredProducts(updated);
      setEditingProduct(null);
      // limpiar imagenes luego de editar
      clearUploadedImageFile();
      setNewImageUrl('');
    } catch (error) {
      console.error('Error actualizando producto:', error);
    }
  };

  //Eliminar producto
  const handleDeleteProduct = async (id: number) => {
    try {
      await API.delete(`/producto/${id}`);
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      setFilteredProducts(updated);
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

  const ProductForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del producto *</Label>
          <Input
            id="nombre"
            value={newProduct.nombre}
            onChange={e => setNewProduct(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="lineaId">Línea *</Label>
            <Dialog open={isCreateLineDialogOpen} onOpenChange={setIsCreateLineDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Agregar nueva línea
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Línea</DialogTitle>
                  <DialogDescription>Complete los datos para crear una nueva línea de productos</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newLineName">Nombre *</Label>
                    <Input
                      id="newLineName"
                      value={newLineData.nombre}
                      onChange={(e) => setNewLineData((d) => ({ ...d, nombre: e.target.value }))}
                      placeholder="Ej: Electrónica"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newLineDescription">Descripción</Label>
                    <Textarea
                      id="newLineDescription"
                      value={newLineData.descripcion}
                      onChange={(e) => setNewLineData((d) => ({ ...d, descripcion: e.target.value }))}
                      placeholder="Descripción de la línea (opcional)"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newLineMarca">Marca *</Label>
                    <Select
                      value={newLineData.marcaId}
                      onValueChange={(v) => setNewLineData((d) => ({ ...d, marcaId: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((marca) => (
                          <SelectItem key={marca.id} value={marca.id.toString()}>
                            {marca.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newLineEstado">Estado *</Label>
                    <Select
                      value={newLineData.estado ? "true" : "false"}
                      onValueChange={(v) => setNewLineData((d) => ({ ...d, estado: v === "true" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateLineDialogOpen(false);
                        setNewLineData({ nombre: '', descripcion: '', marcaId: '', estado: true });
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="button" onClick={handleCreateLine}>
                      Crear Línea
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Select
            value={newProduct.lineaId}
            onValueChange={v => setNewProduct(prev => ({ ...prev, lineaId: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar línea" />
            </SelectTrigger>
            <SelectContent>
              {lines.map(line => (
                <SelectItem key={line.id} value={String(line.id)}>
                  {line.nombre} ({line.marca?.nombre})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Botón para crear nueva marca */}
        <div className="col-span-2">
          <Dialog open={isCreateBrandDialogOpen} onOpenChange={setIsCreateBrandDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Crear nueva marca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Marca</DialogTitle>
                <DialogDescription>Complete los datos para crear una nueva marca</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newBrandName">Nombre *</Label>
                  <Input
                    id="newBrandName"
                    value={newBrandData.nombre}
                    onChange={(e) => setNewBrandData((d) => ({ ...d, nombre: e.target.value }))}
                    placeholder="Ej: Samsung"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newBrandDescription">Descripción</Label>
                  <Textarea
                    id="newBrandDescription"
                    value={newBrandData.descripcion}
                    onChange={(e) => setNewBrandData((d) => ({ ...d, descripcion: e.target.value }))}
                    placeholder="Descripción de la marca (opcional)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateBrandDialogOpen(false);
                      setNewBrandData({ nombre: '', descripcion: '' });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleCreateBrand}>
                    Crear Marca
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precio">Precio *</Label>
          <Input
            id="precio"
            type="number"
            value={newProduct.precio}
            onChange={e => setNewProduct(prev => ({ ...prev, precio: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            value={newProduct.stock}
            onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            value={newProduct.estado ? 'true' : 'false'}
            onValueChange={v => setNewProduct(prev => ({ ...prev, estado: v === 'true' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Activo</SelectItem>
              <SelectItem value="false">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={newProduct.descripcion}
          onChange={e => setNewProduct(prev => ({ ...prev, descripcion: e.target.value }))}
          rows={3}
        />
      </div>

      {/* Sección de imagen del producto */}
      <div className="space-y-2">
        <Label htmlFor="image">Imagen del Producto</Label>
        
        {/* Opción 1: Subir archivo local */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              ref={imageFileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => imageFileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadedImageFile ? 'Cambiar Archivo' : 'Subir Archivo Local'}
            </Button>
            {uploadedImageFile && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={clearUploadedImageFile}
                title="Eliminar archivo"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {uploadedImageFile && (
            <p className="text-sm text-green-600 flex items-center space-x-1">
              <span>✓</span>
              <span>{uploadedImageFile.name}</span>
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
          id="image"
          value={uploadedImageFile ? '' : newImageUrl}
          onChange={(e) => {
            const value = e.target.value;
            setNewImageUrl(value);
            setUploadedImageFile(null);
            setImageValidationError('');
          }}
          placeholder="https://ejemplo.com/imagen.jpg"
          disabled={!!uploadedImageFile}
          className={uploadedImageFile ? 'opacity-50' : ''}
        />

        {/* Mensaje de error de validación */}
        {imageValidationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{imageValidationError}</span>
            </div>
          </div>
        )}

        {/* Vista previa de la imagen */}
        {newImageUrl && (
          <div className="mt-2 p-4 border rounded-lg bg-muted/50">
            <p className="text-sm font-medium mb-2">Vista previa:</p>
            <ImageWithFallback
              src={newImageUrl}
              alt="Vista previa del producto"
              className="w-20 h-20 object-contain rounded border bg-white p-2"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit">{isEdit ? 'Actualizar Producto' : 'Crear Producto'}</Button>
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
                <Package className="w-5 h-5" />
                <span>Gestión de Productos</span>
              </CardTitle>
              <CardDescription>Administra el catálogo de productos</CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear nuevo producto</DialogTitle>
                  <DialogDescription>Completa los datos</DialogDescription>
                </DialogHeader>
                <ProductForm onSubmit={handleCreateProduct} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Línea</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell>{product.linea?.nombre ?? '-'}</TableCell>
                    <TableCell>{product.linea?.marca?.nombre ?? '-'}</TableCell>
                    <TableCell>{formatCurrency(product.precio)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.estado ? 'default' : 'secondary'}>
                        {product.estado ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog open={editingProduct?.id === product.id} onOpenChange={open => !open && setEditingProduct(null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Editar Producto</DialogTitle>
                            </DialogHeader>
                            <ProductForm onSubmit={handleUpdateProduct} isEdit />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Seguro que deseas eliminar "{product.nombre}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Eliminar
                              </AlertDialogAction>
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron productos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
