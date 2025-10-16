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
import { Plus, Edit, Trash2, Package, Upload, Search, Eye } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  image: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Pro Max',
    description: 'Último modelo con tecnología avanzada',
    category: 'Smartphones',
    brand: 'TechBrand',
    price: 899990,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1640948612546-3b9e29c23e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMG1vZGVybnxlbnwxfHx8fDE3NTkyNTEzODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    createdAt: '2024-12-01'
  },
  {
    id: '2',
    name: 'Auriculares Inalámbricos Pro',
    description: 'Cancelación de ruido activa',
    category: 'Audio',
    brand: 'AudioTech',
    price: 199990,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwd2lyZWxlc3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTMzNTMyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    createdAt: '2024-12-02'
  }
];

const categories = ['Smartphones', 'Audio', 'Computadoras', 'Accesorios'];
const brands = ['TechBrand', 'AudioTech', 'GameTech', 'SmartDevice'];

export function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    image: '',
    status: 'draft' as 'active' | 'inactive' | 'draft'
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase()) ||
      product.brand.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      brand: newProduct.brand,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      image: newProduct.image || 'https://images.unsplash.com/photo-1640948612546-3b9e29c23e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMG1vZGVybnxlbnwxfHx8fDE3NTkyNTEzODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: newProduct.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setIsCreateModalOpen(false);
    setNewProduct({
      name: '',
      description: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      image: '',
      status: 'draft'
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      status: product.status
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProducts = products.map(p =>
      p.id === editingProduct.id
        ? {
            ...p,
            name: newProduct.name,
            description: newProduct.description,
            category: newProduct.category,
            brand: newProduct.brand,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            image: newProduct.image,
            status: newProduct.status
          }
        : p
    );

    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      image: '',
      status: 'draft'
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      draft: 'outline'
    } as const;

    const labels = {
      active: 'Activo',
      inactive: 'Inactivo',
      draft: 'Borrador'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const ProductForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Producto *</Label>
          <Input
            id="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Select value={newProduct.category} onValueChange={(value: string) => setNewProduct(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marca *</Label>
          <Select value={newProduct.brand} onValueChange={(value: string) => setNewProduct(prev => ({ ...prev, brand: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            step="1"
            min="0"
            value={newProduct.price}
            onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={newProduct.stock}
            onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={newProduct.status} onValueChange={(value: 'active' | 'inactive' | 'draft') => setNewProduct(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={newProduct.description}
          onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descripción detallada del producto"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL de Imagen</Label>
        <div className="flex space-x-2">
          <Input
            id="image"
            value={newProduct.image}
            onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1"
          />
          <Button type="button" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Subir
          </Button>
        </div>
        {newProduct.image && (
          <div className="mt-2">
            <ImageWithFallback
              src={newProduct.image}
              alt="Vista previa"
              className="w-24 h-24 object-cover rounded border"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingProduct(null);
            setNewProduct({
              name: '',
              description: '',
              category: '',
              brand: '',
              price: '',
              stock: '',
              image: '',
              status: 'draft'
            });
          }}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
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
                <Package className="w-5 h-5" />
                <span>Gestión de Productos</span>
              </CardTitle>
              <CardDescription>
                Administra el catálogo de productos
              </CardDescription>
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
                  <DialogTitle>Crear Nuevo Producto</DialogTitle>
                  <DialogDescription>
                    Completa la información del producto
                  </DialogDescription>
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
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? 'text-red-500' : ''}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
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
                              <DialogTitle>Detalles del Producto</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded"
                              />
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>ID: {product.id}</div>
                                <div>Estado: {getStatusBadge(product.status)}</div>
                                <div>Categoría: {product.category}</div>
                                <div>Marca: {product.brand}</div>
                                <div>Precio: {formatCurrency(product.price)}</div>
                                <div>Stock: {product.stock}</div>
                                <div className="col-span-2">
                                  Descripción: {product.description}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={editingProduct?.id === product.id} onOpenChange={(open: boolean) => !open && setEditingProduct(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Producto</DialogTitle>
                              <DialogDescription>
                                Modifica la información del producto
                              </DialogDescription>
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
                              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de que deseas eliminar "{product.name}"? 
                                Esta acción no se puede deshacer.
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