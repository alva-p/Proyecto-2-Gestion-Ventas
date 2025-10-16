import { useState } from 'react';
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
  Calendar, 
  DollarSign, 
  User, 
  FileText,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  brand: string;
  line: string;
  supplier: string;
  price: number;
  stock: number;
  code: string;
};

type SaleItem = {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type Sale = {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
};

// Mock data para productos
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy Pro',
    brand: 'Samsung',
    line: 'Galaxy',
    supplier: 'Distribuidora Tech',
    price: 299999,
    stock: 15,
    code: 'SAM001'
  },
  {
    id: '2',
    name: 'iPhone 15',
    brand: 'Apple',
    line: 'iPhone',
    supplier: 'Tech Supply',
    price: 899999,
    stock: 8,
    code: 'APP002'
  },
  {
    id: '3',
    name: 'Laptop ThinkPad',
    brand: 'Lenovo',
    line: 'ThinkPad',
    supplier: 'Computech',
    price: 549999,
    stock: 12,
    code: 'LEN003'
  }
];

export function SalesRegistration() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isAddingSale, setIsAddingSale] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSale, setCurrentSale] = useState<Partial<Sale>>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentMethod: '',
    notes: ''
  });

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProductToSale = (product: Product) => {
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
        productName: product.name,
        productCode: product.code,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      };
      setSelectedProducts(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = mockProducts.find(p => p.id === productId);
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

  const removeProductFromSale = (productId: string) => {
    setSelectedProducts(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotals = () => {
    const total = selectedProducts.reduce((sum, item) => sum + item.total, 0);
    return { total };
  };

  const completeSale = () => {
    if (!currentSale.customerName || selectedProducts.length === 0) {
      toast.error('Complete los datos del cliente y agregue productos');
      return;
    }

    const { total } = calculateTotals();
    
    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      customerName: currentSale.customerName!,
      customerEmail: currentSale.customerEmail || '',
      customerPhone: currentSale.customerPhone || '',
      items: [...selectedProducts],
      total,
      paymentMethod: currentSale.paymentMethod || 'efectivo',
      status: 'completed',
      notes: currentSale.notes || ''
    };

    setSales(prev => [newSale, ...prev]);
    
    // Reset form
    setCurrentSale({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      paymentMethod: '',
      notes: ''
    });
    setSelectedProducts([]);
    setIsAddingSale(false);
    
    toast.success('Venta registrada exitosamente');
  };

  const { total } = calculateTotals();

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
          
          <DialogContent className="max-w-[98vw] max-h-[98vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Venta</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Datos del Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Datos del Cliente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Nombre *</Label>
                    <Input
                      id="customerName"
                      value={currentSale.customerName}
                      onChange={(e) => setCurrentSale(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Nombre completo del cliente"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={currentSale.customerEmail}
                      onChange={(e) => setCurrentSale(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="Email del cliente"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Teléfono</Label>
                    <Input
                      id="customerPhone"
                      value={currentSale.customerPhone}
                      onChange={(e) => setCurrentSale(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentMethod">Método de Pago</Label>
                    <Select 
                      value={currentSale.paymentMethod} 
                      onValueChange={(value: string) => setCurrentSale(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                        <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
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

              {/* Selección de Productos */}
              <Card>
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
                  
                  <div className="border rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {product.brand} - {product.code}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${product.price.toLocaleString('es-AR')}</TableCell>
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
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-muted-foreground">{item.productCode}</div>
                            </div>
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
                          <TableCell>${item.unitPrice.toLocaleString('es-AR')}</TableCell>
                          <TableCell>${item.total.toLocaleString('es-AR')}</TableCell>
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
                    <Button variant="outline" onClick={() => setIsAddingSale(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={completeSale} className="flex-1">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Completar Venta
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
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString('es-AR')}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sale.customerName}</div>
                        {sale.customerEmail && (
                          <div className="text-sm text-muted-foreground">{sale.customerEmail}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sale.items.length} producto(s)</TableCell>
                    <TableCell>${sale.total.toLocaleString('es-AR')}</TableCell>
                    <TableCell className="capitalize">{sale.paymentMethod.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge variant={
                        sale.status === 'completed' ? 'default' :
                        sale.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {sale.status === 'completed' ? 'Completada' :
                         sale.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
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