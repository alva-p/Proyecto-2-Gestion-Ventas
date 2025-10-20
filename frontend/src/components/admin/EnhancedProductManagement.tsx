// frontend/src/components/admin/EnhancedProductManagement.tsx
import React, { useState, useRef, useEffect } from "react";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../../services/productService";
import { getLineas } from "../../services/lineService";
import { getMarcas } from "../../services/marcaService";
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
import { Plus, Edit, Trash2, Package, Upload, Search, Eye, X, Building2, Star, ArrowUp, ArrowDown, Image as ImageIcon, Grid3X3 } from "lucide-react";
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
              <Label htmlFor="line">Línea *</Label>
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
              <Label htmlFor="brand">Marca *</Label>
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
              handleImageFileUpload={() => {}}
              clearUploadedImageFile={() => {}}
              newSupplierData={newSupplierData}
              setNewSupplierData={setNewSupplierData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleLineChange={handleLineChange}
              getAvailableBrands={getAvailableBrands}
              addImage={() => {}}
              removeImage={() => {}}
              setPrimaryImage={() => {}}
              moveImage={() => {}}
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
            />
          </DialogContent>
        </Dialog>
    </Card>
  );
}
