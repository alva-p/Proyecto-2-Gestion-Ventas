import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertTriangle, Package, Settings, RefreshCw, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type StockStatus = 'ok' | 'low' | 'critical';

type Product = {
  id: string;
  name: string;
  brand: string;
  line: string;
  currentStock: number;
  threshold: number | null; // null significa que usa el umbral global
  status: StockStatus;
  daysRemaining?: number;
};

type StockSettings = {
  globalThreshold: number;
  criticalPercentage: number; // Porcentaje del umbral para estado crítico
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Pro Max',
    brand: 'TechBrand',
    line: 'Smartphones',
    currentStock: 3,
    threshold: 10,
    status: 'critical',
    daysRemaining: 2
  },
  {
    id: '2',
    name: 'Auriculares Pro',
    brand: 'AudioTech',
    line: 'Auriculares',
    currentStock: 8,
    threshold: null, // Usa umbral global (15)
    status: 'low',
    daysRemaining: 5
  },
  {
    id: '3',
    name: 'Tablet X1',
    brand: 'TechBrand',
    line: 'Tablets',
    currentStock: 25,
    threshold: 20,
    status: 'ok'
  },
  {
    id: '4',
    name: 'Mouse Gaming RGB',
    brand: 'GameTech',
    line: 'Gaming',
    currentStock: 2,
    threshold: 15,
    status: 'critical',
    daysRemaining: 1
  },
  {
    id: '5',
    name: 'Teclado Mecánico',
    brand: 'GameTech',
    line: 'Gaming',
    currentStock: 12,
    threshold: null, // Usa umbral global
    status: 'low',
    daysRemaining: 8
  },
  {
    id: '6',
    name: 'Monitor 4K',
    brand: 'TechBrand',
    line: 'Monitores',
    currentStock: 45,
    threshold: 30,
    status: 'ok'
  }
];

const initialSettings: StockSettings = {
  globalThreshold: 15,
  criticalPercentage: 50 // 50% del umbral = crítico
};

export function StockAlerts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [settings, setSettings] = useState<StockSettings>(initialSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Recalcular estados de stock basado en configuración
  const recalculateStockStatus = () => {
    const updatedProducts = products.map(product => {
      const threshold = product.threshold || settings.globalThreshold;
      const criticalThreshold = Math.floor(threshold * (settings.criticalPercentage / 100));
      
      let status: StockStatus = 'ok';
      if (product.currentStock <= criticalThreshold) {
        status = 'critical';
      } else if (product.currentStock <= threshold) {
        status = 'low';
      }

      return { ...product, status };
    });

    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, statusFilter);
  };

  const handleStatusFilter = (status: StockStatus | 'all') => {
    setStatusFilter(status);
    applyFilters(searchTerm, status);
  };

  const applyFilters = (term: string, status: StockStatus | 'all') => {
    let filtered = products;

    if (term) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.brand.toLowerCase().includes(term.toLowerCase()) ||
        product.line.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(product => product.status === status);
    }

    setFilteredProducts(filtered);
  };

  const handleSettingsUpdate = () => {
    recalculateStockStatus();
    setIsSettingsOpen(false);
  };

  const getStatusBadge = (status: StockStatus) => {
    const variants = {
      ok: 'default',
      low: 'secondary',
      critical: 'destructive'
    } as const;

    const labels = {
      ok: 'OK',
      low: 'Bajo',
      critical: 'Crítico'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getStatusIcon = (status: StockStatus) => {
    if (status === 'critical') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    if (status === 'low') {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    return null;
  };

  const getAlertCounts = () => {
    const critical = products.filter(p => p.status === 'critical').length;
    const low = products.filter(p => p.status === 'low').length;
    const ok = products.filter(p => p.status === 'ok').length;
    return { critical, low, ok };
  };

  const alertCounts = getAlertCounts();

  return (
    <div className="space-y-6">
      {/* Panel de alertas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Stock Crítico
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {alertCounts.critical}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Productos necesitan reposición urgente
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Stock Bajo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {alertCounts.low}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Productos por debajo del umbral
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Stock OK
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {alertCounts.ok}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Productos con stock adecuado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuración y filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Alertas de Stock</span>
              </CardTitle>
              <CardDescription>
                Monitoreo y gestión de niveles de inventario
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={recalculateStockStatus} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuración de Alertas</DialogTitle>
                    <DialogDescription>
                      Ajusta los umbrales para las alertas de stock
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="globalThreshold">Umbral Global por Defecto</Label>
                      <Input
                        id="globalThreshold"
                        type="number"
                        min="1"
                        value={settings.globalThreshold}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          globalThreshold: parseInt(e.target.value) || 0 
                        }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        Umbral aplicado a productos sin configuración específica
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="criticalPercentage">Porcentaje para Estado Crítico (%)</Label>
                      <Input
                        id="criticalPercentage"
                        type="number"
                        min="1"
                        max="99"
                        value={settings.criticalPercentage}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          criticalPercentage: parseInt(e.target.value) || 50 
                        }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        Cuando el stock sea ≤ {settings.criticalPercentage}% del umbral = Crítico
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSettingsUpdate}>
                        Aplicar Cambios
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
            <div className="w-40">
              <Select value={statusFilter} onValueChange={(value: StockStatus | 'all') => handleStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="low">Bajo</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Marca / Línea</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Umbral</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Días Restantes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const threshold = product.threshold || settings.globalThreshold;
                  const isCustomThreshold = product.threshold !== null;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(product.status)}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.brand}</div>
                          <div className="text-sm text-muted-foreground">{product.line}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={product.status === 'critical' ? 'text-red-600 font-semibold' : 
                                       product.status === 'low' ? 'text-yellow-600 font-semibold' : ''}>
                          {product.currentStock} unidades
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span>{threshold} unidades</span>
                          {isCustomThreshold ? (
                            <Badge variant="outline" className="ml-1 text-xs">Personalizado</Badge>
                          ) : (
                            <Badge variant="secondary" className="ml-1 text-xs">Global</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        {product.daysRemaining ? (
                          <span className={product.daysRemaining <= 3 ? 'text-red-600 font-semibold' : 
                                         product.daysRemaining <= 7 ? 'text-yellow-600' : ''}>
                            ~{product.daysRemaining} días
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron productos con los filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}