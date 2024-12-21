import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Segmented, message } from "antd";
import { Row, Col } from "react-bootstrap";
import { Tooltip, Avatar, Divider } from "antd";
import SRIAutorizacion from "./SRIAutorizacion";
import API_URL from '../config.js';
const SRI = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState("CodigoFactura");

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
      formData.append("numero_factura_desde", values.numero_factura_desde);
      formData.append("numero_factura_hasta", values.numero_factura_hasta);

      const response = await fetch(
        API_URL +`/CodigoFactura/crear_codigosri/1/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
        setVisible(false);
        message.success("Código de factura creada exitosamente");
      } else {
        throw new Error("Error al crear o actualizar el código SRI");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateNineDigits = (_, value) => {
    if (value && value.length !== 9) {
      return Promise.reject(new Error("El valor debe tener 9 dígitos"));
    }
    return Promise.resolve();
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
                  <Tooltip title="Codigo Factura SRI">
                    <div style={{ padding: 4 }}>
                      <Avatar shape="square" size="large" />
                    </div>
                  </Tooltip>
                ),
                value: "CodigoFactura",
              },
              {
                label: (
                  <Tooltip title="Codigo Autorización SRI">
                    <div style={{ padding: 4 }}>
                      <Avatar shape="square" size="large" />
                    </div>
                  </Tooltip>
                ),
                value: "CodigoAutorizacion",
              },
            ]}
            value={selectedOption}
            onChange={handleSegmentChange}
          />
        </Col>
      </Row>
      {selectedOption === "CodigoFactura" && (
        <>
          <Divider>Código Factura SRI</Divider>
          <Row>
            <Col md={12}>
              <Button
                type="primary"
                style={{ width: "100%", margin: "2%" }}
                onClick={showModal}
              >
                Crear / Actualizar
              </Button>
            </Col>
            <Col md={12}>
              <Table dataSource={[]} />
            </Col>
          </Row>
          <Modal
            title="Crear / Actualizar Código Factura SRI"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item label="Rango de Números de Factura">
                <Input.Group compact>
                  <Form.Item
                    name="numero_factura_desde"
                    noStyle
                    rules={[{ validator: validateNineDigits }]}
                  >
                    <Input
                      style={{ width: "45%" }}
                      maxLength={9}
                      placeholder="Desde"
                    />
                  </Form.Item>
                  <Form.Item
                    name="numero_factura_hasta"
                    noStyle
                    rules={[{ validator: validateNineDigits }]}
                  >
                    <Input
                      style={{ width: "45%" }}
                      maxLength={9}
                      placeholder="Hasta"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Guardar cambios
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
      {selectedOption === "CodigoAutorizacion" && (
        <>
          <Divider>Código Autorización SRI</Divider>
          <Col md={12}>
            <SRIAutorizacion />
          </Col>
        </>
      )}
    </div>
  );
};

export default SRI;
