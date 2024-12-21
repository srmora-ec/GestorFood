import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, message, Select, Segmented } from "antd";
import { Row, Col } from "react-bootstrap";
import { Tooltip, Avatar, Divider } from "antd";
import API_URL from '../config.js';
const { Item } = Form;
const { Option } = Select;

const PuntosFacturacion = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState("CrearPuntoFacturacion");
  const [meseros, setMeseros] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeseros();
  }, []);

  const fetchMeseros = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL +"/Mesero/listar_meseros/");
      if (response.ok) {
        const data = await response.json();
        setMeseros(data.meseros);
      } else {
        throw new Error("Error al obtener la lista de meseros");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("nombre_punto", values.nombre_punto);
      formData.append("id_mesero", values.id_mesero);
      formData.append("sestado", values.sestado === "Activo" ? "1" : "0");
      formData.append("ruc", values.ruc);

      // Validar si el mesero ya está asignado a un punto de facturación
      const validationResponse = await fetch(API_URL +"/CodigoFactura/validar_punto_facturacion/", {
        method: "POST",
        body: JSON.stringify({ id_mesero: values.id_mesero }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!validationResponse.ok) {
        throw new Error("Error al validar el punto de facturación");
      }

      const validationData = await validationResponse.json();

      if (validationData.mensaje === "1") {
        throw new Error("Mesero ya asignado a un punto de facturación");
      }

      // Si la validación es exitosa, continuar con la creación del punto de facturación
      const response = await fetch(
        API_URL +`/CodigoFactura/crear_punto/1/`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
        setVisible(false);
        message.success("Punto de facturación creado exitosamente");
      } else {
        throw new Error("Error al crear el punto de facturación");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message);
    }
  };

  const handleSegmentChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <div>
      <Row>
        <Col md={12}>
          <Segmented
            options={[
              {
                label: (
                  <Tooltip title="Crear Punto de Facturación">
                    <div style={{ padding: 4 }}>
                      <Avatar shape="square" size="large" />
                    </div>
                  </Tooltip>
                ),
                value: "CrearPuntoFacturacion",
              }
            ]}
            value={selectedOption}
            onChange={handleSegmentChange}
          />
        </Col>
      </Row>
      {selectedOption === "CrearPuntoFacturacion" && (
        <>
          <Divider>Crear Punto de Facturación</Divider>
          <Button
            type="primary"
            style={{ width: "100%", margin: "2%" }}
            onClick={showModal}
          >
            Crear Punto de Facturación
          </Button>
          <Modal
            title="Crear Punto de Facturación"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} onFinish={handleSubmit}>
              <Item label="Nombre del Punto" name="nombre_punto" rules={[{ required: true }]}>
                <Input />
              </Item>
              <Item label="RUC" name="ruc" rules={[{ required: true, message: 'Por favor ingrese el RUC' }, { max: 10, message: 'El RUC debe tener como máximo 10 caracteres' }]}>
                <Input />
              </Item>
              <Item label="Mesero" name="id_mesero" rules={[{ required: true }]}>
                <Select loading={loading}>
                  {meseros.map(mesero => (
                    <Option key={mesero.id_mesero} value={mesero.id_mesero}>{`${mesero.nombre} ${mesero.apellido}`}</Option>
                  ))}
                </Select>
              </Item>
              <Item label="Estado" name="sestado" rules={[{ required: true }]}>
                <Select>
                  <Option value="Activo">Activo</Option>
                  <Option value="Desactivado">Desactivado</Option>
                </Select>
              </Item>
              <Item>
                <Button type="primary" htmlType="submit">
                  Crear Punto de Facturación
                </Button>
              </Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default PuntosFacturacion;
