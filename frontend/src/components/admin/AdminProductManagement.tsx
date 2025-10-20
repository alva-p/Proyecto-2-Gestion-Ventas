import React, { useState, useEffect } from 'react';
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
import { Plus, Edit, Trash2, Package, Upload, Search, Eye } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import API from '../../index';

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: boolean;
  linea?: { nombre: string; marca?: { nombre: string } };
};

type Marca = { id: number; nombre: string };
type Linea = { id: number; nombre: string; marca: Marca };

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
      });
      const updated = products.map(p => (p.id === editingProduct.id ? res.data : p));
      setProducts(updated);
      setFilteredProducts(updated);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error actualizando producto:', error);
    }
  };

  // 🔴 Eliminar producto
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
          <Label htmlFor="lineaId">Línea *</Label>
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
