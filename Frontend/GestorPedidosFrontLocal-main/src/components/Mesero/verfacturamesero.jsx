import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import API_URL from '../../config';
import GenerarFacturaPDF from "./GenerarFacturaPDF";
const VerFacturaMesero = ({ facturaData }) => {
  const [productos, setProductos] = useState([]);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [logoEmpresa, setLogoEmpresa] = useState(null);
  const [combos, setCombos] = useState([]);
  const [clienteData, setClienteData] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchEmpresaInfo();
    fetchCombos();
    fetchClienteData();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(API_URL +"/producto/listar/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de productos.");
      }
      const data = await response.json();
      setProductos(data.productos);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await fetch(API_URL +"/combos/ver_combos/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de combos.");
      }
      const data = await response.json();
      setCombos(data.combos);
    } catch (error) {
      console.error("Error al obtener la lista de combos:", error);
    }
  };

  const fetchEmpresaInfo = async () => {
    try {
      const response = await fetch(
        API_URL +"/empresa/infoEmpresa/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mensaje: "Datos de la empresa",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la información de la empresa.");
      }
      const data = await response.json();
      setEmpresaInfo(data.empresa_info);
      if (data.empresa_info && data.empresa_info.elogo) {
        setLogoEmpresa(`data:image/png;base64,${data.empresa_info.elogo}`);
      }
    } catch (error) {
      console.error("Error al obtener la información de la empresa:", error);
    }
  };

  const fetchClienteData = async () => {
    try {
      const response = await fetch(
        API_URL +"/cliente/ver_clientes/"
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de clientes.");
      }
      const data = await response.json();
      const cliente = data.clientes.find(
        (cliente) => cliente.id_cliente === facturaData.id_cliente
      );
      if (cliente) {
        setClienteData(cliente);
      }
    } catch (error) {
      console.error("Error al obtener la lista de clientes:", error);
    }
  };

  const columns = [
    {
      title: "Descripción",
      dataIndex: "id_producto_id",
      key: "descripcion",
      render: (id_producto_id, record) => {
        const producto = productos.find(
          (producto) => producto.id_producto === id_producto_id
        );
        if (producto) {
          return producto.nombreproducto;
        } else {
          const combo = combos.find(
            (combo) => combo.id_combo === record.id_combo_id
          );
          return combo ? combo.nombrecb : "Descripción no disponible";
        }
      },
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
    },
    {
      title: "Descuento",
      dataIndex: "descuento",
      key: "descuento",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
  ];

  const obtenerTipoDePedido = (inicial) => {
    switch (inicial) {
      case "D":
        return "A domicilio";
      case "R":
        return "A retirar";
      case "L":
        return "En local";
      default:
        return "";
    }
  };

  const obtenerMetodoDePago = (inicial) => {
    switch (inicial) {
      case "E":
        return "En efectivo";
      case "T":
        return "Transferencia";
      case "X":
        return "Tarjeta";
      case "F":
        return "Fraccionado";
      default:
        return "";
    }
  };

  // Dentro del componente
  return (
    <div>
      <h3>Fecha de Emisión: {facturaData.fecha_emision}</h3>
      {clienteData && <h3>Cliente: {clienteData.crazon_social}</h3>}
      <h3>Total: {parseFloat(facturaData.a_pagar).toFixed(2)}</h3>
      <h3>IVA: {parseFloat(facturaData.iva).toFixed(2)}</h3>
      <h3>Tipo de Pedido: {obtenerTipoDePedido(facturaData.tipo_de_pedido)}</h3>
      <h3>Método de Pago: {obtenerMetodoDePago(facturaData.metodo_de_pago)}</h3>
      <GenerarFacturaPDF
        empresaInfo={empresaInfo}
        logoEmpresa={logoEmpresa}
        clienteData={clienteData}
        facturaData={facturaData}
        productos={productos}
        combos={combos}
        obtenerTipoDePedido={obtenerTipoDePedido}
        obtenerMetodoDePago={obtenerMetodoDePago}
      />

      <Table
        dataSource={facturaData.detalles_factura}
        columns={columns}
        rowKey="id_detallefactura"
      />
    </div>
  );
};

export default VerFacturaMesero;
