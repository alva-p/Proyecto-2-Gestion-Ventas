import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Package, 
  Search, 
  DollarSign, 
  User, 
  FileText,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';
import { getProductos } from '../../services/productService';
import { createVenta, getVentas } from '../../services/ventaService';
import type { Producto } from '../../types/Producto';
import type { Venta } from '../../types/venta';

type UserProp = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor';
};

type SaleItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type SalesRegistrationProps = {
  user: UserProp;
};

export function SalesRegistration({ user }: SalesRegistrationProps) {
  const [products, setProducts] = useState<Producto[]>([]);
  const [sales, setSales] = useState<Venta[]>([]);
  const [isAddingSale, setIsAddingSale] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSale, setCurrentSale] = useState({
    customerName: '',
    customerDocument: '',
    invoiceType: 'B' as 'A' | 'B' | 'C',
    notes: ''
  });

  // Cargar productos y ventas al montar
  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProductos();
      // Filtrar solo productos activos con stock
      setProducts(data.filter(p => p.estado && p.stock > 0));
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      const data = await getVentas();
      console.log('📋 Ventas cargadas:', data);
      setSales(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const addProductToSale = (product: Producto) => {
    const existingItem = selectedProducts.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setSelectedProducts(prev => prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        ));
      } else {
        toast.error('No hay suficiente stock disponible');
      }
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.nombre,
        quantity: 1,
        unitPrice: product.precio,
        total: product.precio
      };
      setSelectedProducts(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.stock) {
      toast.error('Cantidad excede el stock disponible');
      return;
    }

    if (newQuantity <= 0) {
      removeProductFromSale(productId);
      return;
    }

    setSelectedProducts(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
        : item
    ));
  };

  const removeProductFromSale = (productId: number) => {
    setSelectedProducts(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.total, 0);
  };

  const completeSale = async () => {
    if (!currentSale.customerName || !currentSale.customerDocument || selectedProducts.length === 0) {
      toast.error('Complete los datos del cliente y agregue productos');
      return;
    }

    try {
      setIsSubmitting(true);
      const total = calculateTotal();
      
      const ventaData = {
        usuario_id: parseInt(user.id),
        productos: selectedProducts.map(item => item.productId),
        importe_total: Number(total), // El total ya es un número
        notas: currentSale.notes || undefined,
        cliente_nombre: currentSale.customerName,
        cliente_documento: currentSale.customerDocument,
        tipo: currentSale.invoiceType
      };

      console.log('📦 Datos a enviar:', ventaData);
      console.log('👤 User ID:', user.id, 'tipo:', typeof user.id);
      console.log('🛒 Productos seleccionados:', selectedProducts);

      const ventaCreada = await createVenta(ventaData);
      console.log('✅ Venta creada:', ventaCreada);
      
      // Recargar ventas
      await loadSales();
      
      // Reset form
      setCurrentSale({
        customerName: '',
        customerDocument: '',
        invoiceType: 'B',
        notes: ''
      });
      setSelectedProducts([]);
      setIsAddingSale(false);
      
      toast.success('Venta registrada exitosamente. La factura se ha generado automáticamente.');
    } catch (error: any) {
      console.error('Error al registrar venta:', error);
      toast.error(error.response?.data?.message || 'Error al registrar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Registro de Ventas</h2>
          <p className="text-muted-foreground">
            Registre las ventas de productos a clientes
          </p>
        </div>
        
        <Dialog open={isAddingSale} onOpenChange={setIsAddingSale}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Venta
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Venta</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Datos del Cliente - 2 columnas */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Datos del Cliente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Nombre del Cliente *</Label>
                    <Input
                      id="customerName"
                      value={currentSale.customerName}
                      onChange={(e) => setCurrentSale(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Nombre completo del cliente"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerDocument">Documento *</Label>
                    <Input
                      id="customerDocument"
                      value={currentSale.customerDocument}
                      onChange={(e) => setCurrentSale(prev => ({ ...prev, customerDocument: e.target.value }))}
                      placeholder="DNI, CUIT o CUIL"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="invoiceType">Tipo de Factura *</Label>
                    <Select 
                      value={currentSale.invoiceType} 
                      onValueChange={(value: 'A' | 'B' | 'C') => setCurrentSale(prev => ({ ...prev, invoiceType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Factura A - Responsable Inscripto</SelectItem>
                        <SelectItem value="B">Factura B - Consumidor Final</SelectItem>
                        <SelectItem value="C">Factura C - Monotributo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      value={currentSale.notes}
                      onChange={(e) => setCurrentSale(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Notas adicionales sobre la venta"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Selección de Productos - 3 columnas */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Productos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Cargando productos...</p>
                    </div>
                  ) : (
                    <div className="border rounded max-h-[500px] overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No hay productos disponibles
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{product.nombre}</div>
                                    {product.descripcion && (
                                      <div className="text-sm text-muted-foreground">
                                        {product.descripcion}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  ${product.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                                    {product.stock}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() => addProductToSale(product)}
                                    disabled={product.stock === 0}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Productos Seleccionados */}
            {selectedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Productos en la Venta</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>
                            <div className="font-medium">{item.productName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>${item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="font-semibold">${item.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeProductFromSale(item.productId)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 space-y-2 text-right">
                    <div className="flex justify-between border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingSale(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={completeSale} 
                      className="flex-1"
                      disabled={isSubmitting || selectedProducts.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Completar Venta y Generar Factura
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay ventas registradas</p>
              <p className="text-sm">Utilice el botón "Nueva Venta" para comenzar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Venta</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono text-sm">#{sale.id}</TableCell>
                    <TableCell>
                      {sale.fecha ? new Date(sale.fecha).toLocaleDateString('es-AR') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {sale.usuario ? (
                        <>
                          <div className="font-medium">{sale.usuario.nombre}</div>
                          <div className="text-sm text-muted-foreground">{sale.usuario.correo}</div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Sin usuario</span>
                      )}
                    </TableCell>
                    <TableCell>{sale.usuario?.nombre || 'N/A'}</TableCell>
                    <TableCell>{sale.productos?.length || 0} producto(s)</TableCell>
                    <TableCell className="font-semibold">
                      ${(sale.importe_total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}