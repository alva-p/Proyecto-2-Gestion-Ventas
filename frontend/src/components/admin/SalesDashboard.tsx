import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, DollarSign, ShoppingCart, Download, Calendar, BarChart3, LineChart as LineChartIcon } from 'lucide-react';

type SalesData = {
  period: string;
  totalAmount: number;
  totalUnits: number;
  topProducts: Array<{
    id: string;
    name: string;
    brand: string;
    units: number;
    amount: number;
    percentage: number;
  }>;
  topBrands: Array<{
    name: string;
    units: number;
    amount: number;
    percentage: number;
  }>;
  dailySales: Array<{
    date: string;
    amount: number;
    units: number;
  }>;
};

type DateFilter = 'today' | 'week' | 'month' | 'custom';
type ChartType = 'bar' | 'line';
type GroupBy = 'product' | 'brand';

// Datos mock para ventas
const mockSalesData: Record<DateFilter, SalesData> = {
  today: {
    period: 'Hoy',
    totalAmount: 450000,
    totalUnits: 12,
    topProducts: [
      { id: '1', name: 'Smartphone Pro Max', brand: 'TechBrand', units: 3, amount: 270000, percentage: 60 },
      { id: '2', name: 'Auriculares Pro', brand: 'AudioTech', units: 5, amount: 100000, percentage: 22 },
      { id: '3', name: 'Tablet X1', brand: 'TechBrand', units: 2, amount: 80000, percentage: 18 }
    ],
    topBrands: [
      { name: 'TechBrand', units: 5, amount: 350000, percentage: 78 },
      { name: 'AudioTech', units: 5, amount: 100000, percentage: 22 },
      { name: 'GameTech', units: 2, amount: 0, percentage: 0 }
    ],
    dailySales: [
      { date: '2024-10-01', amount: 450000, units: 12 }
    ]
  },
  week: {
    period: 'Esta semana',
    totalAmount: 3200000,
    totalUnits: 89,
    topProducts: [
      { id: '1', name: 'Smartphone Pro Max', brand: 'TechBrand', units: 25, amount: 2250000, percentage: 70 },
      { id: '2', name: 'Auriculares Pro', brand: 'AudioTech', units: 35, amount: 700000, percentage: 22 },
      { id: '3', name: 'Tablet X1', brand: 'TechBrand', units: 15, amount: 150000, percentage: 5 },
      { id: '4', name: 'Mouse Gaming', brand: 'GameTech', units: 14, amount: 100000, percentage: 3 }
    ],
    topBrands: [
      { name: 'TechBrand', units: 40, amount: 2400000, percentage: 75 },
      { name: 'AudioTech', units: 35, amount: 700000, percentage: 22 },
      { name: 'GameTech', units: 14, amount: 100000, percentage: 3 }
    ],
    dailySales: [
      { date: '2024-09-25', amount: 320000, units: 8 },
      { date: '2024-09-26', amount: 480000, units: 12 },
      { date: '2024-09-27', amount: 650000, units: 18 },
      { date: '2024-09-28', amount: 420000, units: 15 },
      { date: '2024-09-29', amount: 580000, units: 16 },
      { date: '2024-09-30', amount: 300000, units: 8 },
      { date: '2024-10-01', amount: 450000, units: 12 }
    ]
  },
  month: {
    period: 'Este mes',
    totalAmount: 12500000,
    totalUnits: 320,
    topProducts: [
      { id: '1', name: 'Smartphone Pro Max', brand: 'TechBrand', units: 95, amount: 8550000, percentage: 68 },
      { id: '2', name: 'Auriculares Pro', brand: 'AudioTech', units: 125, amount: 2500000, percentage: 20 },
      { id: '3', name: 'Tablet X1', brand: 'TechBrand', units: 60, amount: 750000, percentage: 6 },
      { id: '4', name: 'Mouse Gaming', brand: 'GameTech', units: 40, amount: 400000, percentage: 3 }
    ],
    topBrands: [
      { name: 'TechBrand', units: 155, amount: 9300000, percentage: 74 },
      { name: 'AudioTech', units: 125, amount: 2500000, percentage: 20 },
      { name: 'GameTech', units: 40, amount: 700000, percentage: 6 }
    ],
    dailySales: [
      { date: 'Sem 1', amount: 2800000, units: 75 },
      { date: 'Sem 2', amount: 3200000, units: 85 },
      { date: 'Sem 3', amount: 3300000, units: 88 },
      { date: 'Sem 4', amount: 3200000, units: 72 }
    ]
  },
  custom: {
    period: 'Período personalizado',
    totalAmount: 0,
    totalUnits: 0,
    topProducts: [],
    topBrands: [],
    dailySales: []
  }
};

const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export function SalesDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<DateFilter>('month');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [groupBy, setGroupBy] = useState<GroupBy>('product');

  const currentData = mockSalesData[selectedPeriod];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const prepareChartData = () => {
    if (groupBy === 'product') {
      return currentData.topProducts.map((product, index) => ({
        name: product.name,
        amount: product.amount,
        units: product.units,
        color: chartColors[index % chartColors.length]
      }));
    } else {
      return currentData.topBrands.map((brand, index) => ({
        name: brand.name,
        amount: brand.amount,
        units: brand.units,
        color: chartColors[index % chartColors.length]
      }));
    }
  };

  const handleDownloadChart = () => {
    // Simulación de descarga
    alert('Descargando gráfico como PNG...');
  };

  const StatCard = ({ title, value, icon: Icon, description }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Dashboard de Ventas</span>
          </CardTitle>
          <CardDescription>
            Métricas y análisis de ventas por producto y marca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Período</label>
              <Select value={selectedPeriod} onValueChange={(value: DateFilter) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo de gráfico</label>
              <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Barras</SelectItem>
                  <SelectItem value="line">Líneas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Agrupar por</label>
              <Select value={groupBy} onValueChange={(value: GroupBy) => setGroupBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Producto</SelectItem>
                  <SelectItem value="brand">Marca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleDownloadChart} variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Descargar PNG</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vendido"
          value={formatCurrency(currentData.totalAmount)}
          icon={DollarSign}
          description={`Período: ${currentData.period}`}
        />
        <StatCard
          title="Unidades Vendidas"
          value={currentData.totalUnits.toLocaleString()}
          icon={ShoppingCart}
          description={`Período: ${currentData.period}`}
        />
        <StatCard
          title="Top Producto"
          value={currentData.topProducts[0]?.name || 'N/A'}
          icon={Package}
          description={currentData.topProducts[0] ? `${currentData.topProducts[0].units} unidades` : ''}
        />
        <StatCard
          title="Top Marca"
          value={currentData.topBrands[0]?.name || 'N/A'}
          icon={TrendingUp}
          description={currentData.topBrands[0] ? `${formatCurrency(currentData.topBrands[0].amount)}` : ''}
        />
      </div>

      {/* Gráfico principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {chartType === 'bar' ? <BarChart3 className="w-5 h-5" /> : <LineChartIcon className="w-5 h-5" />}
            <span>Ventas por {groupBy === 'product' ? 'Producto' : 'Marca'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentData.totalAmount === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay ventas en el período seleccionado</p>
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'amount' ? formatCurrency(Number(value)) : value,
                        name === 'amount' ? 'Importe' : 'Unidades'
                      ]}
                      labelStyle={{ color: '#000' }}
                    />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" name="Importe" />
                  </BarChart>
                ) : (
                  <LineChart data={currentData.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(Number(value)), 'Importe']}
                      labelStyle={{ color: '#000' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      name="Importe"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Productos</CardTitle>
          </CardHeader>
          <CardContent>
            {currentData.topProducts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay datos de productos</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Unidades</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>% Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.topProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.brand}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.units}</TableCell>
                      <TableCell>{formatCurrency(product.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          {product.percentage}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Marcas</CardTitle>
          </CardHeader>
          <CardContent>
            {currentData.topBrands.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay datos de marcas</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca</TableHead>
                    <TableHead>Unidades</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>% Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.topBrands.map((brand, index) => (
                    <TableRow key={brand.name}>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell>{brand.units}</TableCell>
                      <TableCell>{formatCurrency(brand.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          {brand.percentage}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}