import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Upload,
  Search,
  Eye,
  X,
  Building2,
  Star,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Grid3X3,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

type ProductImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
};

type ProductSupplier = {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  lineId: string;
  lineName: string;
  price: number;
  stock: number;
  images: ProductImage[];
  suppliers: ProductSupplier[];
  status: "active" | "inactive" | "draft";
  createdAt: string;
};

type Brand = {
  id: string;
  name: string;
};

type BrandLine = {
  id: string;
  name: string;
  brandId: string;
};

type Supplier = {
  id: string;
  name: string;
  email: string;
};

// Datos mock
const mockBrands: Brand[] = [
  { id: "1", name: "TechBrand" },
  { id: "2", name: "AudioTech" },
  { id: "3", name: "GameTech" },
];

const mockBrandLines: BrandLine[] = [
  { id: "1", name: "Pro", brandId: "1" },
  { id: "2", name: "Professional", brandId: "1" },
  { id: "3", name: "Premium", brandId: "2" },
  { id: "4", name: "Outdoor", brandId: "2" },
  { id: "5", name: "Gaming", brandId: "3" },
  { id: "6", name: "Esports", brandId: "3" },
];

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "TechSource Argentina",
    email: "contacto@techsource.com.ar",
  },
  {
    id: "2",
    name: "Audio Equipment SA",
    email: "ventas@audioequip.com",
  },
  {
    id: "3",
    name: "Digital World SRL",
    email: "info@digitalworld.ar",
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Pro Max",
    description:
      "Último modelo con tecnología avanzada y cámara profesional",
    brandId: "1",
    brandName: "TechBrand",
    lineId: "1",
    lineName: "Pro",
    price: 899990,
    stock: 25,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1640948612546-3b9e29c23e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMG1vZGVybnxlbnwxfHx8fDE3NTkyNTEzODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Smartphone frontal",
        isPrimary: true,
        order: 1,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300",
        alt: "Smartphone trasero",
        isPrimary: false,
        order: 2,
      },
    ],
    suppliers: [
      {
        id: "1",
        supplierId: "1",
        supplierName: "TechSource Argentina",
        supplierCode: "TSA-SP001",
      },
      {
        id: "2",
        supplierId: "3",
        supplierName: "Digital World SRL",
        supplierCode: "DW-SMART-001",
      },
    ],
    status: "active",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    name: "Auriculares Inalámbricos Pro",
    description:
      "Cancelación de ruido activa y calidad de audio excepcional",
    brandId: "2",
    brandName: "AudioTech",
    lineId: "3",
    lineName: "Premium",
    price: 199990,
    stock: 50,
    images: [
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwd2lyZWxlc3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTMzNTMyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Auriculares principales",
        isPrimary: true,
        order: 1,
      },
    ],
    suppliers: [
      {
        id: "3",
        supplierId: "2",
        supplierName: "Audio Equipment SA",
        supplierCode: "AES-AUR-PRO",
      },
    ],
    status: "active",
    createdAt: "2024-12-02",
  },
  {
    id: "3",
    name: "Monitor 4K Ultrawide",
    description:
      "Monitor profesional de 32 pulgadas con resolución 4K y tecnología HDR",
    brandId: "1",
    brandName: "TechBrand",
    lineId: "2",
    lineName: "Professional",
    price: 549990,
    stock: 15,
    images: [
      {
        id: "4",
        url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3IlMjA0a3xlbnwxfHx8fDE3MzMxNjI4MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Monitor principal",
        isPrimary: true,
        order: 1,
      },
    ],
    suppliers: [
      {
        id: "4",
        supplierId: "1",
        supplierName: "TechSource Argentina",
        supplierCode: "TSA-MON-4K",
      },
    ],
    status: "active",
    createdAt: "2024-12-03",
  },
  {
    id: "4",
    name: "Teclado Mecánico RGB",
    description:
      "Teclado mecánico con switches premium y retroiluminación RGB personalizable",
    brandId: "3",
    brandName: "GameTech",
    lineId: "6",
    lineName: "Esports",
    price: 89990,
    stock: 30,
    images: [
      {
        id: "5",
        url: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXlib2FyZCUyMG1lY2hhbmljYWwlMjByZ2J8ZW58MXx8fHwxNzMzMTYyODAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Teclado principal",
        isPrimary: true,
        order: 1,
      },
    ],
    suppliers: [
      {
        id: "5",
        supplierId: "3",
        supplierName: "Digital World SRL",
        supplierCode: "DW-GAMING-KB",
      },
    ],
    status: "active",
    createdAt: "2024-12-04",
  },
];

// Componente ProductForm separado para evitar re-renders
type ProductFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  newProduct: {
    name: string;
    description: string;
    brandId: string;
    lineId: string;
    price: string;
    stock: string;
    status: "active" | "inactive" | "draft";
  };
  setNewProduct: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    brandId: string;
    lineId: string;
    price: string;
    stock: string;
    status: "active" | "inactive" | "draft";
  }>>;
  productImages: ProductImage[];
  productSuppliers: ProductSupplier[];
  newImageUrl: string;
  setNewImageUrl: React.Dispatch<React.SetStateAction<string>>;
  uploadedImageFile: File | null;
  setUploadedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageValidationError: string;
  setImageValidationError: React.Dispatch<React.SetStateAction<string>>;
  imageFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearUploadedImageFile: () => void;
  newSupplierData: { supplierId: string; supplierCode: string };
  setNewSupplierData: React.Dispatch<React.SetStateAction<{ supplierId: string; supplierCode: string }>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleLineChange: (lineId: string) => void;
  getAvailableBrands: (lineId: string) => Brand[];
  addImage: () => void;
  removeImage: (imageId: string) => void;
  setPrimaryImage: (imageId: string) => void;
  moveImage: (imageId: string, direction: "up" | "down") => void;
  addSupplier: () => void;
  removeSupplier: (supplierId: string) => void;
  getStatusBadge: (status: string) => React.ReactElement;
  formatCurrency: (amount: number) => string;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  resetForm: () => void;
};

const ProductFormComponent = React.memo<ProductFormProps>(({
  onSubmit,
  isEdit = false,
  newProduct,
  setNewProduct,
  productImages,
  productSuppliers,
  newImageUrl,
  setNewImageUrl,
  uploadedImageFile,
  setUploadedImageFile,
  imageValidationError,
  setImageValidationError,
  imageFileInputRef,
  handleImageFileUpload,
  clearUploadedImageFile,
  newSupplierData,
  setNewSupplierData,
  activeTab,
  setActiveTab,
  handleLineChange,
  getAvailableBrands,
  addImage,
  removeImage,
  setPrimaryImage,
  moveImage,
  addSupplier,
  removeSupplier,
  getStatusBadge,
  formatCurrency,
  setIsCreateModalOpen,
  setEditingProduct,
  resetForm,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Básico</TabsTrigger>
        <TabsTrigger value="images">Imágenes</TabsTrigger>
        <TabsTrigger value="suppliers">
          Proveedores
        </TabsTrigger>
        <TabsTrigger value="review">Revisar</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre del Producto *
            </Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => {
                const value = e.target.value;
                setNewProduct((prev) => ({
                  ...prev,
                  name: value,
                }));
              }}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="line">Línea *</Label>
            <Select
              value={newProduct.lineId}
              onValueChange={handleLineChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar línea" />
              </SelectTrigger>
              <SelectContent>
                {mockBrandLines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Marca *</Label>
            <Select
              value={newProduct.brandId}
              onValueChange={(value: string) =>
                setNewProduct((prev) => ({
                  ...prev,
                  brandId: value,
                }))
              }
              disabled={!newProduct.lineId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    newProduct.lineId
                      ? "Seleccionar marca"
                      : "Primero seleccione una línea"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {getAvailableBrands(newProduct.lineId).map(
                  (brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={newProduct.price}
              onChange={(e) => {
                const value = e.target.value;
                setNewProduct((prev) => ({
                  ...prev,
                  price: value,
                }));
              }}
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
              onChange={(e) => {
                const value = e.target.value;
                setNewProduct((prev) => ({
                  ...prev,
                  stock: value,
                }));
              }}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={newProduct.description}
            onChange={(e) => {
              const value = e.target.value;
              setNewProduct((prev) => ({
                ...prev,
                description: value,
              }));
            }}
            placeholder="Descripción detallada del producto"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={newProduct.status}
            onValueChange={(
              value: "active" | "inactive" | "draft",
            ) =>
              setNewProduct((prev) => ({
                ...prev,
                status: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">
                Inactivo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="images" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">
              Gestión de Imágenes
            </h3>
          </div>

          {imageValidationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              <div className="flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>{imageValidationError}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Agregar nueva imagen</Label>
            
            {/* Opción 1: Subir archivo local */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageFileUpload}
                  className="hidden"
                  id="product-image-upload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => imageFileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadedImageFile ? 'Cambiar Archivo' : 'Subir Imagen Local'}
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

            <div className="flex space-x-2">
              <Input
                value={uploadedImageFile ? '' : newImageUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewImageUrl(value);
                  setUploadedImageFile(null);
                  setImageValidationError('');
                }}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="flex-1"
                disabled={!!uploadedImageFile}
              />
              <Button type="button" onClick={addImage} disabled={!newImageUrl.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

            {/* Vista previa de la imagen */}
            {newImageUrl && (
              <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Vista previa:</p>
                <ImageWithFallback
                  src={newImageUrl}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded border bg-white"
                />
              </div>
            )}
          </div>

          {productImages.length > 0 && (
            <div className="space-y-2">
              <Label>Imágenes del producto ({productImages.length})</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded"
                      />
                      {image.isPrimary && (
                        <Badge
                          className="absolute top-2 left-2"
                          variant="default"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Principal
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            moveImage(image.id, "up")
                          }
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            moveImage(image.id, "down")
                          }
                          disabled={
                            index === productImages.length - 1
                          }
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        {!image.isPrimary && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPrimaryImage(image.id)
                            }
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="suppliers" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <h3 className="text-lg font-semibold">
              Proveedores
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Proveedor</Label>
              <Select
                value={newSupplierData.supplierId}
                onValueChange={(value: string) =>
                  setNewSupplierData((prev) => ({
                    ...prev,
                    supplierId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Código del Proveedor</Label>
              <div className="flex space-x-2">
                <Input
                  value={newSupplierData.supplierCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewSupplierData((prev) => ({
                      ...prev,
                      supplierCode: value,
                    }));
                  }}
                  placeholder="Código único del proveedor"
                  className="flex-1"
                />
                <Button type="button" onClick={addSupplier}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {productSuppliers.length > 0 && (
            <div className="space-y-2">
              <Label>Proveedores asociados</Label>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          {supplier.supplierName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {supplier.supplierCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeSupplier(supplier.id)
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="review" className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Revisar información del producto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nombre:</strong>{" "}
              {newProduct.name || "No especificado"}
            </div>
            <div>
              <strong>Línea:</strong>{" "}
              {mockBrandLines.find(
                (l) => l.id === newProduct.lineId,
              )?.name || "No especificada"}
            </div>
            <div>
              <strong>Marca:</strong>{" "}
              {mockBrands.find(
                (b) => b.id === newProduct.brandId,
              )?.name || "No especificada"}
            </div>
            <div>
              <strong>Precio:</strong>{" "}
              {newProduct.price
                ? formatCurrency(parseFloat(newProduct.price))
                : "No especificado"}
            </div>
            <div>
              <strong>Stock:</strong>{" "}
              {newProduct.stock || "0"} unidades
            </div>
            <div>
              <strong>Estado:</strong>{" "}
              {getStatusBadge(newProduct.status)}
            </div>
            <div>
              <strong>Imágenes:</strong>{" "}
              {productImages.length} imagen(es)
            </div>
            <div>
              <strong>Proveedores:</strong>{" "}
              {productSuppliers.length} proveedor(es)
            </div>
          </div>

          {newProduct.description && (
            <div>
              <strong>Descripción:</strong>
              <br />
              <p className="text-sm text-muted-foreground mt-1">
                {newProduct.description}
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>

    <div className="flex justify-end space-x-2 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsCreateModalOpen(false);
          setEditingProduct(null);
          resetForm();
        }}
      >
        Cancelar
      </Button>
      <Button type="submit">
        {isEdit ? "Actualizar Producto" : "Crear Producto"}
      </Button>
    </div>
  </form>
));

ProductFormComponent.displayName = "ProductForm";

export function EnhancedProductManagement() {
  const [products, setProducts] =
    useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    brandId: "",
    lineId: "",
    price: "",
    stock: "",
    status: "draft" as "active" | "inactive" | "draft",
  });

  const [productImages, setProductImages] = useState<
    ProductImage[]
  >([]);
  const [productSuppliers, setProductSuppliers] = useState<
    ProductSupplier[]
  >([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imageValidationError, setImageValidationError] = useState<string>('');
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [newSupplierData, setNewSupplierData] = useState({
    supplierId: "",
    supplierCode: "",
  });

  const getAvailableBrands = (lineId: string) => {
    const line = mockBrandLines.find((l) => l.id === lineId);
    if (!line) return [];
    return mockBrands.filter((brand) => brand.id === line.brandId);
  };

  const handleLineChange = (lineId: string) => {
    const line = mockBrandLines.find((l) => l.id === lineId);
    setNewProduct((prev) => ({
      ...prev,
      lineId,
      brandId: line ? line.brandId : "",
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        product.brandName
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        product.lineName
          .toLowerCase()
          .includes(term.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageValidationError('Solo se permiten archivos .jpg, .jpeg o .png');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageValidationError('El archivo no debe superar los 5MB');
      return;
    }

    setImageValidationError('');
    setUploadedImageFile(file);

    // Convertir a base64 para preview y almacenamiento
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
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;

    const newImage: ProductImage = {
      id: Date.now().toString(),
      url: newImageUrl,
      alt: `Imagen ${productImages.length + 1}`,
      isPrimary: productImages.length === 0,
      order: productImages.length + 1,
    };

    setProductImages([...productImages, newImage]);
    setNewImageUrl("");
    clearUploadedImageFile();
  };

  const removeImage = (imageId: string) => {
    const updatedImages = productImages.filter(
      (img) => img.id !== imageId,
    );
    // Si eliminamos la imagen principal, hacer la primera como principal
    if (
      updatedImages.length > 0 &&
      !updatedImages.some((img) => img.isPrimary)
    ) {
      updatedImages[0].isPrimary = true;
    }
    setProductImages(updatedImages);
  };

  const setPrimaryImage = (imageId: string) => {
    const updatedImages = productImages.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    setProductImages(updatedImages);
  };

  const moveImage = (
    imageId: string,
    direction: "up" | "down",
  ) => {
    const currentIndex = productImages.findIndex(
      (img) => img.id === imageId,
    );
    if (currentIndex === -1) return;

    const newIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= productImages.length)
      return;

    const updatedImages = [...productImages];
    [updatedImages[currentIndex], updatedImages[newIndex]] = [
      updatedImages[newIndex],
      updatedImages[currentIndex],
    ];

    // Actualizar orden
    updatedImages.forEach((img, index) => {
      img.order = index + 1;
    });

    setProductImages(updatedImages);
  };

  const addSupplier = () => {
    if (
      !newSupplierData.supplierId ||
      !newSupplierData.supplierCode.trim()
    ) {
      alert(
        "Debe seleccionar un proveedor y proporcionar un código",
      );
      return;
    }

    // Verificar que no exista ya este proveedor
    const existingSupplier = productSuppliers.find(
      (ps) => ps.supplierId === newSupplierData.supplierId,
    );
    if (existingSupplier) {
      alert("Este proveedor ya está asociado al producto");
      return;
    }

    // Verificar que el código no se repita para el mismo proveedor
    const codeExists = productSuppliers.some(
      (ps) =>
        ps.supplierId === newSupplierData.supplierId &&
        ps.supplierCode === newSupplierData.supplierCode,
    );
    if (codeExists) {
      alert(
        "Ya existe un producto con este código para este proveedor",
      );
      return;
    }

    const supplier = mockSuppliers.find(
      (s) => s.id === newSupplierData.supplierId,
    );
    if (!supplier) return;

    const newSupplier: ProductSupplier = {
      id: Date.now().toString(),
      supplierId: newSupplierData.supplierId,
      supplierName: supplier.name,
      supplierCode: newSupplierData.supplierCode,
    };

    setProductSuppliers([...productSuppliers, newSupplier]);
    setNewSupplierData({ supplierId: "", supplierCode: "" });
  };

  const removeSupplier = (supplierId: string) => {
    setProductSuppliers(
      productSuppliers.filter((ps) => ps.id !== supplierId),
    );
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      brandId: "",
      lineId: "",
      price: "",
      stock: "",
      status: "draft",
    });
    setProductImages([]);
    setProductSuppliers([]);
    setNewImageUrl("");
    setNewSupplierData({ supplierId: "", supplierCode: "" });
    setActiveTab("basic");
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.lineId) {
      alert("Debe seleccionar una línea para el producto");
      return;
    }

    if (productImages.length === 0) {
      alert("Debe agregar al menos una imagen");
      return;
    }

    const brand = mockBrands.find(
      (b) => b.id === newProduct.brandId,
    );
    const line = mockBrandLines.find(
      (l) => l.id === newProduct.lineId,
    );

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      brandId: newProduct.brandId,
      brandName: brand?.name || "",
      lineId: newProduct.lineId,
      lineName: line?.name || "",
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      images: productImages,
      suppliers: productSuppliers,
      status: newProduct.status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      brandId: product.brandId,
      lineId: product.lineId,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
    });
    setProductImages(product.images);
    setProductSuppliers(product.suppliers);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!newProduct.lineId) {
      alert("Debe seleccionar una línea para el producto");
      return;
    }

    if (productImages.length === 0) {
      alert("Debe tener al menos una imagen");
      return;
    }

    const brand = mockBrands.find(
      (b) => b.id === newProduct.brandId,
    );
    const line = mockBrandLines.find(
      (l) => l.id === newProduct.lineId,
    );

    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id
        ? {
            ...p,
            name: newProduct.name,
            description: newProduct.description,
            brandId: newProduct.brandId,
            brandName: brand?.name || "",
            lineId: newProduct.lineId,
            lineName: line?.name || "",
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            images: productImages,
            suppliers: productSuppliers,
            status: newProduct.status,
          }
        : p,
    );

    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(
      (p) => p.id !== productId,
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      draft: "outline",
    } as const;

    const labels = {
      active: "Activo",
      inactive: "Inactivo",
      draft: "Borrador",
    };

    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
      >
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Gestión Avanzada de Productos</span>
              </CardTitle>
              <CardDescription>
                Administra productos con líneas, imágenes
                múltiples y proveedores
              </CardDescription>
            </div>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </Button>
              </DialogTrigger>
              <DialogContent key="create-product-dialog" className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Crear Nuevo Producto
                  </DialogTitle>
                  <DialogDescription>
                    Completa toda la información del producto
                  </DialogDescription>
                </DialogHeader>
                <ProductFormComponent
                  onSubmit={handleCreateProduct}
                  newProduct={newProduct}
                  setNewProduct={setNewProduct}
                  productImages={productImages}
                  productSuppliers={productSuppliers}
                  newImageUrl={newImageUrl}
                  setNewImageUrl={setNewImageUrl}
                  uploadedImageFile={uploadedImageFile}
                  setUploadedImageFile={setUploadedImageFile}
                  imageValidationError={imageValidationError}
                  setImageValidationError={setImageValidationError}
                  imageFileInputRef={imageFileInputRef}
                  handleImageFileUpload={handleImageFileUpload}
                  clearUploadedImageFile={clearUploadedImageFile}
                  newSupplierData={newSupplierData}
                  setNewSupplierData={setNewSupplierData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  handleLineChange={handleLineChange}
                  getAvailableBrands={getAvailableBrands}
                  addImage={addImage}
                  removeImage={removeImage}
                  setPrimaryImage={setPrimaryImage}
                  moveImage={moveImage}
                  addSupplier={addSupplier}
                  removeSupplier={removeSupplier}
                  getStatusBadge={getStatusBadge}
                  formatCurrency={formatCurrency}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  setEditingProduct={setEditingProduct}
                  resetForm={resetForm}
                />
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
                  <TableHead>Marca / Línea</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Proveedores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const primaryImage =
                    product.images.find(
                      (img) => img.isPrimary,
                    ) || product.images[0];

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {primaryImage && (
                            <div className="relative">
                              <ImageWithFallback
                                src={primaryImage.url}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              {product.images.length > 1 && (
                                <Badge className="absolute -top-1 -right-1 text-xs px-1 h-4">
                                  {product.images.length}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {product.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.description.substring(
                                0,
                                50,
                              )}
                              ...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {product.brandName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.lineName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-500"
                              : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-3 h-3" />
                          <span>
                            {product.suppliers.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Detalles del Producto
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Imágenes */}
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Imágenes
                                  </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {product.images.map(
                                      (image) => (
                                        <div
                                          key={image.id}
                                          className="relative"
                                        >
                                          <ImageWithFallback
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-24 object-cover rounded"
                                          />
                                          {image.isPrimary && (
                                            <Badge className="absolute top-1 left-1 text-xs px-1">
                                              Principal
                                            </Badge>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>

                                {/* Información básica */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>ID: {product.id}</div>
                                  <div>
                                    Estado:{" "}
                                    {getStatusBadge(
                                      product.status,
                                    )}
                                  </div>
                                  <div>
                                    Precio:{" "}
                                    {formatCurrency(
                                      product.price,
                                    )}
                                  </div>
                                  <div>
                                    Stock: {product.stock}
                                  </div>
                                  <div>
                                    Creación:{" "}
                                    {new Date(
                                      product.createdAt,
                                    ).toLocaleDateString(
                                      "es-ES",
                                    )}
                                  </div>
                                </div>

                                {/* Proveedores */}
                                {product.suppliers.length >
                                  0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Proveedores
                                    </h4>
                                    <div className="space-y-1">
                                      {product.suppliers.map(
                                        (supplier) => (
                                          <div
                                            key={supplier.id}
                                            className="flex items-center justify-between text-sm"
                                          >
                                            <span>
                                              {
                                                supplier.supplierName
                                              }
                                            </span>
                                            <Badge variant="outline">
                                              {
                                                supplier.supplierCode
                                              }
                                            </Badge>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Descripción */}
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Descripción
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={
                              editingProduct?.id === product.id
                            }
                            onOpenChange={(open: boolean) =>
                              !open && setEditingProduct(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditProduct(product)
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent key={`edit-product-${product.id}`} className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Editar Producto
                                </DialogTitle>
                                <DialogDescription>
                                  Modifica la información del
                                  producto
                                </DialogDescription>
                              </DialogHeader>
                              <ProductFormComponent
                                onSubmit={handleUpdateProduct}
                                isEdit
                                newProduct={newProduct}
                                setNewProduct={setNewProduct}
                                productImages={productImages}
                                productSuppliers={productSuppliers}
                                newImageUrl={newImageUrl}
                                setNewImageUrl={setNewImageUrl}
                                uploadedImageFile={uploadedImageFile}
                                setUploadedImageFile={setUploadedImageFile}
                                imageValidationError={imageValidationError}
                                setImageValidationError={setImageValidationError}
                                imageFileInputRef={imageFileInputRef}
                                handleImageFileUpload={handleImageFileUpload}
                                clearUploadedImageFile={clearUploadedImageFile}
                                newSupplierData={newSupplierData}
                                setNewSupplierData={setNewSupplierData}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                handleLineChange={handleLineChange}
                                getAvailableBrands={getAvailableBrands}
                                addImage={addImage}
                                removeImage={removeImage}
                                setPrimaryImage={setPrimaryImage}
                                moveImage={moveImage}
                                addSupplier={addSupplier}
                                removeSupplier={removeSupplier}
                                getStatusBadge={getStatusBadge}
                                formatCurrency={formatCurrency}
                                setIsCreateModalOpen={setIsCreateModalOpen}
                                setEditingProduct={setEditingProduct}
                                resetForm={resetForm}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar eliminación
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de que deseas
                                  eliminar "{product.name}"?
                                  Esta acción no se puede
                                  deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product.id,
                                    )
                                  }
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
                  );
                })}
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