import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Drawer,
  Popconfirm,
  Tooltip,
  Space,
  Row,
  Col,
  Typography
} from 'antd';
import {
  UploadOutlined,
  EditTwoTone,
  DeleteFilled,
  SettingOutlined
} from '@ant-design/icons';
import CrearUnidadMedida from './CrearUM';
import ConfigUM from './configurarum';
import API_URL from '../config.js';

const { Title } = Typography;

const EditarUnidadesMedida = () => {
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchUnidadesMedida = async () => {
    try {
      const response = await fetch(`${API_URL}/producto/listarum/`);
      const data = await response.json();
      setUnidadesMedida(data.unidades_medida);
    } catch (error) {
      console.error('Error al obtener la lista de unidades de medida:', error);
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  const openEditModal = (unidad) => {
    setSelectedUnidad(unidad);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setSelectedUnidad(null);
    setEditModalVisible(false);
  };

  const openConfigModal = (unidad) => {
    setSelectedUnidad(unidad);
    setConfigModalVisible(true);
  };

  const closeConfigModal = () => {
    setSelectedUnidad(null);
    setConfigModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const formData = new FormData();
      formData.append('sestado', 0);

      const response = await fetch(`${API_URL}/producto/editarum/${id}/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Unidad de medida eliminada con éxito');
        fetchUnidadesMedida();
      } else {
        message.error('Error al eliminar la unidad de medida');
      }
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    }
  };

  const handleEdit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('nombreum', values.nombre_um);

      const response = await fetch(`${API_URL}/producto/editarum/${selectedUnidad.id_um}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Unidad de medida editada con éxito');
        fetchUnidadesMedida();
        closeEditModal();
      } else {
        message.error('Error al editar la unidad de medida');
      }
    } catch (error) {
      message.error('Error en la solicitud de edición');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_um',
      key: 'id_um',
      align: 'center',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre_um',
      key: 'nombre_um',
      align: 'left',
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar unidad de medida">
            <Button
              type="text"
              icon={<EditTwoTone style={{ fontSize: '20px' }} />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="¿Estás seguro que deseas eliminar esta unidad?"
            onConfirm={() => handleDelete(record.id_um)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteFilled style={{ fontSize: '20px' }} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredUnidadesMedida = unidadesMedida.filter((um) =>
    um.nombre_um.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
    <Row >
        <Col md={24} >
          <Button type="primary"  style={{ width: '100%', margin: '2%' }} icon={<UploadOutlined />} onClick={() => setOpenDrawer(true)}>
            Crear Unidad de Medida
          </Button>
        </Col>
      </Row>
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Input
            placeholder="Buscar unidad de medida"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col span={16} style={{ textAlign: 'right' }}>
          <Tooltip title="Configurar conversiones">
            <Button
              type="default"
              icon={<SettingOutlined style={{ fontSize: '20px' }} />}
              onClick={() => openConfigModal(null)}
            >
              Configurar Conversiones
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <Table
        dataSource={filteredUnidadesMedida}
        columns={columns}
        rowKey="id_um"
        pagination={{ pageSize: 5 }}
      />

      <Drawer
        title="Crear Unidad de Medida"
        width={720}
        onClose={() => setOpenDrawer(false)}
        visible={openDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CrearUnidadMedida onClose={() => setOpenDrawer(false)} />
      </Drawer>

      <Modal
        title="Editar Unidad de Medida"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
      >
        <Form onFinish={handleEdit} initialValues={selectedUnidad} layout="vertical">
          <Form.Item
            label="Nombre de la Unidad"
            name="nombre_um"
            rules={[{ required: true, message: 'Por favor ingresa el nombre de la unidad.' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Configurar Conversiones de Unidades"
        visible={configModalVisible}
        onCancel={closeConfigModal}
        footer={null}
      >
        <ConfigUM um={selectedUnidad} />
      </Modal>
    </div>
    </>
  );
};

export default EditarUnidadesMedida;
