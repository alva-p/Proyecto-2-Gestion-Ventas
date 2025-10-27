import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Search, ShoppingCart, Grid, List } from 'lucide-react';
import API from '../../index'; // 👈 usa tu instancia de axios

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  line: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
};

export function ProductCatalog() {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lineFilter, setLineFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Productos desde el backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get('/producto'); // 👉 GET al backend
        const data = res.data;

        // Adaptamos los datos del backend al formato del front
        const adaptados: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.nombre,
          description: p.descripcion,
          price: parseFloat(p.precio),
          brand: p.linea?.marca?.nombre ?? 'Sin marca',
          line: p.linea?.nombre ?? 'Sin línea',
          image: 'https://via.placeholder.com/400x300?text=Producto', // opcional
          rating: 4.5, // puedes quitar o reemplazar si luego agregas reviews reales
          reviews: 0,
          inStock: p.stock > 0,
          featured: p.estado,
        }));

        setProducts(adaptados);
        setFilteredProducts(adaptados);

        // Generamos listas únicas de líneas y marcas
        setLines(Array.from(new Set(adaptados.map(p => p.line))));
        setBrands(Array.from(new Set(adaptados.map(p => p.brand))));
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtro y ordenamiento
  const filterProducts = (term: string, line: string, brand: string, sort: string) => {
    let filtered = [...products];

    if (term) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase()) ||
        product.brand.toLowerCase().includes(term.toLowerCase()) ||
        product.line.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (line !== 'all') filtered = filtered.filter(product => product.line === line);
    if (brand !== 'all') filtered = filtered.filter(product => product.brand === brand);

    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProducts(term, lineFilter, brandFilter, sortBy);
  };

  const handleLineFilter = (line: string) => {
    setLineFilter(line);
    filterProducts(searchTerm, line, brandFilter, sortBy);
  };

  const handleBrandFilter = (brand: string) => {
    setBrandFilter(brand);
    filterProducts(searchTerm, lineFilter, brand, sortBy);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    filterProducts(searchTerm, lineFilter, brandFilter, sort);
  };

  // Helpers
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className={`${!product.inStock ? 'opacity-75' : ''} hover:shadow-lg transition-shadow`}>
      <CardHeader className="p-0">
        <div className="relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              Destacado
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive">Agotado</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <Badge variant="outline">{product.brand} → {product.line}</Badge>
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  //Render final
  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Cargando productos...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Catálogo de Productos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Explora nuestra selección de productos reales desde la base de datos</CardDescription>
        </CardHeader>

        <CardContent>
          {/*Filtros */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={lineFilter} onValueChange={handleLineFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Línea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las líneas</SelectItem>
                {lines.map(line => <SelectItem key={line} value={line}>{line}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={brandFilter} onValueChange={handleBrandFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map(brand => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                <SelectItem value="rating">Mejor valorados</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/*Productos */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron productos que coincidan con los filtros.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setLineFilter('all');
                  setBrandFilter('all');
                  setSortBy('featured');
                  setFilteredProducts(products);
                }}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
