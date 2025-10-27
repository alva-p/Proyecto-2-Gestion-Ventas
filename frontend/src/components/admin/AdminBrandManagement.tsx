// frontend/src/components/admin/AdminBrandManagement.tsx
import React, { useEffect, useState } from "react";
import { getMarcas, createMarca, updateMarca, deleteMarca } from "../../services/marcaService";
import type { Marca } from "../../types/Marca";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Plus, Edit, Trash2, Tag, Search } from "lucide-react";

export function AdminBrandManagement() {
  const [brands, setBrands] = useState<Marca[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Marca[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Marca | null>(null);
  const [newBrand, setNewBrand] = useState({ nombre: "", descripcion: "" });
  const [validationError, setValidationError] = useState("");

  // 🔹 Cargar marcas del backend
  useEffect(() => {
    getMarcas()
      .then((data) => {
        setBrands(data);
        setFilteredBrands(data);
      })
      .catch((err) => console.error("Error cargando marcas:", err));
  }, []);

  // 🔹 Buscar
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = brands.filter(
      (b) =>
        b.nombre.toLowerCase().includes(term.toLowerCase()) ||
        (b.descripcion || "").toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  // 🔹 Crear marca
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newBrand.nombre.trim()) {
        setValidationError("El nombre de la marca es obligatorio.");
        return;
      }

      const dto = {
        nombre: newBrand.nombre.trim(),
        descripcion: newBrand.descripcion.trim(),
      };

      const creada = await createMarca(dto);
      const updated = [...brands, creada];
      setBrands(updated);
      setFilteredBrands(updated);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Error creando marca:", err);
      alert(err.response?.data?.message || "Error al crear la marca");
    }
  };

  // 🔹 Editar marca
  const handleEditBrand = (brand: Marca) => {
    setEditingBrand(brand);
    setNewBrand({
      nombre: brand.nombre,
      descripcion: brand.descripcion || "",
    });
    setIsCreateModalOpen(true);
  };

  // 🔹 Actualizar marca
  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    try {
      const dto = {
        nombre: newBrand.nombre.trim(),
        descripcion: newBrand.descripcion.trim(),
      };

      const actualizada = await updateMarca(editingBrand.id, dto);
      const updated = brands.map((m) => (m.id === actualizada.id ? actualizada : m));
      setBrands(updated);
      setFilteredBrands(updated);

      setEditingBrand(null);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Error actualizando marca:", err);
      alert(err.response?.data?.message || "Error al actualizar la marca");
    }
  };

  // 🔹 Eliminar marca
  const handleDeleteBrand = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta marca?")) return;
    try {
      await deleteMarca(id);
      const updated = brands.filter((b) => b.id !== id);
      setBrands(updated);
      setFilteredBrands(updated);
    } catch (err) {
      console.error("Error eliminando marca:", err);
      alert("No se pudo eliminar la marca");
    }
  };

  // 🔹 Reset form
  const resetForm = () => {
    setNewBrand({ nombre: "", descripcion: "" });
    setValidationError("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Gestión de Marcas</span>
              </CardTitle>
              <CardDescription>Administra las marcas del catálogo</CardDescription>
            </div>

            <Button
              onClick={() => {
                resetForm();
                setEditingBrand(null);
                setIsCreateModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Marca
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* 🔍 BUSCADOR */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar marcas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 🧾 TABLA DE MARCAS */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.id}</TableCell>
                    <TableCell className="font-medium">{brand.nombre}</TableCell>
                    <TableCell>{brand.descripcion || "Sin descripción"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBrand(brand)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBrand(brand.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ⚠️ VACÍO */}
          {filteredBrands.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron marcas.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🧩 MODAL CREAR / EDITAR */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBrand ? "Editar Marca" : "Crear Nueva Marca"}
            </DialogTitle>
            <DialogDescription>
              {editingBrand
                ? "Modifica la información de la marca seleccionada"
                : "Completa la información de la nueva marca"}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={editingBrand ? handleUpdateBrand : handleCreateBrand}
            className="space-y-4"
          >
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {validationError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Marca *</Label>
              <Input
                id="nombre"
                value={newBrand.nombre}
                onChange={(e) => setNewBrand({ ...newBrand, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={newBrand.descripcion}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, descripcion: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingBrand(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingBrand ? "Actualizar Marca" : "Crear Marca"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
