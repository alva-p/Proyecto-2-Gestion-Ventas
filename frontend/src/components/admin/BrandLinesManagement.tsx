import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Dialog,
  DialogContent,
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
import { Plus, Edit, Trash2, List, Search, AlertTriangle } from "lucide-react";

import type { Linea } from "../../types/Linea";
import type { Marca } from "../../types/Marca";
import { getMarcas } from "../../services/marcaService";
import { getLineas, createLinea, updateLinea, deleteLinea } from "../../services/lineaService";

// ------------------------------------------------------------
// FORMULARIO REUTILIZABLE
// ------------------------------------------------------------
type LineFormData = {
  nombre: string;
  descripcion: string;
  marcaId: string;
  estado: "active" | "inactive";
};

const LineFormComponent = React.memo(
  ({
    onSubmit,
    isEdit = false,
    newLine,
    setNewLine,
    setIsCreateModalOpen,
    setEditingLine,
    resetForm,
    brands,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
    newLine: LineFormData;
    setNewLine: React.Dispatch<React.SetStateAction<LineFormData>>;
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingLine: React.Dispatch<React.SetStateAction<Linea | null>>;
    resetForm: () => void;
    brands: Marca[];
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="marcaId">Marca *</Label>
        <Select
          value={newLine.marcaId}
          onValueChange={(value: string) => setNewLine((prev) => ({ ...prev, marcaId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar marca" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={String(brand.id)}>
                {brand.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Línea *</Label>
        <Input
          id="nombre"
          value={newLine.nombre}
          onChange={(e) => setNewLine((prev) => ({ ...prev, nombre: e.target.value }))}
          placeholder="Nombre de la línea"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={newLine.descripcion}
          onChange={(e) => setNewLine((prev) => ({ ...prev, descripcion: e.target.value }))}
          placeholder="Descripción de la línea"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select
          value={newLine.estado}
          onValueChange={(value: "active" | "inactive") =>
            setNewLine((prev) => ({ ...prev, estado: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activa</SelectItem>
            <SelectItem value="inactive">Inactiva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingLine(null);
            resetForm();
          }}
        >
          Cancelar
        </Button>
        <Button type="submit">{isEdit ? "Actualizar Línea" : "Crear Línea"}</Button>
      </div>
    </form>
  )
);

LineFormComponent.displayName = "LineForm";

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export function BrandLinesManagement() {
  const [brands, setBrands] = useState<Marca[]>([]);
  const [brandLines, setBrandLines] = useState<Linea[]>([]);
  const [filteredLines, setFilteredLines] = useState<Linea[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<Linea | null>(null);
  const [deleteAttempt, setDeleteAttempt] = useState<{ line: Linea; hasProducts: boolean } | null>(
    null
  );
  const [newLine, setNewLine] = useState<LineFormData>({
    nombre: "",
    descripcion: "",
    marcaId: "",
    estado: "active",
  });

  // ------------------------------------------------------------
  // CARGA INICIAL
  // ------------------------------------------------------------
  useEffect(() => {
    Promise.all([getMarcas(), getLineas()])
      .then(([marcas, lineas]) => {
        setBrands(marcas);
        setBrandLines(lineas);
        setFilteredLines(lineas);
      })
      .catch((err) => console.error("Error cargando marcas/líneas:", err));
  }, []);

  // ------------------------------------------------------------
  // FILTROS Y BÚSQUEDA
  // ------------------------------------------------------------
  const applyFilters = (term: string, brandId: string) => {
    let filtered = brandLines;
    if (term) {
      filtered = filtered.filter(
        (line) =>
          line.nombre.toLowerCase().includes(term.toLowerCase()) ||
          line.descripcion?.toLowerCase().includes(term.toLowerCase()) ||
          line.marca?.nombre?.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (brandId !== "all") filtered = filtered.filter((line) => String(line.marca?.id) === brandId);
    setFilteredLines(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedBrand);
  };

  const handleBrandFilter = (brandId: string) => {
    setSelectedBrand(brandId);
    applyFilters(searchTerm, brandId);
  };

  const resetForm = () => {
    setNewLine({
      nombre: "",
      descripcion: "",
      marcaId: "",
      estado: "active",
    });
  };

  // ------------------------------------------------------------
  // CRUD
  // ------------------------------------------------------------
  const handleCreateLine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nueva = await createLinea({
        nombre: newLine.nombre,
        descripcion: newLine.descripcion,
        marcaId: parseInt(newLine.marcaId),
        estado: newLine.estado === "active",
      });
      const updated = [...brandLines, nueva];
      setBrandLines(updated);
      setFilteredLines(updated);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creando línea:", error);
    }
  };

  const handleEditLine = (line: Linea) => {
    setEditingLine(line);
    setNewLine({
      nombre: line.nombre,
      descripcion: line.descripcion || "",
      marcaId: String(line.marca?.id || ""),
      estado: line.estado ? "active" : "inactive",
    });
  };

  const handleUpdateLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLine) return;
    try {
      const actualizada = await updateLinea(editingLine.id, {
        nombre: newLine.nombre,
        descripcion: newLine.descripcion,
        marcaId: parseInt(newLine.marcaId),
        estado: newLine.estado === "active",
      });
      const updated = brandLines.map((l) => (l.id === editingLine.id ? actualizada : l));
      setBrandLines(updated);
      setFilteredLines(updated);
      setEditingLine(null);
      resetForm();
    } catch (error) {
      console.error("Error actualizando línea:", error);
    }
  };

  const handleDeleteAttempt = (line: Linea) => {
    const hasProducts = (line.productos?.length ?? 0) > 0;
    setDeleteAttempt({ line, hasProducts });
  };

  const handleDeleteLine = async () => {
    if (!deleteAttempt || deleteAttempt.hasProducts) return;
    try {
      await deleteLinea(deleteAttempt.line.id);
      const updated = brandLines.filter((l) => l.id !== deleteAttempt.line.id);
      setBrandLines(updated);
      setFilteredLines(updated);
      setDeleteAttempt(null);
    } catch (error) {
      console.error("Error eliminando línea:", error);
    }
  };

  const getStatusBadge = (estado: boolean) => (
    <Badge variant={estado ? "default" : "secondary"}>{estado ? "Activa" : "Inactiva"}</Badge>
  );

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <List className="w-5 h-5" />
                <span>Gestión de Líneas por Marca</span>
              </CardTitle>
              <CardDescription>Administra las líneas de productos y sus marcas</CardDescription>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nueva Línea</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Línea</DialogTitle>
                </DialogHeader>
                <LineFormComponent
                  onSubmit={handleCreateLine}
                  newLine={newLine}
                  setNewLine={setNewLine}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  setEditingLine={setEditingLine}
                  resetForm={resetForm}
                  brands={brands}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* 🔍 Filtros */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar líneas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <Select value={selectedBrand} onValueChange={handleBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={String(brand.id)}>
                      {brand.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 🧾 Tabla */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Línea</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>{line.nombre}</TableCell>
                    <TableCell>{line.marca?.nombre ?? "-"}</TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">
                      {line.descripcion || "Sin descripción"}
                    </TableCell>
                    <TableCell>
                      {line.fechaCreacion
                        ? new Date(line.fechaCreacion).toLocaleDateString("es-ES")
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(line.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {/* Editar */}
                        <Dialog
                          open={editingLine?.id === line.id}
                          onOpenChange={(open) => !open && setEditingLine(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditLine(line)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Editar Línea</DialogTitle>
                            </DialogHeader>
                            <LineFormComponent
                              onSubmit={handleUpdateLine}
                              isEdit
                              newLine={newLine}
                              setNewLine={setNewLine}
                              setIsCreateModalOpen={setIsCreateModalOpen}
                              setEditingLine={setEditingLine}
                              resetForm={resetForm}
                              brands={brands}
                            />
                          </DialogContent>
                        </Dialog>

                        {/* Eliminar */}
                        <AlertDialog
                          open={deleteAttempt?.line.id === line.id}
                          onOpenChange={(open) => !open && setDeleteAttempt(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAttempt(line)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center space-x-2">
                                {deleteAttempt?.hasProducts && (
                                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                )}
                                <span>
                                  {deleteAttempt?.hasProducts
                                    ? "No se puede eliminar"
                                    : "Confirmar eliminación"}
                                </span>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {deleteAttempt?.hasProducts
                                  ? `No puedes eliminar la línea "${line.nombre}" porque tiene productos asociados.`
                                  : `¿Seguro que deseas eliminar la línea "${line.nombre}"? Esta acción no se puede deshacer.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {deleteAttempt?.hasProducts ? "Entendido" : "Cancelar"}
                              </AlertDialogCancel>
                              {!deleteAttempt?.hasProducts && (
                                <AlertDialogAction
                                  onClick={handleDeleteLine}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              )}
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

          {filteredLines.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron líneas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
