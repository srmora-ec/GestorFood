import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, message, Table } from "antd";
import { Row, Col } from "react-bootstrap";
import { Tooltip, Avatar, Divider } from "antd";
import API_URL from '../config.js';
const SRIAutorizacion = () => {
  const [visible, setVisible] = useState(false);
  const [codigoAutorizacion, setCodigoAutorizacion] = useState("");
  const [codigosAutorizacion, setCodigosAutorizacion] = useState([]);
  const [form] = Form.useForm(); // Agregar form aquí

  useEffect(() => {
    fetch(API_URL +"/CodigoFactura/vercodigo/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCodigosAutorizacion(data.codigos_autorizacion);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      // Verifica si el código de autorización tiene exactamente 49 dígitos
      if (codigoAutorizacion.length !== 49) {
        throw new Error(
          "El código de autorización debe tener exactamente 49 dígitos"
        );
      }

      // Verifica si se ingresó la fecha de autorización
      const fechaAutorizacion = form.getFieldValue("fecha_autorizacion");
      if (!fechaAutorizacion) {
        throw new Error("Por favor ingresa la fecha de autorización");
      }

      // Verifica si se ingresó la fecha de vencimiento
      const fechaVencimiento = form.getFieldValue("fecha_vencimiento");
      if (!fechaVencimiento) {
        throw new Error("Por favor ingresa la fecha de vencimiento");
      }

      const formData = new FormData();
      formData.append("codigo_autorizacion", codigoAutorizacion);
      formData.append("ruc", form.getFieldValue("ruc")); // Agregar RUC al formData
      formData.append("nombre", form.getFieldValue("nombre")); // Agregar nombre al formData
      formData.append("fecha_vencimiento", fechaVencimiento);
      formData.append("fecha_autorizacion", fechaAutorizacion);

      const response = await fetch(
        API_URL +`/CodigoFactura/crear_codigoautorizacion/1/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
        setVisible(false);
        message.success("Código de autorización creado exitosamente");
      } else {
        throw new Error("Error al crear el código de autorización");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(
        error.message || "Hubo un error al crear el código de autorización"
      );
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChangeCodigoAutorizacion = (e) => {
    const value = e.target.value;
    // Limitar la longitud del código de autorización a 49 dígitos
    if (value.length <= 49) {
      setCodigoAutorizacion(value);
    } else {
      // Si se superan los 49 dígitos, cortar el valor para que solo tenga los primeros 49 dígitos
      setCodigoAutorizacion(value.slice(0, 49));
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id_codigosauto",
      key: "id_codigosauto",
    },
    {
      title: "Código de Autorización",
      dataIndex: "codigo_autorizacion",
      key: "codigo_autorizacion",
    },
    {
      title: "Fecha de Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
    },
    {
      title: "Fecha de Autorización",
      dataIndex: "fecha_autorizacion",
      key: "fecha_autorizacion",
    },
    {
      title: "RUC",
      dataIndex: "ruc",
      key: "ruc",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Estado",
      key: "estado",
      render: (record) => {
        const fechaVencimiento = new Date(record.fecha_vencimiento);
        const now = new Date();
        const isExpired = fechaVencimiento < now;
        const estadoStyle = {
          color: isExpired ? "red" : "green",
        };
        return (
          <span style={estadoStyle}>
            {isExpired ? "Código caducado" : "Código válido"}
          </span>
        );
      },
    },
  ];
  

  return (
    <div>
      <Col md={12}>
        <Button
          type="primary"
          style={{ width: "100%", margin: "2%" }}
          onClick={showModal}
        >
          Crear Código de Autorización
        </Button>
      </Col>
      <Modal
        title="Crear Código de Autorización"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item
            label="Código de Autorización"
            name="codigo_autorizacion"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el código de autorización",
              },
              { pattern: /^\d*$/, message: "Por favor ingresa solo números" },
            ]}
          >
            <Input
              value={codigoAutorizacion}
              onChange={handleChangeCodigoAutorizacion}
              maxLength={49} // Establecer la longitud máxima permitida a 49 caracteres
            />
          </Form.Item>
          <Form.Item
            label="RUC"
            name="ruc"
            rules={[{ required: true, message: "Por favor ingresa el RUC" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fecha de Autorización"
            name="fecha_autorizacion"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la fecha de autorización",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="Fecha de Vencimiento"
            name="fecha_vencimiento"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la fecha de vencimiento",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <Table columns={columns} dataSource={codigosAutorizacion} />
    </div>
  );
};

export default SRIAutorizacion;
