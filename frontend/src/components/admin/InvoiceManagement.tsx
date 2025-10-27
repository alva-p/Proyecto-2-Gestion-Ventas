import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Trash2,
  User,
  DollarSign,
  Package,
  AlertCircle
} from 'lucide-react';
import { getInvoices, getInvoiceById, deleteInvoice } from '../../services/invoiceService';
import { generateInvoicePDF } from '../../lib/pdfGenerator';
import type { Invoice } from '../../types/invoice';

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar facturas al montar el componente
  useEffect(() => {
    loadInvoices();
  }, []);

  // Filtrar facturas cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = invoices.filter(invoice => 
        invoice.numero_factura.toLowerCase().includes(term) ||
        invoice.cliente_nombre.toLowerCase().includes(term) ||
        invoice.cliente_documento.toLowerCase().includes(term)
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, invoices]);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await getInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      toast.error('Error al cargar las facturas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (invoiceId: number) => {
    try {
      const invoice = await getInvoiceById(invoiceId);
      setSelectedInvoice(invoice);
      setIsDetailDialogOpen(true);
    } catch (error) {
      console.error('Error al cargar detalles de factura:', error);
      toast.error('Error al cargar los detalles de la factura');
    }
  };

  const handleDownloadPDF = async (invoiceId: number) => {
    try {
      const invoice = await getInvoiceById(invoiceId);
      generateInvoicePDF(invoice);
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  const handleDeleteInvoice = async (invoiceId: number, numeroFactura: string) => {
    if (!window.confirm(`¿Está seguro de eliminar la factura ${numeroFactura}?`)) {
      return;
    }

    try {
      await deleteInvoice(invoiceId);
      toast.success('Factura eliminada exitosamente');
      loadInvoices();
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      toast.error('Error al eliminar la factura');
    }
  };

  const getInvoiceTypeBadge = (tipo: 'A' | 'B' | 'C') => {
    const variants = {
      'A': 'default',
      'B': 'secondary',
      'C': 'outline'
    } as const;

    return (
      <Badge variant={variants[tipo]}>
        Tipo {tipo}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Facturas</h2>
          <p className="text-muted-foreground">
            Visualice y descargue las facturas de ventas registradas
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de factura, cliente o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Registradas ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-pulse">Cargando facturas...</div>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron facturas</p>
              {searchTerm && (
                <p className="text-sm">Intente con otro término de búsqueda</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-semibold">
                        {invoice.numero_factura}
                      </TableCell>
                      <TableCell>
                        {getInvoiceTypeBadge(invoice.tipo)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.cliente_nombre}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {invoice.cliente_documento}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.fecha_emision).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${invoice.venta.importe_total.toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(invoice.id)}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPDF(invoice.id)}
                            title="Descargar PDF"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteInvoice(invoice.id, invoice.numero_factura)}
                            title="Eliminar"
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
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalles */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Factura</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              {/* Información de la Factura */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Información de la Factura</span>
                    </span>
                    {getInvoiceTypeBadge(selectedInvoice.tipo)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Número de Factura</p>
                    <p className="font-mono font-semibold">{selectedInvoice.numero_factura}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                    <p className="font-medium">
                      {new Date(selectedInvoice.fecha_emision).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedInvoice.cliente_nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Documento</p>
                    <p className="font-medium">{selectedInvoice.cliente_documento}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Información de la Venta */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Información de la Venta</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID de Venta</p>
                    <p className="font-medium">#{selectedInvoice.venta.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Venta</p>
                    <p className="font-medium">
                      {new Date(selectedInvoice.venta.fecha).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vendedor</p>
                    <p className="font-medium">{selectedInvoice.venta.usuario.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Vendedor</p>
                    <p className="font-medium">{selectedInvoice.venta.usuario.correo}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Productos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Productos ({selectedInvoice.venta.productos.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.venta.productos.map((producto, index) => (
                        <TableRow key={producto.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {producto.codigo || '-'}
                          </TableCell>
                          <TableCell className="font-medium">{producto.nombre}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {producto.descripcion || '-'}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${producto.precio.toLocaleString('es-AR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Total */}
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">Total de la Factura:</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        ${selectedInvoice.venta.importe_total.toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Notas */}
                  {selectedInvoice.venta.notas && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Notas:</p>
                          <p className="text-sm text-muted-foreground">{selectedInvoice.venta.notas}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => handleDownloadPDF(selectedInvoice.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
