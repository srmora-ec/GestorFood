import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Segmented,
  Tooltip,
  Avatar,
  Divider,
  Pagination,
  Image,
  Drawer,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import imgaviso from "./res/imgaviso.png";
import { Row, Col } from 'react-bootstrap';
import CrearAvisos from "./crearavisosprincipales";
import API_URL from '../config.js';
const { TextArea } = Input;

// Función para convertir Base64 a URL de datos
const base64ToUrl = (base64String, mimeType) => {
  return `data:${mimeType};base64,${base64String}`;
};

const EditarAvisos = () => {
  const [openp, setOpenp] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [avisos, setAvisos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editAvisoId, setEditAvisoId] = useState(null);
  const [selectedOpcion, setSelectedOpcion] = useState('Avisos');

  useEffect(() => {
    if (editAvisoId) {
      const aviso = avisos.find(aviso => aviso.id_aviso === editAvisoId);
      if (aviso) {
        const base64Image = aviso.imagen ? base64ToUrl(aviso.imagen, "image/png") : null;
        form.setFieldsValue({
          titulo: aviso.titulo,
          descripcion: aviso.descripcion,
          nueva_imagen: base64Image ? { file: { origin: base64Image } } : null,
        });
      }
    }
  }, [editAvisoId, avisos, form]);

  const obtenerAvisos = async () => {
    try {
      const response = await fetch(API_URL + "/avisos/avisos/");
      const data = await response.json();
      if (response.ok) {
        setAvisos(data.avisos_principales);
      } else {
        message.error(`Error al obtener la lista de avisos: ${data.error}`);
      }
    } catch (error) {
      message.error("Error en la solicitud de lista de avisos");
    }
  };

  useEffect(() => {
    obtenerAvisos();
  }, []);

  const handleEditar = (id_aviso) => {
    setEditAvisoId(id_aviso);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setEditAvisoId(null);
  };

  const Changueopcion = (value) => {
    setSelectedOpcion(value);
  }

  const showDrawerp = () => {
    setOpenp(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onClosep = () => {
    setOpenp(false);
    obtenerAvisos();
  };

  const handleFinish = async (values) => {
    try {
      const { titulo, descripcion, nueva_imagen } = values;
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("nueva_imagen", nueva_imagen.file);

      const response = await fetch(
        `http://127.0.0.1:8000/avisos/editaraviso/${editAvisoId}/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        message.success("Aviso editado con éxito");
        setVisible(false);
        obtenerAvisos();
      } else {
        message.error(`Error al editar aviso: ${data.error}`);
      }
    } catch (error) {
      message.error("Error en la solicitud de edición de aviso");
    }
  };

  const columns = [
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Imagen",
      dataIndex: "imagen",
      key: "imagen",
      render: (text, record) => (
        <Space size="middle">
          {record.imagen && (
            <Image
              src={base64ToUrl(record.imagen, "image/png")}
              alt={`Imagen para ${record.titulo}`}
              style={{ maxWidth: "100px" }}
            />
          )}
        </Space>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditar(record.id_aviso)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row>
        <Col md={12}>
          <Segmented
            options={[
              {
                label: (
                  <Tooltip title="Avisos">
                    <div style={{ padding: 4 }}>
                      <Avatar shape="square" src={imgaviso} size="large" />
                    </div>
                  </Tooltip>
                ),
                value: 'Avisos',
              }
            ]}
            value={selectedOpcion}
            onChange={Changueopcion}
          />
        </Col>
        {selectedOpcion === 'Avisos' && (
          <>
            <Divider>Control de avisos principales</Divider>
            <Col md={12}>
              <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                Crear nuevo aviso principal
              </Button>
            </Col>
            <Col md={12}>
              <Row>
              <Table dataSource={avisos} rowKey="id_aviso" columns={columns} />
                <Modal
                  title="Editar Aviso"
                  open={visible}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <Form form={form} onFinish={handleFinish} layout="vertical">
                    <Form.Item
                      label="Título"
                      name="titulo"
                      rules={[
                        {
                          max: 150,
                          message: "El título no puede tener más de 150 caracteres",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Descripción"
                      name="descripcion"
                      rules={[
                        {
                          max: 500,
                          message: "La descripción no puede tener más de 500 caracteres",
                        },
                      ]}
                    >
                      <TextArea />
                    </Form.Item>
                    <Form.Item
                      label="Nueva Imagen"
                      name="nueva_imagen"
                      valuePropName="file"
                      rules={[
                        {
                          required: true,
                          message: "Por favor, selecciona una nueva imagen",
                        },
                        ({ file }) => {
                          const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
                          if (!isImage) {
                            return Promise.reject(
                              "Por favor, selecciona una imagen válida."
                            );
                          }
                          return Promise.resolve();
                        },
                      ]}
                    >
                      <Upload maxCount={1} beforeUpload={() => false} accept="image/*">
                        <Button icon={<UploadOutlined />}>
                          Seleccionar Nueva Imagen
                        </Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Guardar Cambios
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </Row>
              <Pagination current={currentPage} total={total} onChange={handlePageChange} pageSize={8} style={{ marginTop: '16px', textAlign: 'center' }} />
            </Col>
          </>
        )}
      </Row>
      <Drawer
        title="Crear Nuevo Aviso"
        width={720}
        onClose={onClosep}
        open={openp}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearAvisos />
      </Drawer>
    </div>
  );

};

export default EditarAvisos;
