import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from '../types/invoice';

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();
  
  // Configuración de colores
  const primaryColor: [number, number, number] = [59, 130, 246]; // Azul
  const textColor: [number, number, number] = [55, 65, 81]; // Gris oscuro
  
  // Header - Logo y título de empresa
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BuyApp', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión de Ventas', 15, 28);
  
  // Información de la factura (derecha del header)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`FACTURA ${invoice.tipo}`, 150, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.numero_factura, 150, 28);
  
  // Información del cliente
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE', 15, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${invoice.cliente_nombre}`, 15, 63);
  doc.text(`Documento: ${invoice.cliente_documento}`, 15, 70);
  
  // Información de la venta (derecha)
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DE LA VENTA', 120, 55);
  
  doc.setFont('helvetica', 'normal');
  const fechaEmision = new Date(invoice.fecha_emision).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  doc.text(`Fecha de Emisión: ${fechaEmision}`, 120, 63);
  doc.text(`Vendedor: ${invoice.venta.usuario.nombre}`, 120, 70);
  
  // Tabla de productos
  const productosData = invoice.venta.productos.map((producto, index) => [
    (index + 1).toString(),
    producto.codigo || '-',
    producto.nombre,
    producto.descripcion || '-',
    `$${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  ]);
  
  autoTable(doc, {
    startY: 85,
    head: [['#', 'Código', 'Producto', 'Descripción', 'Precio']],
    body: productosData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: {
      fontSize: 9,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 30 },
      2: { cellWidth: 60 },
      3: { cellWidth: 50 },
      4: { cellWidth: 35, halign: 'right' }
    }
  });
  
  // Obtener la posición Y final de la tabla
  const finalY = (doc as any).lastAutoTable.finalY || 85;
  
  // Total
  doc.setFillColor(240, 240, 240);
  doc.rect(120, finalY + 10, 75, 25, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 125, finalY + 20);
  
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  const total = `$${invoice.venta.importe_total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  doc.text(total, 185, finalY + 20, { align: 'right' });
  
  // Notas (si existen)
  if (invoice.venta.notas) {
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas:', 15, finalY + 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitNotas = doc.splitTextToSize(invoice.venta.notas, 180);
    doc.text(splitNotas, 15, finalY + 57);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'italic');
  doc.text('Gracias por su compra - BuyApp', 105, pageHeight - 15, { align: 'center' });
  doc.text(`Generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`, 105, pageHeight - 10, { align: 'center' });
  
  // Guardar el PDF
  doc.save(`Factura_${invoice.numero_factura}.pdf`);
};
