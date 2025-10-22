// frontend/src/components/admin/EnhancedProductManagement.tsx
import React, { useState, useRef, useEffect } from "react";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../../services/productService";
import { getLineas, createLinea, type CreateLineaDTO } from "../../services/lineaService";
import { getMarcas, createMarca, type CreateMarcaDTO } from "../../services/marcaService";
import { getProveedores } from "../../services/proveedorService";
import type { Proveedor } from "../../types/Proveedor";
import type { Producto } from "../../types/Producto";
import type { Linea } from "../../types/Linea";
import type { Marca } from "../../types/Marca";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, Edit, Trash2, Package, Upload, Search, Eye, X, Building2, Star, ArrowUp, ArrowDown, Image as ImageIcon, Grid3X3, AlertTriangle } from "lucide-react";
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

type NewProductState = {
  name: string;
  description: string;
  brandId: string;
  lineId: string;
  price: string;
  stock: string;
  status: "active" | "inactive" | "draft";
};
// ------------------------------------------------------------
// Componente de formulario
// ------------------------------------------------------------
type ProductFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  newProduct: NewProductState;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProductState>>;
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
  getAvailableBrands: (lineId: string) => Marca[];
  addImage: () => void;
  removeImage: (imageId: string) => void;
  setPrimaryImage: (imageId: string) => void;
  moveImage: (imageId: string, direction: "up" | "down") => void;
  addSupplier: () => void;
  removeSupplier: (supplierId: string) => void;
  getStatusBadge: (status: string) => React.ReactElement;
  formatCurrency: (amount: number) => string;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingProduct: React.Dispatch<React.SetStateAction<Producto | null>>;
  resetForm: () => void;
  lineas: Linea[];
  marcas: Marca[];
  proveedores: Proveedor[];
  // Nuevas props para crear línea y marca
  isCreateLineDialogOpen: boolean;
  setIsCreateLineDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateBrandDialogOpen: boolean;
  setIsCreateBrandDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newLineData: { nombre: string; descripcion: string; marcaId: string; estado: string };
  setNewLineData: React.Dispatch<React.SetStateAction<{ nombre: string; descripcion: string; marcaId: string; estado: string }>>;
  newBrandData: { nombre: string; descripcion: string };
  setNewBrandData: React.Dispatch<React.SetStateAction<{ nombre: string; descripcion: string }>>;
  handleCreateLine: () => Promise<void>;
  handleCreateBrand: () => Promise<void>;
};

const ProductFormComponent = React.memo<ProductFormProps>(
  ({
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
    lineas,
    marcas,
    proveedores,
    isCreateLineDialogOpen,
    setIsCreateLineDialogOpen,
    isCreateBrandDialogOpen,
    setIsCreateBrandDialogOpen,
    newLineData,
    setNewLineData,
    newBrandData,
    setNewBrandData,
    handleCreateLine,
    handleCreateBrand,
  }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          <TabsTrigger value="review">Revisar</TabsTrigger>
        </TabsList>

        {/* --------------------------------------------- */}
        {/* TAB BÁSICO */}
        {/* --------------------------------------------- */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="line">Línea *</Label>
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
                            {marcas.map((marca) => (
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
                          value={newLineData.estado}
                          onValueChange={(v) => setNewLineData((d) => ({ ...d, estado: v }))}
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
                            setNewLineData({ nombre: "", descripcion: "", marcaId: "", estado: "activo" });
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
              <Select value={newProduct.lineId} onValueChange={handleLineChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar línea" />
                </SelectTrigger>
                <SelectContent>
                  {lineas.map((line) => (
                    <SelectItem key={line.id} value={line.id.toString()}>
                      {line.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="brand">Marca *</Label>
                <Dialog open={isCreateBrandDialogOpen} onOpenChange={setIsCreateBrandDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Agregar nueva marca
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
                            setNewBrandData({ nombre: "", descripcion: "" });
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
              <Select
                value={newProduct.brandId}
                onValueChange={(value: string) => setNewProduct((p) => ({ ...p, brandId: value }))}
                disabled={!newProduct.lineId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={newProduct.lineId ? "Seleccionar marca" : "Primero seleccione una línea"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableBrands(newProduct.lineId).map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.nombre}
                    </SelectItem>
                  ))}
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
                onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
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
                onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descripción detallada del producto"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={newProduct.status} onValueChange={(v: any) => setNewProduct((p) => ({ ...p, status: v }))}>
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
        </TabsContent>

        {/* --------------------------------------------- */}
        {/* TAB IMÁGENES */}
        {/* --------------------------------------------- */}
        <TabsContent value="images" className="space-y-4">
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
                  id="product-file-upload"
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

            <div className="flex space-x-2">
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
                className={uploadedImageFile ? 'opacity-50 flex-1' : 'flex-1'}
              />
              <Button type="button" onClick={addImage} disabled={!newImageUrl.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

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
            {newImageUrl && !uploadedImageFile && (
              <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Vista previa:</p>
                <ImageWithFallback
                  src={newImageUrl}
                  alt="Vista previa del producto"
                  className="w-20 h-20 object-contain rounded border bg-white p-2"
                />
              </div>
            )}

            {/* Lista de imágenes agregadas */}
            {productImages.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label>Imágenes del producto ({productImages.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productImages.map((image, index) => (
                    <div key={image.id} className="border rounded-lg p-4 space-y-2">
                      <div className="relative">
                        <ImageWithFallback
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-32 object-cover rounded"
                        />
                        {image.isPrimary && (
                          <Badge className="absolute top-2 left-2" variant="default">
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
                            onClick={() => moveImage(image.id, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image.id, "down")}
                            disabled={index === productImages.length - 1}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                          {!image.isPrimary && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPrimaryImage(image.id)}
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

        {/* --------------------------------------------- */}
        {/* TAB PROVEEDORES */}
        {/* --------------------------------------------- */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Proveedores</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Proveedor</Label>
              <Select
                value={newSupplierData.supplierId}
                onValueChange={(v) => setNewSupplierData((p) => ({ ...p, supplierId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.nombre}
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
                  onChange={(e) => setNewSupplierData((p) => ({ ...p, supplierCode: e.target.value }))}
                  placeholder="Código único"
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productSuppliers.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.supplierName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{s.supplierCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => removeSupplier(s.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
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
        <Button type="submit">{isEdit ? "Actualizar Producto" : "Crear Producto"}</Button>
      </div>
    </form>
  )
);

ProductFormComponent.displayName = "ProductForm";

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export function EnhancedProductManagement() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [newProduct, setNewProduct] = useState<NewProductState>({
    name: "",
    description: "",
    brandId: "",
    lineId: "",
    price: "",
    stock: "",
    status: "draft",
  });
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imageValidationError, setImageValidationError] = useState<string>("");
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [newSupplierData, setNewSupplierData] = useState({ supplierId: "", supplierCode: "" });

  // Estados para crear línea y marca
  const [isCreateLineDialogOpen, setIsCreateLineDialogOpen] = useState(false);
  const [isCreateBrandDialogOpen, setIsCreateBrandDialogOpen] = useState(false);
  const [newLineData, setNewLineData] = useState({ nombre: "", descripcion: "", marcaId: "", estado: "activo" });
  const [newBrandData, setNewBrandData] = useState({ nombre: "", descripcion: "" });

  // ------------------------------------------------------------
  // CARGA INICIAL
  // ------------------------------------------------------------
  useEffect(() => {
    Promise.all([getProductos(), getMarcas(), getLineas(), getProveedores()])
      .then(([productos, marcas, lineas, proveedores]) => {
        setProducts(productos);
        setFilteredProducts(productos);
        setMarcas(marcas);
        setLineas(lineas);
        setProveedores(proveedores);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  // ------------------------------------------------------------
  // FUNCIONES DE BACKEND
  // ------------------------------------------------------------
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.lineId) {
      alert("Debe seleccionar una línea");
      return;
    }

    const dto = {
      nombre: newProduct.name,
      descripcion: newProduct.description,
      precio: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock || "0"),
      estado: newProduct.status === "active",
      lineaId: parseInt(newProduct.lineId),
      proveedorId: productSuppliers.map((p) => parseInt(p.supplierId)),
    };

    try {
      const creado = await createProducto(dto);
      const updated = [...products, creado];
      setProducts(updated);
      setFilteredProducts(updated);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error creando producto:", err);
      alert("Error al crear el producto");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const dto = {
      nombre: newProduct.name,
      descripcion: newProduct.description,
      precio: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock || "0"),
      estado: newProduct.status === "active",
      lineaId: parseInt(newProduct.lineId),
      proveedorId: productSuppliers.map((p) => parseInt(p.supplierId)),
    };

    try {
      const actualizado = await updateProducto(Number(editingProduct.id), dto);
      const updatedProducts = products.map((p) => (p.id === actualizado.id ? actualizado : p));
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProduct(null);
      setIsCreateModalOpen(false);
      resetForm();

    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("Error al actualizar el producto");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProducto(Number(productId));
      const updated = products.filter((p) => p.id.toString() !== productId);
      setProducts(updated);
      setFilteredProducts(updated);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("No se pudo eliminar el producto");
    }
  };

  // ------------------------------------------------------------
  // FUNCIONES DE MANEJO DE IMÁGENES
  // ------------------------------------------------------------
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
    const updatedImages = productImages.filter((img) => img.id !== imageId);
    if (updatedImages.length > 0 && !updatedImages.some((img) => img.isPrimary)) {
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

  const moveImage = (imageId: string, direction: "up" | "down") => {
    const currentIndex = productImages.findIndex((img) => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= productImages.length) return;

    const updatedImages = [...productImages];
    [updatedImages[currentIndex], updatedImages[newIndex]] = [
      updatedImages[newIndex],
      updatedImages[currentIndex],
    ];

    updatedImages.forEach((img, index) => {
      img.order = index + 1;
    });

    setProductImages(updatedImages);
  };

  // ------------------------------------------------------------
  // FUNCIONES PARA CREAR LÍNEA Y MARCA
  // ------------------------------------------------------------
  const handleCreateLine = async () => {
    if (!newLineData.nombre.trim()) {
      alert("El nombre de la línea es obligatorio");
      return;
    }
    if (!newLineData.marcaId) {
      alert("Debe seleccionar una marca para la línea");
      return;
    }

    // Validar que no exista una línea con el mismo nombre
    const exists = lineas.some((l) => l.nombre.toLowerCase() === newLineData.nombre.trim().toLowerCase());
    if (exists) {
      alert("Ya existe una línea con ese nombre");
      return;
    }

    const dto: CreateLineaDTO = {
      nombre: newLineData.nombre.trim(),
      descripcion: newLineData.descripcion.trim() || undefined,
      estado: newLineData.estado,
      marcaId: parseInt(newLineData.marcaId),
    };

    try {
      const nuevaLinea = await createLinea(dto);
      const updated = [...lineas, nuevaLinea];
      setLineas(updated);
      
      // Seleccionar automáticamente la nueva línea en el formulario
      setNewProduct((p) => ({ ...p, lineId: nuevaLinea.id.toString() }));
      
      // Resetear y cerrar diálogo
      setNewLineData({ nombre: "", descripcion: "", marcaId: "", estado: "activo" });
      setIsCreateLineDialogOpen(false);
      
      alert("Línea creada exitosamente");
    } catch (err) {
      console.error("Error creando línea:", err);
      alert("Error al crear la línea");
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandData.nombre.trim()) {
      alert("El nombre de la marca es obligatorio");
      return;
    }

    // Validar que no exista una marca con el mismo nombre
    const exists = marcas.some((m) => m.nombre.toLowerCase() === newBrandData.nombre.trim().toLowerCase());
    if (exists) {
      alert("Ya existe una marca con ese nombre");
      return;
    }

    const dto: CreateMarcaDTO = {
      nombre: newBrandData.nombre.trim(),
      descripcion: newBrandData.descripcion.trim() || undefined,
    };

    try {
      const nuevaMarca = await createMarca(dto);
      const updated = [...marcas, nuevaMarca];
      setMarcas(updated);
      
      // Resetear y cerrar diálogo
      setNewBrandData({ nombre: "", descripcion: "" });
      setIsCreateBrandDialogOpen(false);
      
      alert("Marca creada exitosamente. Ahora puede crear una línea asociada a esta marca.");
    } catch (err) {
      console.error("Error creando marca:", err);
      alert("Error al crear la marca");
    }
  };

  // ------------------------------------------------------------
  // FUNCIONES AUXILIARES
  // ------------------------------------------------------------
  const getAvailableBrands = (lineId: string) => {
    const linea = lineas.find((l) => l.id.toString() === lineId);
    return linea && linea.marca ? [linea.marca] : [];
  };

  const handleLineChange = (lineId: string) => {
    const linea = lineas.find((l) => l.id.toString() === lineId);
    setNewProduct((p) => ({ ...p, lineId, brandId: linea?.marcaId?.toString() || "" }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term.toLowerCase()) ||
        p.linea.nombre.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const resetForm = () => {
    setNewProduct({ name: "", description: "", brandId: "", lineId: "", price: "", stock: "", status: "draft" });
    setProductImages([]);
    setProductSuppliers([]);
    setNewImageUrl("");
    setUploadedImageFile(null);
    setImageValidationError("");
    setNewSupplierData({ supplierId: "", supplierCode: "" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Activo</Badge>;
      case "inactive":
        return <Badge className="bg-red-500 text-white">Inactivo</Badge>;
      default:
        return <Badge variant="outline">Borrador</Badge>;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);

  // ------------------------------------------------------------
  // EFECTO: Cargar datos del producto al abrir en modo edición
  // ------------------------------------------------------------
  useEffect(() => {
    if (editingProduct) {
      setNewProduct({
        name: editingProduct.nombre,
        description: editingProduct.descripcion || "",
        // ✅ Acceso correcto a los IDs reales
        lineId: editingProduct.linea?.id?.toString() || "",
        brandId: editingProduct.linea?.marca?.id?.toString() || "",
        price: editingProduct.precio?.toString() || "",
        stock: editingProduct.stock?.toString() || "",
        status: editingProduct.estado ? "active" : "inactive",
      });

      // ✅ Cargar proveedores asociados
      if (editingProduct.proveedores?.length > 0) {
        const mapped = editingProduct.proveedores.map((prov) => ({
          id: prov.id.toString(),
          supplierId: prov.id.toString(),
          supplierName: prov.nombre,
          supplierCode: String(prov.id || "-"),
        }));
        setProductSuppliers(mapped);
      } else {
        setProductSuppliers([]);
      }

      setActiveTab("basic");
    }
  }, [editingProduct]);
  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Productos</CardTitle>
        <CardDescription>Administra tus productos, líneas, marcas y proveedores.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
            />
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setIsCreateModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo producto
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Línea</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Proveedores</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.linea?.nombre || "-"}</TableCell>
                <TableCell>{product.linea?.marca?.nombre || "-"}</TableCell>
                <TableCell>{formatCurrency(product.precio)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.proveedores.length}</TableCell>
                <TableCell>{product.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setIsCreateModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id.toString())}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
              {/* MODAL PARA CREAR / EDITAR PRODUCTO */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar producto" : "Crear nuevo producto"}</DialogTitle>
              <DialogDescription>
                Complete los campos requeridos y presione “{editingProduct ? "Actualizar" : "Crear"}”.
              </DialogDescription>
            </DialogHeader>

            <ProductFormComponent
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              isEdit={!!editingProduct}
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
              addSupplier={() => {
                if (!newSupplierData.supplierId) return;
                const supplier = proveedores.find((p) => p.id.toString() === newSupplierData.supplierId);
                if (!supplier) return;
                setProductSuppliers((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    supplierId: newSupplierData.supplierId,
                    supplierName: supplier.nombre,
                    supplierCode: newSupplierData.supplierCode || "-",
                  },
                ]);
                setNewSupplierData({ supplierId: "", supplierCode: "" });
              }}
              removeSupplier={(id) =>
                setProductSuppliers((prev) => prev.filter((s) => s.id !== id))
              }
              getStatusBadge={getStatusBadge}
              formatCurrency={formatCurrency}
              setIsCreateModalOpen={setIsCreateModalOpen}
              setEditingProduct={setEditingProduct}
              resetForm={resetForm}
              lineas={lineas}
              marcas={marcas}
              proveedores={proveedores}
              isCreateLineDialogOpen={isCreateLineDialogOpen}
              setIsCreateLineDialogOpen={setIsCreateLineDialogOpen}
              isCreateBrandDialogOpen={isCreateBrandDialogOpen}
              setIsCreateBrandDialogOpen={setIsCreateBrandDialogOpen}
              newLineData={newLineData}
              setNewLineData={setNewLineData}
              newBrandData={newBrandData}
              setNewBrandData={setNewBrandData}
              handleCreateLine={handleCreateLine}
              handleCreateBrand={handleCreateBrand}
            />
          </DialogContent>
        </Dialog>
    </Card>
  );
}
