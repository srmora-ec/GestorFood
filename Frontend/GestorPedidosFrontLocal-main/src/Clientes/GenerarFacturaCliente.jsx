import { jsPDF } from "jspdf";


const GenerarFacturaPDF = ({
  empresaInfo,
  logoEmpresa,
  facturaData,
  clienteData,
  productos,
  combos,
  obtenerTipoDePedido,
  obtenerMetodoDePago,
}) => {
  const generarPDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: [215, 150], // Ancho: 21.5 cm, Alto: 15 cm
    });

    // Definir diseño para el rollo de factura
    const marginLeft = 10; // Margen izquierdo
    const marginTop = 7; // Margen superior

    // Función para agregar un nuevo elemento de factura al documento
    const agregarElementoFactura = (texto, x, y) => {
      doc.text(texto, x, y);
    };

    // Definir coordenadas y dimensiones de las franjas
    const topRectY = 0; // Coordenada Y de la franja superior
    const bottomRectY = doc.internal.pageSize.getHeight() - 20; // Coordenada Y de la franja inferior
    const rectWidths = doc.internal.pageSize.getWidth(); // Ancho de la franja es igual al ancho de la página
    const rectHeights = 30; // Altura de las franjas

    doc.setFillColor(194, 18, 18); // Rojo: RGB(255, 0, 0)

    // Dibujar franja superior
    doc.rect(0, topRectY, rectWidths, rectHeights, "F");

    // Dibujar franja inferior
    doc.rect(0, bottomRectY, rectWidths, rectHeights, "F");

    // Agregar logo y nombre de la empresa
    if (empresaInfo && empresaInfo.enombre && logoEmpresa) {
      const logoWidth = 30; // Ajusta este valor para cambiar el ancho del logo
      const logoHeight = 30; // Ajusta este valor para cambiar la altura del logo
      const logoX = 3; // Nueva coordenada X para el logo (ajusta según sea necesario)
      const newMarginTop = 2; // Nuevo valor para el margen superior
      const logoY = newMarginTop + logoHeight / 2; // Nueva coordenada Y para el logo
      doc.addImage(
        logoEmpresa,
        "JPEG",
        logoX,
        newMarginTop, // Ajustar el margen superior para el logo
        logoWidth,
        logoHeight
      );

      // Establecer un tamaño de fuente más grande para el logo y el nombre de la empresa
      const fontSizeLogoEmpresa = 20; // Tamaño de fuente para el logo y el nombre de la empresa
      doc.setFontSize(fontSizeLogoEmpresa);

      // Calcular la posición para centrar verticalmente el nombre de la empresa
      const totalLineHeight = 12; // Altura total del texto en una línea
      const startY = logoY - totalLineHeight / 2;

      // Calcular la posición horizontal para centrar el nombre de la empresa
      const nombreEmpresaWidth =
        (doc.getStringUnitWidth(empresaInfo.enombre) * 14) /
        doc.internal.scaleFactor; // Ancho del nombre de la empresa
      const nombreEmpresaX = logoX + logoWidth + 20 - nombreEmpresaWidth / 2;

      // Resto del código para agregar el nombre de la empresa
      doc.text(empresaInfo.enombre, nombreEmpresaX, startY);

      // Restaurar el tamaño de fuente para el resto del documento
      doc.setFontSize(16); // Tamaño de fuente para el resto del documento
    }

    // Agregar dirección de la empresa
    if (empresaInfo && empresaInfo.direccion) {
      const direccion = empresaInfo.direccion;
      const direccionY = marginTop + 8; // Ajusta la posición vertical según sea necesario
      const fontSizeOriginal = doc.internal.getFontSize(); // Guardar el tamaño de fuente original
      const fontSizeDireccion = 10; // Tamaño de fuente para la dirección

      // Calcular el ancho total de la dirección
      const direccionWidth =
        (doc.getStringUnitWidth(direccion.trim()) * fontSizeDireccion) /
        doc.internal.scaleFactor;

      // Calcular la posición X para centrar la dirección
      const direccionX =
        (doc.internal.pageSize.getWidth() - direccionWidth) / 2;

      // Mostrar la dirección como una sola línea
      doc.setFontSize(fontSizeDireccion); // Establecer el tamaño de fuente para la dirección
      agregarElementoFactura(direccion.trim(), direccionX, direccionY); // Agregar la dirección como una sola línea

      // Texto completo de "Contribuyente Negocio Popular Régimen RIMPE"
      const textoContribuyente = "Contribuyente Negocio Popular Régimen RIMPE";
      const textoContribuyenteWidth =
        (doc.getStringUnitWidth(textoContribuyente) * fontSizeOriginal) /
        doc.internal.scaleFactor;

      // Calcular la posición X para centrar el texto completo
      const contribuyenteX =
        doc.internal.pageSize.getWidth() - textoContribuyenteWidth + 1.7;
      // Calcular la posición Y para el texto completo (debajo de la dirección)
      const contribuyenteY = direccionY + 5; // Colocar el texto debajo de la dirección

      // Agregar el texto completo como una sola línea
      agregarElementoFactura(
        textoContribuyente,
        contribuyenteX,
        contribuyenteY
      );

      // Ajustar la posición vertical para el nombre y el RUC del mesero
      const meseroNombreY = contribuyenteY + 5; // Ajusta según sea necesario para el espacio entre el texto "Contribuyente Negocio Popular Régimen RIMPE" y el nombre del mesero
      const meseroRUCY = meseroNombreY + 5; // Ajusta según sea necesario para el espacio entre el nombre del mesero y el RUC
      const marginLeftMesero = 30.5; // Ajusta este valor para mover los textos hacia la derecha

      // Agregar nombre y apellido del mesero
      const meseroNombreApellido = `Mesero: ${facturaData.nombre_mesero} ${facturaData.apellido_mesero}`; // Concatena el nombre y apellido del mesero
      doc.text(meseroNombreApellido, marginLeftMesero, meseroNombreY);

      // Agregar RUC del mesero
      const meseroRUC = `RUC: ${facturaData.ruc}`; // Reemplaza facturaData.ruc_mesero con el RUC real del mesero
      doc.text(meseroRUC, marginLeftMesero, meseroRUCY);
    }

    // Agregar detalles de la factura
    let yPos = marginTop + 75;
    doc.setFontSize(10); // Tamaño de fuente más pequeño
    // Agregar fecha
    // Obtener el código de factura
    const codigoFactura = facturaData.codigo_factura;

    // Dividir el código de factura en partes
    const primeraParte = codigoFactura.substring(0, 3);
    const segundaParte = codigoFactura.substring(3, 6);
    const terceraParte = codigoFactura.substring(6);

    // Crear el código de factura con guiones
    const codigoFacturaFormateado = `${primeraParte}-${segundaParte}-${terceraParte}`;

    // Calcular la posición horizontal para "Aut. S.R.I #"
    const textoNotaVenta = `Nota de Venta: ${codigoFacturaFormateado}`;
    const textoNotaVentaWidth =
      (doc.getStringUnitWidth(textoNotaVenta) * 10) / doc.internal.scaleFactor;
    const codigoAutorizacionX = marginLeft + textoNotaVentaWidth + 20; // Ajusta el espacio entre "Nota de Venta" y "Aut. S.R.I #"

    // Agregar nota de venta
    const notaVentaY = marginTop + 40; // Establecer la posición vertical para la nota de venta
    agregarElementoFactura(textoNotaVenta, marginLeft, notaVentaY);

    // Agregar Aut. S.R.I #
    agregarElementoFactura(`Aut. S.R.I #\n`, codigoAutorizacionX, notaVentaY);

    // Guardar la configuración actual de la fuente
    const currentFontSize = doc.internal.getFontSize();
    // Establecer un tamaño de fuente más pequeño solo para el código de autorización del SRI
    doc.setFontSize(7);
    // Agregar el código de autorización del SRI con una fuente más pequeña
    agregarElementoFactura(
      `${facturaData.codigo_autorizacion_sri}`,
      codigoAutorizacionX,
      notaVentaY + 5 // Ajusta la posición vertical según sea necesario
    );
    // Restaurar la configuración original de la fuente
    doc.setFontSize(currentFontSize);

    // Agregar fecha
    const fechaEmisionY = marginTop + 45; // Establecer la posición vertical para la fecha de emisión
    agregarElementoFactura(
      `Fecha: ${facturaData.fecha_emision}`,
      marginLeft,
      fechaEmisionY
    );

    // Agregar nombre del cliente
    const clienteY = marginTop + 50; // Establecer la posición vertical para el cliente
    agregarElementoFactura(
      `Cliente: ${clienteData.razon_social}`,
      marginLeft,
      clienteY
    );

    // Agregar nombre de la direccion
    const direccionY = marginTop + 55; // Establecer la posición vertical para direccion
    agregarElementoFactura(
      `Direccion: ${clienteData.razon_social}`,
      marginLeft,
      direccionY
    );

    // Agregar encabezados de la tabla
    const encabezadosTabla = [
      "Descripción",
      "Cantidad",
      "P.Unitario",
      "Descuento",
      "Valor",
    ];
    doc.setFontSize(8); // Tamaño de fuente más pequeño

    const encabezadosWidths = [60, 20, 20, 20, 20];

    yPos += -7; // Incrementar la posición vertical para las filas de detalles

    /// Calcular la posición inicial en X para centrar la tabla
    const tableWidth = encabezadosWidths.reduce((acc, width) => acc + width, 0);
    const startX = (doc.internal.pageSize.getWidth() - tableWidth) / 2;

    // Agregar encabezados de la tabla
    let currentX = startX;
    encabezadosTabla.forEach((encabezado, index) => {
      // Dibujar contorno
      doc.rect(currentX, yPos, encabezadosWidths[index], 5);

      // Agregar texto centrado en la celda
      const textWidth =
        (doc.getStringUnitWidth(encabezado) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textX = currentX + (encabezadosWidths[index] - textWidth) / 2;
      doc.text(encabezado, textX, yPos + 3);

      currentX += encabezadosWidths[index]; // Actualizar la posición X para la siguiente celda
    });

    yPos += 5; // Incrementar la posición vertical para las filas de detalles

    // Calcular la posición inicial en X para las filas de detalles
    const detallesStartX = (doc.internal.pageSize.getWidth() - tableWidth) / 2;

    // Agregar cada fila de productos/combos
    facturaData.detalles_factura.forEach((detalle) => {
      const producto = productos.find(
        (producto) => producto.id_producto === detalle.id_producto_id
      );
      const combo = combos.find(
        (combo) => combo.id_combo === detalle.id_combo_id
      );
      if (producto || combo) {
        const descripcion =
          producto?.nombreproducto ||
          combo?.nombrecb ||
          "Descripción no disponible";
        const cantidad = detalle.cantidad;
        const precioUnitario = detalle.precio_unitario;
        const descuento = detalle.descuento;
        const valor = detalle.valor;

        // Detalles en celdas
        const filaDetalles = [
          [descripcion, 60], // Descripción
          [cantidad, 20], // Cantidad
          [precioUnitario, 20], // P.Unitario
          [descuento, 20], // Descuento
          [valor, 20], // Valor
        ];

        // Calcular la posición de inicio de la fila
        let currentX = detallesStartX;
        const cellHeight = 5; // Altura de la celda

        // Agregar detalles como celdas y dibujar contorno
        filaDetalles.forEach(([detalle, width]) => {
          // Dibujar contorno
          doc.rect(currentX, yPos, width, cellHeight);

          // Agregar texto centrado
          const textWidth =
            (doc.getStringUnitWidth(detalle) * doc.internal.getFontSize()) /
            doc.internal.scaleFactor;
          const textX = currentX + (width - textWidth) / 2;
          doc.text(detalle, textX, yPos + 3);

          currentX += width; // Actualizar la posición X para la siguiente celda
        });

        yPos += cellHeight; // Incrementar la posición vertical para la siguiente fila
      }
    });
    // Agregar totales y detalles adicionales
    doc.setFontSize(10); // Restaurar el tamaño de fuente original
    const marginRight = 5; // Margen derecho

    // Calcular la posición horizontal para los totales y detalles adicionales
    const marginRightAdjusted = doc.internal.pageSize.getWidth() - marginRight;

    agregarElementoFactura(`Total`, marginRightAdjusted - 36, yPos + 10);
    agregarElementoFactura(
      `${facturaData.total}`,
      marginRightAdjusted - 15,
      yPos + 10
    );

    agregarElementoFactura(`Descto`, marginRightAdjusted - 37, yPos + 20);
    agregarElementoFactura(
      `${facturaData.descuento}`,
      marginRightAdjusted - 15,
      yPos + 20
    );

    agregarElementoFactura(`Sub-Total`, marginRightAdjusted - 39, yPos + 30);
    agregarElementoFactura(
      `${facturaData.subtotal}`,
      marginRightAdjusted - 15,
      yPos + 30
    );

    agregarElementoFactura(`IVA 12%`, marginRightAdjusted - 38, yPos + 40);
    agregarElementoFactura(
      `${facturaData.iva}`,
      marginRightAdjusted - 15,
      yPos + 40
    );

    agregarElementoFactura(`A pagar`, marginRightAdjusted - 38, yPos + 50);
    agregarElementoFactura(
      `${facturaData.a_pagar}`,
      marginRightAdjusted - 15,
      yPos + 50
    );

    // Calcular el ancho y la altura del rectángulo
    const rectWidth =
      (Math.max(
        doc.getStringUnitWidth(`Total: ${facturaData.total}`),
        doc.getStringUnitWidth(`Descto: ${facturaData.descuento}`),
        doc.getStringUnitWidth(`Sub-Total: ${facturaData.subtotal}`),
        doc.getStringUnitWidth(`IVA 12%: ${facturaData.iva}`),
        doc.getStringUnitWidth(`A pagar: ${facturaData.a_pagar}`)
      ) *
        16) /
        doc.internal.scaleFactor +
      1; // El ancho del rectángulo será el ancho máximo del texto más un margen
    const rectHeight = yPos + 50 - (yPos + 4); // La altura del rectángulo será la altura total del texto

    // Calcular la posición horizontal del rectángulo
    const rectX = marginRightAdjusted - rectWidth;

    // Agregar contorno cuadrado
    doc.rect(rectX, yPos + 5, rectWidth, rectHeight);

    // Calcular el tamaño de cada celda
    const cellHeight = rectHeight / 5; // El número 5 representa el número de celdas

    // Agregar líneas horizontales para dividir en celdas
    for (let i = 1; i < 5; i++) {
      doc.line(
        rectX,
        yPos + 5 + i * cellHeight,
        rectX + rectWidth,
        yPos + 5 + i * cellHeight
      );
    }

    // Agregar línea vertical para separar los nombres de los totales y los valores
    const separatorX = rectX + 20; // Ajusta este valor para mover la línea vertical
    doc.line(separatorX, yPos + 5, separatorX, yPos + 5 + rectHeight);

    // Agregar tipo de pedido y método de pago
    const labels = ["Tipo de Pedido", "Método de Pago"];
    const values = [
      obtenerTipoDePedido(facturaData.tipo_de_pedido),
      obtenerMetodoDePago(facturaData.metodo_de_pago),
    ];

    // Calcular el ancho y la altura del rectángulo
    const rectWidthTotales =
      (Math.max(
        doc.getStringUnitWidth(`${labels[0]}: ${values[0]}`),
        doc.getStringUnitWidth(`${labels[1]}: ${values[1]}`)
      ) *
        10) /
        doc.internal.scaleFactor +
      1; // El ancho del rectángulo será el ancho máximo del texto más un margen
    const rectHeightTotales = 20; // Altura del rectángulo

    // Definir la posición horizontal ajustada para el rectángulo de "Tipo de Pedido" y "Método de Pago"
    const marginLeftTotales =
      doc.internal.pageSize.getWidth() - rectWidthTotales - 10; // Ajuste la posición horizontal según sea necesario

    // Agregar contorno cuadrado
    doc.rect(marginLeftTotales, yPos + 65, rectWidthTotales, rectHeightTotales);

    // Calcular el tamaño de cada celda
    const cellHeightTotales = rectHeightTotales / 2; // El número 2 representa el número de celdas

    // Agregar texto para tipo de pedido y método de pago
    for (let i = 0; i < labels.length; i++) {
      const labelWidth =
        (doc.getStringUnitWidth(`${labels[i]}: ${values[i]}`) * 10) /
        doc.internal.scaleFactor; // Calcular el ancho del texto
      agregarElementoFactura(
        `${labels[i]}: ${values[i]}`,
        marginLeftTotales + rectWidthTotales / 2 - labelWidth / 2,
        yPos + 70 + i * 10
      ); // Centrar el texto en la celda
    }

    // Agregar línea horizontal para dividir en celdas
    for (let i = 1; i < 2; i++) {
      doc.line(
        marginLeftTotales,
        yPos + 65 + i * cellHeightTotales,
        marginLeftTotales + rectWidthTotales,
        yPos + 65 + i * cellHeightTotales
      );
    }

    /// Agregar firma cliente
    const firmaClienteX = marginLeft + 20; // Posición X para la firma autorizada
    const firmaClienteY = yPos + 20; // Posición Y para la firma autorizada
    const firmaClienteWidth = 80; // Ancho del área de la firma autorizada

    // Ancho deseado para la línea
    const lineaWidth2 = 35;

    // Calcular la posición X de la línea para que esté centrada con el texto
    const textoFirmaCliente = "Firma Cliente";
    const textofirmaClienteWidth =
      (doc.getStringUnitWidth(textoFirmaCliente) * 12) /
      doc.internal.scaleFactor; // Calcular el ancho del texto
    const lineaX3 =
      firmaClienteX +
      (firmaClienteWidth - textofirmaClienteWidth - lineaWidth2) +
      0.5; // Alinear la línea con el texto
    const lineaX4 = lineaX3 + lineaWidth2;

    // Agregar línea para firmar
    doc.line(lineaX3, firmaClienteY + 5, lineaX4, firmaClienteY + 5);

    // Agregar texto para la firma autorizada
    const textofirmaClienteX =
      firmaClienteX + firmaClienteWidth / 2 - textofirmaClienteWidth / 2;
    const textofirmaClienteY = firmaClienteY + 10; // Ajustar verticalmente el texto
    doc.text(textoFirmaCliente, textofirmaClienteX, textofirmaClienteY);

    // Agregar firma autorizada
    const firmaAutorizadaX = marginLeft - 20; // Posición X para la firma autorizada
    const firmaAutorizadaY = yPos + 20; // Posición Y para la firma autorizada
    const firmaAutorizadaWidth = 80; // Ancho del área de la firma autorizada

    // Ancho deseado para la línea
    const lineaWidth = 35;

    // Calcular la posición X de la línea para que esté centrada con el texto
    const textoFirmaAutorizada = "Firma Autorizada";
    const textoFirmaAutorizadaWidth =
      (doc.getStringUnitWidth(textoFirmaAutorizada) * 12) /
      doc.internal.scaleFactor; // Calcular el ancho del texto
    const lineaX1 =
      firmaAutorizadaX +
      (firmaAutorizadaWidth - textoFirmaAutorizadaWidth - lineaWidth) +
      7; // Alinear la línea con el texto
    const lineaX2 = lineaX1 + lineaWidth;

    // Agregar línea para firmar
    doc.line(lineaX1, firmaAutorizadaY + 5, lineaX2, firmaAutorizadaY + 5);

    // Agregar texto para la firma autorizada
    const textoFirmaAutorizadaX =
      firmaAutorizadaX +
      firmaAutorizadaWidth / 2 -
      textoFirmaAutorizadaWidth / 2;
    const textoFirmaAutorizadaY = firmaAutorizadaY + 10; // Ajustar verticalmente el texto
    doc.text(
      textoFirmaAutorizada,
      textoFirmaAutorizadaX,
      textoFirmaAutorizadaY
    );

    doc.setFontSize(8);
    // Agregar pie de página con autorización
    const autorizacionText = `Fecha Autorización: ${facturaData.autorizacion}\nNumeración: ${facturaData.numeracion}`;
    // Calcular la posición horizontal para el pie de página con autorización
    const marginLeftFooter = 10; // Margen izquierdo para el pie de página
    const autorizacionTextWidth =
      (doc.getStringUnitWidth(autorizacionText) * 10) /
      doc.internal.scaleFactor;
    const autorizacionX = marginLeftFooter; // Comenzar desde el margen izquierdo
    const autorizacionY = doc.internal.pageSize.getHeight() - 10; // Ajusta la posición vertical según sea necesario
    doc.text(autorizacionText, autorizacionX, autorizacionY);

    // Calcular el ancho del texto de vencimiento
    const vencimientoText = `Vencimiento: ${facturaData.vencimiento}`;
    const vencimientoTextWidth =
      (doc.getStringUnitWidth(vencimientoText) * 8) / doc.internal.scaleFactor; // Usar un tamaño de fuente de 8 para el texto de vencimiento

    // Calcular la posición horizontal para el texto de vencimiento
    const marginRightFooter = 10; // Margen derecho para el pie de página
    const vencimientoX =
      doc.internal.pageSize.getWidth() -
      marginRightFooter -
      vencimientoTextWidth;

    // Agregar el texto de vencimiento al documento
    doc.text(vencimientoText, vencimientoX, autorizacionY); // Utiliza la misma posición vertical que la autorización

    // Guardar el documento
    doc.save("factura.pdf");
  };

  // Llamar a la función de generación de PDF al renderizar este componente
  generarPDF();

  return null; // No renderiza ningún contenido en la interfaz
};

export default GenerarFacturaPDF;
