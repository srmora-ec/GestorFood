import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Plotly from 'plotly.js-dist';
import API_URL from '../config.js';
const GenerarReportePDF = ({ empresaInfo, logoEmpresa, empleadosData, selectedSucursal, selectedTipoEmpleado, selectedReport,
  facturasEmitidas, clientes, productos, combos, sucursal, ventasmesero, setPdfBlob, handleShowViewer, selectedVenta, dateRange,
  selectedMesero, selectedProducto, selectedTipoProducto, pagos, reverso, selectedMesName, meseroData }) => {
  console.log(dateRange);
  const generarReportePDF = () => {
    const doc = new jsPDF();

    function drawPageDesign() {
      const topRectY = 0;
      const bottomRectY = doc.internal.pageSize.getHeight() - 20;
      const rectWidth = doc.internal.pageSize.getWidth();
      const rectHeight = 30;
      const rectHeighty = 20;

      doc.setFillColor(194, 18, 18);

      doc.rect(0, topRectY, rectWidth, rectHeight, 'F');
      doc.rect(0, bottomRectY, rectWidth, rectHeighty, 'F');

      if (logoEmpresa) {
        const logo = new Image();
        logo.src = logoEmpresa;
        const logoWidth = 30;
        const logoX = 5;
        const logoY = 0;
        doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoWidth);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.text(`${empresaInfo.enombre}`, 35, 12);
      doc.setFontSize(12);
      doc.text(`${empresaInfo.direccion}`, 35, 17);
      doc.setFontSize(11);
      doc.text(`${empresaInfo.etelefono}`, 35, 22);
      doc.setFontSize(12);

      const fechaHoraEmision = new Date().toLocaleString();
      const pageWidth = doc.internal.pageSize.getWidth();
      const fontSize = 10;
      const fechaTextWidth = doc.getStringUnitWidth(`Fecha y hora de emisión: ${fechaHoraEmision}`) * fontSize / doc.internal.scaleFactor;
      const xPosition = pageWidth - fechaTextWidth - 10;
      const yPosition = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(fontSize);
      doc.setTextColor(255, 255, 255);
      doc.text(`Fecha y hora de emisión: ${fechaHoraEmision}`, xPosition, yPosition);
    }
    // Dibujar el diseño en la primera página
    drawPageDesign();
    doc.setTextColor(0, 0, 0);

    if (selectedReport === 'empleados') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Empleados', 8, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);
      doc.text(`Datos filtrados por sucursal "${selectedSucursal}" y tipos de empleados "${selectedTipoEmpleado}"`, 8, 47);

      const headers = ['Nombre', 'Apellido', 'Teléfono', 'Ciudad', 'Fecha', 'Sucursal', 'Tipo'];
      const data = empleadosData.map(empleado => [
        empleado.nombre,
        empleado.apellido,
        empleado.telefono,
        empleado.ciudad,
        empleado.fecha,
        empleado.sucursal,
        empleado.tipo_empleado
      ]);

      // Calcular el total de empleados
      const totalEmpleados = data.length;

      doc.autoTable({
        startY: 53,
        head: [headers],
        body: data,
        margin: { left: 8, right: 8 },
      });

      doc.setFont("helvetica", "bold");
      doc.text('Total de Empleados:', 8, doc.lastAutoTable.finalY + 10);
      doc.text(totalEmpleados.toString(), 45, doc.lastAutoTable.finalY + 10);

      // Establecer el nombre del documento PDF
      doc.setProperties({
        title: 'Reporte de Empleados',
        author: 'Hamburguesas al carbón',
        subject: 'Reporte de empleados generado',
        creator: 'Hamburguesas al carbón'
      });

      // Generar el PDF
      const pdfBlob = doc.output('blob');

      // Pasar el objeto Blob al visor
      setPdfBlob(pdfBlob);
      handleShowViewer();
    }

    if (selectedReport === 'facturas') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Facturas Emitidas', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      const headers = ['Código', 'Cliente', 'Fecha Emisión', 'Mesero', 'Total', 'IVA', 'Descuento', 'Subtotal', 'Pagar'];
      let data = [];

      if (dateRange && dateRange.length >= 2) {
        // Filtrar las facturas por rango de fechas
        data = facturasEmitidas.filter(factura => {
          const fechaEmision = new Date(factura.fecha_emision);
          const fechaDesde = new Date(dateRange[0]);
          const fechaHasta = new Date(dateRange[1]);

          // Ajustar la comparación para incluir el límite superior del rango
          return fechaEmision >= fechaDesde && fechaEmision <= new Date(fechaHasta.setDate(fechaHasta.getDate() + 1));
        }).map(factura => [
          factura.codigo_factura,
          factura.cliente_completo,
          factura.fecha_emision,
          factura.mesero_completo,
          factura.total,
          factura.iva,
          factura.descuento,
          factura.subtotal,
          factura.a_pagar,
        ]);
      } else {
        // Mostrar todas las facturas sin filtrar por rango de fechas
        data = facturasEmitidas.map(factura => [
          factura.codigo_factura,
          factura.cliente_completo,
          factura.fecha_emision,
          factura.mesero_completo,
          factura.total,
          factura.iva,
          factura.descuento,
          factura.subtotal,
          factura.a_pagar,
        ]);
      }

      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 10, right: 10 },
      });
      // Establecer el nombre del documento PDF
      doc.setProperties({
        title: 'Reporte de Facturas',
        author: 'Hamburguesas al carbón',
        subject: 'Reporte de facturas generado',
        creator: 'Hamburguesas al carbón'
      });

      // Generar el PDF
      const pdfBlob = doc.output('blob');

      // Pasar el objeto Blob al visor
      setPdfBlob(pdfBlob);
      handleShowViewer();
    }

    if (selectedReport === 'clientes') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Clientes', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombres', 'RUC/Cédula', 'Teléfono', 'Puntos', 'Registro'];
      let data = [];
      if (dateRange && dateRange.length === 1) {
        const fechaSeleccionada = new Date(dateRange[0]);
        const mesSeleccionado = fechaSeleccionada.getMonth(); 
        const añoSeleccionado = fechaSeleccionada.getFullYear(); 
        const filteredData = clientes.filter(cliente => {
          const fechaRegistro = new Date(cliente.cregistro);
          return fechaRegistro.getMonth() === mesSeleccionado && fechaRegistro.getFullYear() === añoSeleccionado;
        });
      
        if (filteredData.length === 0) {
          doc.text('No hay clientes en el mes seleccionado.', 10, 48);
        } else {
          const data = filteredData.map(cliente => [
            cliente.id_cliente,
            cliente.nombre,
            cliente.ruc_cedula,
            cliente.ctelefono,
            cliente.cpuntos,
            cliente.cregistro
          ]);
      
          doc.autoTable({
            startY: 48,
            head: [headers],
            body: data,
            margin: { left: 10, right: 10 }
          });
      
          doc.setProperties({
            title: 'Reporte de Clientes',
            author: 'Hamburguesas al carbón',
            subject: 'Reporte de clientes generado',
            creator: 'Hamburguesas al carbón'
          });
      
          const pdfBlob = doc.output('blob');
          setPdfBlob(pdfBlob);
          handleShowViewer();
        }
      } else if (dateRange && dateRange.length >= 2) {
        const data = clientes.filter(cliente => {
          const fechaRegistro = new Date(cliente.cregistro);
          const fechaDesde = new Date(dateRange[0]);
          const fechaHasta = new Date(dateRange[1]);
          fechaHasta.setDate(fechaHasta.getDate() + 1); // Incluir el último día del rango
          return fechaRegistro >= fechaDesde && fechaRegistro < fechaHasta;
        }).map(cliente => [
          cliente.id_cliente,
          cliente.nombre,
          cliente.ruc_cedula,
          cliente.ctelefono,
          cliente.cpuntos,
          cliente.cregistro
        ]);
      
        if (data.length === 0) {
          doc.text('No hay clientes en el rango de fechas seleccionado.', 10, 48);
        } else {
          doc.autoTable({
            startY: 48,
            head: [headers],
            body: data,
            margin: { left: 10, right: 10 }
          });
      
          doc.setProperties({
            title: 'Reporte de Clientes',
            author: 'Hamburguesas al carbón',
            subject: 'Reporte de clientes generado',
            creator: 'Hamburguesas al carbón'
          });
      
          const pdfBlob = doc.output('blob');
          setPdfBlob(pdfBlob);
          handleShowViewer();
        }
      } else {
        data = clientes.map(cliente => [
          cliente.id_cliente,
          cliente.nombre,
          cliente.ruc_cedula,
          cliente.ctelefono,
          cliente.cpuntos,
          cliente.cregistro
        ]);
        doc.autoTable({
          startY: 48,
          head: [headers],
          body: data,
          margin: { left: 10, right: 10 }
        });
    
        doc.setProperties({
          title: 'Reporte de Clientes',
          author: 'Hamburguesas al carbón',
          subject: 'Reporte de clientes generado',
          creator: 'Hamburguesas al carbón'
        });
    
        const pdfBlob = doc.output('blob');
        setPdfBlob(pdfBlob);
        handleShowViewer();
      }
    }

    if (selectedReport === 'productos') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Productos', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);


      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombre', 'Categoría', 'Precio', 'Puntos'];

      // Transformar los datos de clientes en un array bidimensional para la tabla
      const data = productos.map(productos => [
        productos.id_producto,
        productos.nombreproducto,
        productos.catnombre,
        productos.preciounitario,
        productos.puntosp,
      ]);

      // Añadir la tabla de clientes al PDF
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 10, right: 10 },
      });
      // Establecer el nombre del documento PDF
      doc.setProperties({
        title: 'Reporte de Productos',
        author: 'Hamburguesas al carbón',
        subject: 'Reporte de productos generado',
        creator: 'Hamburguesas al carbón'
      });

      // Generar el PDF
      const pdfBlob = doc.output('blob');

      // Pasar el objeto Blob al visor
      setPdfBlob(pdfBlob);
      handleShowViewer();
    }

    if (selectedReport === 'combos') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Combos', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);


      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombre', 'Categoría', 'Precio', 'Puntos'];

      // Transformar los datos de clientes en un array bidimensional para la tabla
      const data = combos.map(combos => [
        combos.id_combo,
        combos.nombrecb,
        combos.nombrecat,
        combos.preciounitario,
        combos.puntos,
      ]);
      // Añadir la tabla de clientes al PDF
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 10, right: 10 },
      });
      // Establecer el nombre del documento PDF
      doc.setProperties({
        title: 'Reporte de Combos',
        author: 'Hamburguesas al carbón',
        subject: 'Reporte de combos generado',
        creator: 'Hamburguesas al carbón'
      });

      // Generar el PDF
      const pdfBlob = doc.output('blob');

      // Pasar el objeto Blob al visor
      setPdfBlob(pdfBlob);
      handleShowViewer();
    }

    if (selectedReport === 'sucursal') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Sucursales', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombre', 'Apertura', 'Estado', 'Teléfono', 'Empleados'];

      // Transformar los datos de clientes en un array bidimensional para la tabla
      const data = sucursal.map(sucursal => [
        sucursal.id_sucursal,
        sucursal.snombre,
        sucursal.fsapertura,
        sucursal.sestado === '1' ? 'Activo' : 'No Activo',
        sucursal.sdireccion,
        sucursal.cantidadempleados,
      ]);

      // Calcular el total de empleados de todas las sucursales
      const totalEmpleados = data.reduce((total, current) => total + current[5], 0);

      // Añadir la tabla de clientes al PDF
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 18, right: 18 },
      });

      const finalY = doc.lastAutoTable.finalY || 48;

      doc.setFont("helvetica", "bold");
      doc.text('Total de empleados:', 150, finalY + 10); // Alineado a la derecha
      doc.text(totalEmpleados.toString(), 187, finalY + 10); // Alineado a la derecha

      // Establecer el nombre del documento PDF
      doc.setProperties({
        title: 'Reporte de Sucursal',
        author: 'Hamburguesas al carbón',
        subject: 'Reporte de sucursal generado',
        creator: 'Hamburguesas al carbón'
      });

      // Generar el PDF
      const pdfBlob = doc.output('blob');

      // Pasar el objeto Blob al visor
      setPdfBlob(pdfBlob);
      handleShowViewer();
    }

    if (selectedReport === 'venta') {
      if (selectedVenta === 'mesero') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Meseros', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['CodCliente', 'Nombres', 'Fecha Pedido', 'Método de pago', 'Mesero', 'CodVenta', 'Precio'];
        const metodoPagoMap = {
          'E': 'Efectivo',
          'T': 'Transferencia',
          'F': 'Fraccionado',
        };

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas del empleado en el rango de fechas seleccionado.', 10, 48);
          } else {
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por el mesero "${selectedMesero}"`, 10, 48);
            const data = filteredData.map(venta => [
              venta.cliente.id_cliente,
              `${venta.cliente.snombre || ''} ${venta.cliente.capellido || ''}`,
              venta.fecha_pedido,
              metodoPagoMap[venta.metodo_de_pago],
              venta.nombre_mesero,
              venta.id_pedido,
              venta.precio,
            ]);

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 8, right: 8 },
            });

            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);

            // Agregar una nueva página
            doc.addPage();

            // Dibujar el diseño en la segunda página
            drawPageDesign();

            // Crear el elemento canvas para Plotly.js
            const canvas = document.createElement('canvas');
            canvas.id = 'myChart';
            canvas.width = 400;
            canvas.height = 200;

            // Agregar el elemento canvas al cuerpo del documento
            document.body.appendChild(canvas);

            // Crear el elemento canvas para el gráfico de pastel
            const canvasPieChart = document.createElement('canvas');
            canvasPieChart.id = 'myPieChart';
            canvasPieChart.width = 400;
            canvasPieChart.height = 200;

            // Agregar el elemento canvas del gráfico de pastel al cuerpo del documento
            document.body.appendChild(canvasPieChart);

            // Calcular la venta total de cada mesero
            const ventasTotalesPorMesero = ventasmesero.reduce((acc, venta) => {
              if (!acc[venta.nombre_mesero]) {
                acc[venta.nombre_mesero] = 0;
              }
              acc[venta.nombre_mesero] += parseFloat(venta.precio);
              return acc;
            }, {});

            // Obtener los nombres de los meseros y sus ventas totales
            const meseros = Object.keys(ventasTotalesPorMesero);
            const ventasTotales = Object.values(ventasTotalesPorMesero);

            // Colores para las barras
            const colores = [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(255, 102, 102)',
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
            ];

            // Obtener los datos para el gráfico Plotly.js
            const plotData = {
              x: meseros,
              y: ventasTotales,
              type: 'bar',
              marker: {
                color: colores,
                width: 0.3
              },
              text: ventasTotales.map(total => `$${total.toFixed(2)}`),
              textposition: 'auto',
              textfont: {
                color: 'black'
              }
            };

            // Obtener los datos para el gráfico de pastel Plotly.js
            const plotDataPastel = {
              values: ventasTotales,
              labels: meseros,
              type: 'pie',
              textinfo: 'percent',
              insidetextfont: {
                color: 'white'
              },
              marker: {
                colors: colores
              }
            };


            // Configuración del diseño
            const layout = {
              title: 'Ventas por mesero',
              xaxis: {
                title: 'Mesero',
                tickfont: {
                  color: 'black'
                },
                linecolor: 'black'
              },
              yaxis: {
                title: 'Ventas',
                tickfont: {
                  color: 'black'
                },
              },
              font: {
                color: 'black'
              },
              barmode: 'group',
              bargap: 0.2
            };

            // Generar el gráfico de barras en la primera mitad de la página
            Plotly.newPlot('myChart', [plotData], layout)
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 600, height: 500 });
              })
              .then(function (barChartUrl) {
                // Agregar el gráfico de barras al PDF
                doc.addImage(barChartUrl, 'PNG', 10, 40, 150, 110);
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de barras:', error);
              });


            // Generar el gráfico de pastel en la segunda mitad de la página
            Plotly.newPlot('myPieChart', [plotDataPastel])
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 600, height: 500 });
              })
              .then(function (pieChartUrl) {
                // Agregar el gráfico de pastel al PDF
                doc.addImage(pieChartUrl, 'PNG', 10, 150, 150, 110);
                // Establecer el nombre del documento PDF
                doc.setProperties({
                  title: 'Reporte de Ventas Mesero',
                  author: 'Hamburguesas al carbón',
                  subject: 'Reporte de ventas mesero generado',
                  creator: 'Hamburguesas al carbón'
                });

                // Generar el PDF
                const pdfBlob = doc.output('blob');

                // Pasar el objeto Blob al visor
                setPdfBlob(pdfBlob);
                handleShowViewer();
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de pastel:', error);
              });
          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }

      if (selectedVenta === 'sucursal') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Sucursales', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['Cliente', 'Fecha Pedido', 'Método de pago', 'Mesero', 'Sucursal', 'CodVenta', 'Precio'];

        const metodoPagoMap = {
          'E': 'Efectivo',
          'T': 'Transferencia',
          'F': 'Fraccionado',
        };

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas de la sucursal en el rango de fechas seleccionado.', 10, 48);
          } else {
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por la sucursal "${selectedSucursal}"`, 10, 48);
            const data = filteredData.map(venta => [
              `${venta.cliente.snombre || ''} ${venta.cliente.capellido || ''}`,
              venta.fecha_pedido,
              metodoPagoMap[venta.metodo_de_pago],
              venta.mesero ? `${venta.mesero.nombre} ${venta.mesero.apellido}` : 'App',
              venta.nombre_sucursal,
              venta.id_pedido,
              venta.precio,
            ]);

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 8, right: 8 },
            });
            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);

            // Agregar una nueva página
            doc.addPage();

            // Dibujar el diseño en la segunda página
            drawPageDesign();

            // Crear el elemento canvas para Plotly.js
            const canvas = document.createElement('canvas');
            canvas.id = 'myChart';
            canvas.width = 400;
            canvas.height = 200;

            // Agregar el elemento canvas al cuerpo del documento
            document.body.appendChild(canvas);

            // Crear el elemento canvas para el gráfico de pastel
            const canvasPieChart = document.createElement('canvas');
            canvasPieChart.id = 'myPieChart';
            canvasPieChart.width = 400;
            canvasPieChart.height = 200;

            // Agregar el elemento canvas del gráfico de pastel al cuerpo del documento
            document.body.appendChild(canvasPieChart);

            // Calcular la venta total de cada mesero
            const ventasTotalesPorSucursal = ventasmesero.reduce((acc, venta) => {
              if (!acc[venta.nombre_sucursal]) {
                acc[venta.nombre_sucursal] = 0;
              }
              acc[venta.nombre_sucursal] += parseFloat(venta.precio);
              return acc;
            }, {});

            // Obtener los nombres de los meseros y sus ventas totales
            const sucursales = Object.keys(ventasTotalesPorSucursal);
            const ventasTotales = Object.values(ventasTotalesPorSucursal);

            // Colores para las barras
            const colores = ['rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)'];

            // Obtener los datos para el gráfico Plotly.js
            const plotData = {
              x: sucursales,
              y: ventasTotales,
              type: 'bar',
              marker: {
                color: colores,
                width: 0.3
              },
              text: ventasTotales.map(total => `$${total.toFixed(2)}`),
              textposition: 'auto',
              textfont: {
                color: 'black'
              }
            };

            // Obtener los datos para el gráfico de pastel Plotly.js
            const plotDataPastel = {
              values: ventasTotales,
              labels: sucursales,
              type: 'pie',
              textinfo: 'percent',
              insidetextfont: {
                color: 'white'
              },
              marker: {
                colors: colores
              }
            };

            // Configuración del diseño
            const layout = {
              title: 'Ventas por sucursales',
              xaxis: {
                title: 'Sucursales',
                tickfont: {
                  color: 'black'
                },
                linecolor: 'black'
              },
              yaxis: {
                title: 'Ventas',
                tickfont: {
                  color: 'black'
                },
              },
              font: {
                color: 'black'
              },
              barmode: 'group',
              bargap: 0.2
            };

            // Generar el gráfico de barras en la primera mitad de la página
            Plotly.newPlot('myChart', [plotData], layout)
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 600, height: 500 });
              })
              .then(function (barChartUrl) {
                // Agregar el gráfico de barras al PDF
                doc.addImage(barChartUrl, 'PNG', 10, 40, 150, 110);
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de barras:', error);
              });


            // Generar el gráfico de pastel en la segunda mitad de la página
            Plotly.newPlot('myPieChart', [plotDataPastel])
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 600, height: 500 });
              })
              .then(function (pieChartUrl) {
                // Agregar el gráfico de pastel al PDF
                doc.addImage(pieChartUrl, 'PNG', 10, 150, 150, 110);

                doc.setProperties({
                  title: 'Reporte de Ventas Sucursal',
                  author: 'Hamburguesas al carbón',
                  subject: 'Reporte de ventas sucursal generado',
                  creator: 'Hamburguesas al carbón'
                });

                // Generar el PDF
                const pdfBlob = doc.output('blob');

                // Pasar el objeto Blob al visor
                setPdfBlob(pdfBlob);
                handleShowViewer();
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de pastel:', error);
              });
          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }
      if (selectedVenta === 'productos') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Producto', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['CodVenta', 'Fecha Pedido', 'Detalle de Pedido', 'Empleado', 'Precio'];

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas del producto en el rango de fechas seleccionado.', 10, 48);
          } else {
            const data = [];
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por el producto "${selectedProducto}"`, 10, 48);
            filteredData.forEach(venta => {
              const detalle_pedido = venta.detalle_pedido.map(detalle => `${detalle.nombreproducto} (${detalle.cantidad})`).join('\n');
              data.push([
                venta.id_pedido,
                venta.fecha_pedido,
                detalle_pedido,
                venta.mesero ? `${venta.mesero.nombre} ${venta.mesero.apellido}` : 'App',
                venta.precio,
              ]);
            });

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 15, right: 15 },
            });

            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);

            // Agregar una nueva página
            doc.addPage();

            // Dibujar el diseño en la segunda página
            drawPageDesign();

            // Crear el elemento canvas para Plotly.js
            const canvas = document.createElement('canvas');
            canvas.id = 'myChart';
            canvas.width = 400;
            canvas.height = 200;

            // Agregar el elemento canvas al cuerpo del documento
            document.body.appendChild(canvas);

            // Crear el elemento canvas para el gráfico de pastel
            const canvasPieChart = document.createElement('canvas');
            canvasPieChart.id = 'myPieChart';
            canvasPieChart.width = 400;
            canvasPieChart.height = 200;

            // Agregar el elemento canvas del gráfico de pastel al cuerpo del documento
            document.body.appendChild(canvasPieChart);

            // Calcular la venta total de cada mesero
            const ventasTotalesProducto = ventasmesero.reduce((acc, venta) => {
              if (!acc[venta.nombre]) {
                acc[venta.nombre] = 0;
              }
              acc[venta.nombre] += parseFloat(venta.precio);
              return acc;
            }, {});

            // Obtener los nombres de los meseros y sus ventas totales
            const productos = Object.keys(ventasTotalesProducto);
            const ventasTotales = Object.values(ventasTotalesProducto);

            // Colores para las barras
            const colores = [
              'rgb(102, 204, 255)',
              'rgb(0, 204, 102)',
              'rgb(255, 99, 132)',
              'rgb(255, 204, 153)',
              'rgb(153, 102, 255)',
              'rgb(255, 102, 102)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(255, 159, 64)',
            ];

            // Obtener los datos para el gráfico Plotly.js
            const plotData = {
              x: productos,
              y: ventasTotales,
              type: 'bar',
              marker: {
                color: colores,
                width: 0.3
              },
              text: ventasTotales.map(total => `$${total.toFixed(2)}`),
              textposition: 'auto',
              textfont: {
                color: 'black'
              }
            };

            // Obtener los datos para el gráfico de pastel Plotly.js
            const plotDataPastel = {
              values: ventasTotales,
              labels: productos,
              type: 'pie',
              textinfo: 'percent',
              insidetextfont: {
                color: 'white'
              },
              marker: {
                colors: colores
              }
            };

            // Configuración del diseño
            const layout = {
              title: 'Ventas por Productos',
              xaxis: {
                title: 'Productos',
                tickfont: {
                  color: 'black'
                },
                linecolor: 'black'
              },
              yaxis: {
                title: 'Ventas',
                tickfont: {
                  color: 'black'
                },
              },
              font: {
                color: 'black'
              },
              barmode: 'group',
              bargap: 0.2
            };

            // Generar el gráfico de barras en la primera mitad de la página
            Plotly.newPlot('myChart', [plotData], layout)
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 1200, height: 500 });
              })
              .then(function (barChartUrl) {
                // Agregar el gráfico de barras al PDF
                doc.addImage(barChartUrl, 'PNG', 10, 40, 150, 110);
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de barras:', error);
              });


            // Generar el gráfico de pastel en la segunda mitad de la página
            Plotly.newPlot('myPieChart', [plotDataPastel])
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 600, height: 500 });
              })
              .then(function (pieChartUrl) {
                // Agregar el gráfico de pastel al PDF
                doc.addImage(pieChartUrl, 'PNG', 10, 150, 150, 110);

                doc.setProperties({
                  title: 'Reporte de Ventas Productos',
                  author: 'Hamburguesas al carbón',
                  subject: 'Reporte de ventas productos generado',
                  creator: 'Hamburguesas al carbón'
                });

                // Generar el PDF
                const pdfBlob = doc.output('blob');

                // Pasar el objeto Blob al visor
                setPdfBlob(pdfBlob);
                handleShowViewer();
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de pastel:', error);
              });
          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }
      if (selectedVenta === 'tipoproducto') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Tipo de Producto', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['CodVenta', 'Fecha Pedido', 'Tipo', 'Detalle de Pedido', 'Empleado', 'Precio'];

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas del tipo de producto en el rango de fechas seleccionado.', 10, 48);
          } else {
            const data = [];
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por el tipo de producto "${selectedTipoProducto}"`, 10, 48);
            filteredData.forEach(venta => {
              const detalle_pedido = venta.detalle_pedido.map(detalle => `${detalle.nombreproducto} (${detalle.cantidad})`).join('\n');
              data.push([
                venta.id_pedido,
                venta.fecha_pedido,
                venta.nombretp,
                detalle_pedido,
                venta.mesero ? `${venta.mesero.nombre} ${venta.mesero.apellido}` : 'App',
                venta.precio,
              ]);
            });

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 8, right: 8 },
            });

            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);

            // Agregar una nueva página
            doc.addPage();

            // Dibujar el diseño en la segunda página
            drawPageDesign();

            // Crear el elemento canvas para Plotly.js
            const canvas = document.createElement('canvas');
            canvas.id = 'myChart';
            canvas.width = 400;
            canvas.height = 200;

            // Agregar el elemento canvas al cuerpo del documento
            document.body.appendChild(canvas);

            // Crear el elemento canvas para el gráfico de pastel
            const canvasPieChart = document.createElement('canvas');
            canvasPieChart.id = 'myPieChart';
            canvasPieChart.width = 400;
            canvasPieChart.height = 200;

            // Agregar el elemento canvas del gráfico de pastel al cuerpo del documento
            document.body.appendChild(canvasPieChart);

            // Calcular la venta total de cada mesero
            const ventasTotalesPorTipo = ventasmesero.reduce((acc, venta) => {
              if (!acc[venta.nombretp]) {
                acc[venta.nombretp] = 0;
              }
              acc[venta.nombretp] += parseFloat(venta.precio);
              return acc;
            }, {});

            // Obtener los nombres de los meseros y sus ventas totales
            const tipo = Object.keys(ventasTotalesPorTipo);
            const ventasTotales = Object.values(ventasTotalesPorTipo);

            // Colores para las barras
            const colores = [
              'rgb(153, 102, 255)',
              'rgb(0, 204, 102)',
              'rgb(255, 102, 102)',
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(255, 159, 64)',
              'rgb(102, 204, 255)',
              'rgb(255, 204, 153)',
            ];

            // Obtener los datos para el gráfico Plotly.js
            const plotData = {
              x: tipo,
              y: ventasTotales,
              type: 'bar',
              marker: {
                color: colores,
                width: 0.3
              },
              text: ventasTotales.map(total => `$${total.toFixed(2)}`),
              textposition: 'auto',
              textfont: {
                color: 'black'
              }
            };

            // Obtener los datos para el gráfico de pastel Plotly.js
            const plotDataPastel = {
              values: ventasTotales,
              labels: tipo,
              type: 'pie',
              textinfo: 'percent',
              insidetextfont: {
                color: 'white'
              },
              marker: {
                colors: colores
              }
            };

            // Configuración del diseño
            const layout = {
              title: 'Ventas por Tipos de Productos',
              xaxis: {
                title: 'Tipos',
                tickfont: {
                  color: 'black'
                },
                linecolor: 'black'
              },
              yaxis: {
                title: 'Ventas',
                tickfont: {
                  color: 'black'
                },
              },
              font: {
                color: 'black'
              },
              barmode: 'group',
              bargap: 0.2
            };

            // Generar el gráfico de barras en la primera mitad de la página
            Plotly.newPlot('myChart', [plotData], layout)
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 600, height: 500 });
              })
              .then(function (barChartUrl) {
                // Agregar el gráfico de barras al PDF
                doc.addImage(barChartUrl, 'PNG', 10, 40, 150, 110);
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de barras:', error);
              });


            // Generar el gráfico de pastel en la segunda mitad de la página
            Plotly.newPlot('myPieChart', [plotDataPastel])
              .then(function (gd) {
                // Convertir el gráfico en una imagen y obtener la URL
                return Plotly.toImage(gd, { format: 'png', width: 600, height: 500 });
              })
              .then(function (pieChartUrl) {
                // Agregar el gráfico de pastel al PDF
                doc.addImage(pieChartUrl, 'PNG', 10, 150, 150, 110);

                doc.setProperties({
                  title: 'Reporte de Ventas Tipo Producto',
                  author: 'Hamburguesas al carbón',
                  subject: 'Reporte de ventas tipo producto generado',
                  creator: 'Hamburguesas al carbón'
                });

                // Generar el PDF
                const pdfBlob = doc.output('blob');

                // Pasar el objeto Blob al visor
                setPdfBlob(pdfBlob);
                handleShowViewer();
              })
              .catch(function (error) {
                console.error('Error al generar el gráfico de pastel:', error);
              });
          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }
      if (selectedVenta === 'mes') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Mes y Año', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['CodVenta', 'Fecha Pedido', 'Detalle de Pedido', 'Precio', 'Empleado'];

        if (ventasmesero.length === 0) {
          doc.text('No hay ventas del tipo de producto en el rango de fechas seleccionado.', 10, 48);
        } else {
          const data = [];
          doc.setFontSize(10);
          doc.text(`Ventas filtradas por mes y año "${selectedMesName}"`, 10, 48);
          ventasmesero.forEach(venta => {
            const detalle_pedido = venta.detalle_pedido.map(detalle => `${detalle.nombreproducto} (${detalle.cantidad})`).join('\n');
            data.push([
              venta.id_pedido,
              venta.fecha_pedido,
              detalle_pedido,
              venta.precio,
              venta.nombre_mesero,
            ]);
          });

          doc.autoTable({
            startY: 53,
            head: [headers],
            body: data,
            margin: { left: 8, right: 8 },
          });

          // Calcular la suma de los precios de las ventas
          const totalVenta = ventasmesero.reduce((total, venta) => total + parseFloat(venta.precio), 0);

          // Obtener el ancho del documento
          const docWidth = doc.internal.pageSize.width;

          // Obtener el ancho del texto
          const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

          // Colocar el texto a mano derecha
          doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);

          doc.setProperties({
            title: 'Reporte de Ventas Mes',
            author: 'Hamburguesas al carbón',
            subject: 'Reporte de ventas mes generado',
            creator: 'Hamburguesas al carbón'
          });

          // Generar el PDF
          const pdfBlob = doc.output('blob');

          // Pasar el objeto Blob al visor
          setPdfBlob(pdfBlob);
          handleShowViewer();
        }
      }
    }
    if (selectedReport === 'pagos') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Pagos', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      // Cabeceras para la tabla de pagos
      const headers = ['ID Pago', 'ID Empleado', 'Nombre', 'Cantidad', 'Tipo de Pago', 'ID Periodo', 'Hora de Pago'];
      const metodoPagoMap = {
        'S': 'Semanal',
        'H': 'Hora',
        'M': 'Mensual',
        'T': 'Trimestral',
      };
      let data = [];

      if (dateRange && dateRange.length === 1) {
        const fechaSeleccionada = new Date(dateRange[0]);
        const mesSeleccionado = fechaSeleccionada.getMonth(); // Obtener el mes seleccionado (0 para enero, 1 para febrero, etc.)
        const añoSeleccionado = fechaSeleccionada.getFullYear(); // Obtener el año seleccionado
        const filteredData = pagos.filter(pago => {
          const fechaPago = new Date(pago.horadepago);
          return fechaPago.getMonth() === mesSeleccionado && fechaPago.getFullYear() === añoSeleccionado;
        });

        if (filteredData.length === 0) {
          doc.text('No hay pagos en el mes seleccionado.', 10, 48);
        } else {
          const data = filteredData.map(pago => [
            pago.id_pago,
            pago.idempleado,
            pago.nombre,
            pago.cantidad,
            metodoPagoMap[pago.tipopago],
            pago.idperiodo,
            pago.horadepago
          ]);

          doc.autoTable({
            startY: 48,
            head: [headers],
            body: data,
            margin: { left: 8, right: 8 },
          });

          doc.setProperties({
            title: 'Reporte de Pagos',
            author: 'Hamburguesas al carbón',
            subject: 'Reporte de pagos generado',
            creator: 'Hamburguesas al carbón'
          });

          const pdfBlob = doc.output('blob');
          setPdfBlob(pdfBlob);
          handleShowViewer();
        }
      } else if (dateRange && dateRange.length >= 2) {
        const data = pagos.filter(pago => {
          const fechaPago = new Date(pago.horadepago);
          const fechaDesde = new Date(dateRange[0]);
          const fechaHasta = new Date(dateRange[1]);
          fechaHasta.setDate(fechaHasta.getDate() + 1); // Incluir el último día del rango
          return fechaPago >= fechaDesde && fechaPago <= new Date(fechaHasta.setDate(fechaHasta.getDate() + 1));
        }).map(pago => [
          pago.id_pago,
          pago.idempleado,
          pago.nombre,
          pago.cantidad,
          metodoPagoMap[pago.tipopago],
          pago.idperiodo,
          pago.horadepago
        ]);

        if (data.length === 0) {
          doc.text('No hay pagos en el rango de fechas seleccionado.', 10, 48);
        } else {
          doc.autoTable({
            startY: 48,
            head: [headers],
            body: data,
            margin: { left: 8, right: 8 },
          });

          doc.setProperties({
            title: 'Reporte de Pagos',
            author: 'Hamburguesas al carbón',
            subject: 'Reporte de pagos generado',
            creator: 'Hamburguesas al carbón'
          });

          const pdfBlob = doc.output('blob');
          setPdfBlob(pdfBlob);
          handleShowViewer();
        }
      } else {
        data = pagos.map(pago => [
          pago.id_pago,
          pago.idempleado,
          pago.nombre,
          pago.cantidad,
          metodoPagoMap[pago.tipopago],
          pago.idperiodo,
          pago.horadepago
        ]);
        
        doc.autoTable({
          startY: 48,
          head: [headers],
          body: data,
          margin: { left: 8, right: 8 },
        });

        doc.setProperties({
          title: 'Reporte de Pagos',
          author: 'Hamburguesas al carbón',
          subject: 'Reporte de pagos generado',
          creator: 'Hamburguesas al carbón'
        });
    
        const pdfBlob = doc.output('blob');
        setPdfBlob(pdfBlob);
        handleShowViewer();
      }
    }

    if (selectedReport === 'reverso') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Reverso de Facturas', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      const headers = ['Num', 'Código Factura', 'Detalle del pedido', 'Total', 'Fecha Emisión', 'Fecha Reverso'];

      if (dateRange && dateRange.length >= 2) {
        const filteredData = reverso.filter(factura => {
          const fechaEmisionNotaCredito = new Date(factura.fecha_emision_nota_credito);
          const fechaDesde = new Date(dateRange[0]);
          const fechaHasta = new Date(dateRange[1]);

          // Ajustar la comparación para incluir el límite superior del rango
          return fechaEmisionNotaCredito >= fechaDesde && fechaEmisionNotaCredito <= new Date(fechaHasta.setDate(fechaHasta.getDate() + 1));
        });

        if (filteredData.length === 0) {
          doc.text('No hay reverso de facturas en el rango de fechas seleccionado.', 10, 48);
        } else {
          const data = [];
          filteredData.forEach(factura => {
            const detalle_pedido = factura.detalles_factura.map(detalle => `${detalle.nombre_producto} (${detalle.cantidad_entero})`).join('\n');
            data.push([
              factura.id_factura,
              factura.codigo_factura ? factura.codigo_factura : 'Factura no válida',
              detalle_pedido,
              factura.a_pagar,
              factura.fecha_emision,
              factura.fecha_emision_nota_credito,
            ]);
          });
          doc.autoTable({
            startY: 48,
            head: [headers],
            body: data,
            margin: { left: 8, right: 8 },
          });
          doc.setProperties({
            title: 'Reporte de Reverso',
            author: 'Hamburguesas al carbón',
            subject: 'Reporte de reverso generado',
            creator: 'Hamburguesas al carbón'
          });

          // Generar el PDF
          const pdfBlob = doc.output('blob');

          // Pasar el objeto Blob al visor
          setPdfBlob(pdfBlob);
          handleShowViewer();
        }
      } else {
        console.error('dateRange no está definido o no tiene al menos dos elementos.');
      }
    }

    if (selectedReport === 'top') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte Top Venta', 10, 40);
      doc.setFontSize(10);
      doc.text(`Mayores ventas por "${meseroData.nombre_mesero || meseroData.nombre_sucursal}" con un total de ${meseroData.total_ventas}`, 10, 48);
      doc.text(`${selectedMesName}`, 10, 54);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      const headers = ['CodVenta', 'Fecha Pedido', 'Detalle de Pedido', 'Total'];

      if (meseroData.pedidos.length > 0) {
        const data = [];
        meseroData.pedidos.forEach(pedido => {
          const detalle_pedido = pedido.detalle_pedido.map(detalle => `${detalle.nombreproducto} (${detalle.cantidad})`).join('\n');
          data.push([
            pedido.id_pedido,
            pedido.fecha_pedido,
            detalle_pedido,
            pedido.precio
          ]);
        });

        doc.autoTable({
          startY: 58,
          head: [headers],
          body: data,
          margin: { left: 15, right: 15 }
        });

        doc.setProperties({
          title: 'Reporte de Top Ventas',
          author: 'Hamburguesas al carbón',
          subject: 'Reporte de top generado',
          creator: 'Hamburguesas al carbón'
        });

        // Generar el PDF
        const pdfBlob = doc.output('blob');

        // Pasar el objeto Blob al visor
        setPdfBlob(pdfBlob);
        handleShowViewer();
      } else {
        doc.text('No hay pedidos para el mesero con mayor venta.', 10, 48);
      }
    }
  };
  generarReportePDF();
  return null;
};
export default GenerarReportePDF;