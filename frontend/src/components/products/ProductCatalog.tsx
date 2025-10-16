import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Search, ShoppingCart, Star, Filter, Grid, List } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand: string;
  line: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Pro Max',
    description: 'Último modelo con tecnología avanzada y cámara profesional de alta resolución.',
    price: 899990,
    originalPrice: 999990,
    brand: 'TechBrand',
    line: 'Pro',
    image: 'https://images.unsplash.com/photo-1640948612546-3b9e29c23e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMG1vZGVybnxlbnwxfHx8fDE3NTkyNTEzODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviews: 324,
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Auriculares Inalámbricos Pro',
    description: 'Auriculares con cancelación de ruido activa y calidad de audio superior.',
    price: 199990,
    brand: 'AudioTech',
    line: 'Premium',
    image: 'https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwd2lyZWxlc3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTMzNTMyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviews: 156,
    inStock: true,
    featured: false
  },
  {
    id: '3',
    name: 'Laptop Gaming Ultra',
    description: 'Laptop de alto rendimiento diseñada para gaming y trabajo profesional.',
    price: 1299990,
    originalPrice: 1499990,
    brand: 'GameTech',
    line: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606625000171-fa7d471da28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGdhbWluZ3xlbnwxfHx8fDE3NTkzNDgxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviews: 89,
    inStock: false,
    featured: true
  },
  {
    id: '4',
    name: 'Monitor 4K Ultrawide',
    description: 'Monitor profesional de 32 pulgadas con resolución 4K y tecnología HDR.',
    price: 549990,
    brand: 'TechBrand',
    line: 'Professional',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3IlMjA0a3xlbnwxfHx8fDE3MzMxNjI4MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviews: 142,
    inStock: true,
    featured: false
  },
  {
    id: '5',
    name: 'Teclado Mecánico RGB',
    description: 'Teclado mecánico con switches premium y retroiluminación RGB personalizable.',
    price: 89990,
    brand: 'GameTech',
    line: 'Esports',
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXlib2FyZCUyMG1lY2hhbmljYWwlMjByZ2J8ZW58MXx8fHwxNzMzMTYyODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.5,
    reviews: 98,
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Parlantes Bluetooth Portátiles',
    description: 'Parlantes compactos con sonido premium y resistencia al agua IPX7.',
    price: 129990,
    originalPrice: 149990,
    brand: 'AudioTech',
    line: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVha2VyJTIwYmx1ZXRvb3RoJTIwcG9ydGFibGV8ZW58MXx8fHwxNzMzMTYyODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.4,
    reviews: 201,
    inStock: true,
    featured: true
  }
];

export function ProductCatalog() {
  const [products] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [lineFilter, setLineFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const brands = Array.from(new Set(products.map(p => p.brand)));
  const lines = Array.from(new Set(products.map(p => p.line)));

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

  const filterProducts = (term: string, line: string, brand: string, sort: string) => {
    let filtered = products;

    if (term) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase()) ||
        product.brand.toLowerCase().includes(term.toLowerCase()) ||
        product.line.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (line !== 'all') {
      filtered = filtered.filter(product => product.line === line);
    }

    if (brand !== 'all') {
      filtered = filtered.filter(product => product.brand === brand);
    }

    // Ordenar
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
          {product.originalPrice && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Oferta
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
          <div className="flex items-start justify-between">
            <h3 className="font-medium line-clamp-2">{product.name}</h3>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{product.brand} → {product.line}</Badge>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through mr-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
            </div>
            
            <Button 
              size="sm" 
              disabled={!product.inStock}
              className="flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{product.inStock ? 'Añadir' : 'Agotado'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Explora nuestra selección de productos de alta calidad
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {lines.map(line => (
                  <SelectItem key={line} value={line}>{line}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={brandFilter} onValueChange={handleBrandFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
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