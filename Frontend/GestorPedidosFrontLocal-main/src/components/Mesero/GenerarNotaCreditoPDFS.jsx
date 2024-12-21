import React from 'react';
import { jsPDF } from 'jspdf';
import { Button } from 'antd';

const GenerarNotaCreditoPDF = ({ detalleFactura, detalleNotaCredito, empresaInfo, logoEmpresa }) => {
  const generarNotaCreditoPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Agregar logo de la empresa
    if (logoEmpresa) {
      const logoWidth = 30;
      const logoHeight = 30;
      doc.addImage(logoEmpresa, 'JPEG', 10, 10, logoWidth, logoHeight);
    }

    // Agregar detalles de la empresa
    if (empresaInfo) {
      doc.setFontSize(12);
      doc.text(`${empresaInfo.enombre}`, 45, 15);
      doc.setFontSize(10);
      doc.text(`${empresaInfo.direccion}`, 45, 20);
    }

    // Agregar detalles de la factura original
    if (detalleFactura) {
      doc.setFontSize(12);
      doc.text('Nota de Crédito', 10, 40);
      doc.setFontSize(10);
      doc.text(`Número de Factura: ${detalleFactura.codigo_factura}`, 10, 45);
      doc.text(`Fecha de Emisión: ${detalleFactura.fecha_emision}`, 10, 50);
      doc.text(`Cliente: ${detalleFactura.id_cliente}`, 10, 55);
    }

    // Agregar detalles de la nota de crédito
    if (detalleNotaCredito) {
      doc.text(`Fecha de Emisión de Nota de Crédito: ${detalleNotaCredito.fecha_emision}`, 10, 60);
      doc.text(`Motivo: ${detalleNotaCredito.motivo}`, 10, 65);
    }

    // Agregar tabla con productos o combos revertidos
    const startY = 75;
    const tableWidth = 180;
    const tableHeaders = ['Descripción', 'Cantidad', 'Precio', 'Total'];
    const columnWidths = [100, 20, 30, 30];

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    let currentY = startY;
    doc.line(10, currentY, 10 + tableWidth, currentY); // Línea superior de la tabla

    // Encabezados de la tabla
    let currentX = 10;
    tableHeaders.forEach((header, index) => {
      doc.text(header, currentX + 5, currentY + 5);
      currentX += columnWidths[index];
    });

    currentY += 10;
    doc.line(10, currentY, 10 + tableWidth, currentY); // Línea inferior de los encabezados

    // Agregar filas de productos o combos
    if (detalleFactura && detalleFactura.detalles_factura) {
      detalleFactura.detalles_factura.forEach((detalle) => {
        currentX = 10;
        const descripcion = detalle.nombre_producto || detalle.id_combo;
        const cantidad = detalle.cantidad;
        const precioUnitario = detalle.precio_unitario;
        const total = detalle.valor;

        doc.text(descripcion, currentX, currentY + 5);
        currentX += columnWidths[0];

        doc.text(cantidad, currentX + 5, currentY + 5);
        currentX += columnWidths[1];

        doc.text(precioUnitario, currentX + 5, currentY + 5);
        currentX += columnWidths[2];

        doc.text(total, currentX + 5, currentY + 5);
        currentX += columnWidths[3];

        currentY += 10;
      });
    }

    doc.line(10, currentY, 10 + tableWidth, currentY); // Línea inferior de la tabla

    // Agregar totales, descuentos, impuestos y valor final
    currentY += 10;
    doc.text(`Subtotal: ${detalleFactura.subtotal}`, 10, currentY);
    currentY += 5;
    doc.text(`IVA: ${detalleFactura.iva}`, 10, currentY);
    currentY += 5;
    doc.text(`Descuento: ${detalleFactura.descuento}`, 10, currentY);
    currentY += 5;
    doc.text(`Total: ${detalleFactura.a_pagar}`, 10, currentY);

    // Agregar espacios para firmas
    currentY += 20;
    doc.line(10, currentY, 60, currentY); // Línea para firma autorizada
    doc.text('Firma Autorizada', 10, currentY + 5);

    currentY += 15;
    doc.line(10, currentY, 60, currentY); // Línea para firma del cliente
    doc.text('Firma Cliente', 10, currentY + 5);

    return doc.output('datauristring');
  };

  return generarDatosPDF();
};

export default GenerarNotaCreditoPDF;