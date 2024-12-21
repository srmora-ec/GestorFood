import React, { useState, useEffect } from 'react';
import { notification, Form, Input, Select, Button, Upload, Radio, Modal,Switch  } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import CrearTipoProducto from '../components/creartipoproducto';
import API_URL from '../config.js';

const { Option } = Select;

const CrearCategoria = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [tiposYCategorias, setTiposYCategorias] = useState([]);
  const [idTipoProducto, setIdTipoProducto] = useState('');
  const [catNombre, setCatNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenCategoria, setImagenCategoria] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetch(API_URL + '/producto/listatiposycategorias/')
      .then((response) => response.json())
      .then((data) => setTiposYCategorias(data.tipos_y_categorias))
      .catch((error) => console.error('Error al obtener tipos y categorías:', error));
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleChange = (info) => {
    if (info.fileList.length > 1) {
      info.fileList = [info.fileList.shift()];
    }
    setImagenCategoria(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('id_tipoproducto', values.idTipoProducto);
      formData.append('catnombre', values.catNombre);
      if (values.descripcion) {
        formData.append('descripcion', values.descripcion);
      }
      formData.append('imagencategoria', imagenCategoria);
      formData.append('muestracliente', values.muestracliente);

      const response = await fetch(API_URL + '/producto/crearcategoria/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: 'Categoría creada con éxito',
        });
        form.resetFields();
        setImagenCategoria(null);
      } else {
        notification.error({
          message: data.error || 'Hubo un error al realizar la solicitud',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Hubo un error al realizar la solicitud',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Tipo de Producto"
          name="idTipoProducto"
          rules={[{ required: true, message: 'Selecciona un tipo de producto' }]}
        >
          <Select
            placeholder="Selecciona un tipo de producto"
            value={idTipoProducto}
            onChange={(value) => setIdTipoProducto(value)}
          >
            {tiposYCategorias.map((tipoCategoria) => (
              <Option key={tipoCategoria.id_tipoproducto} value={tipoCategoria.id_tipoproducto}>
                {tipoCategoria.tpnombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Nombre de la Categoría" name="catNombre" rules={[{ required: true, message: 'Ingrese el nombre de la categoría' }]}>
          <Input value={catNombre} onChange={(e) => setCatNombre(e.target.value)} />
        </Form.Item>
        <Form.Item label="Descripción" name="descripcion" rules={[{ max: 500, message: 'La descripción no puede exceder los 500 caracteres' }]}>
          <Input.TextArea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </Form.Item>
        <Form.Item label="Imagen de la Categoría" name="imagenCategoria" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload accept="image/*" listType="picture" beforeUpload={() => false} fileList={imagenCategoria ? [{ uid: '1', originFileObj: imagenCategoria }] : []} onChange={handleChange}>
            <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="¿Mostrar a clientes?"
          name="muestracliente"
          rules={[{ required: true, message: 'Seleccione una opción' }]}
        >
          <Radio.Group>
            <Radio value={true}>Sí</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Categoría
          </Button>
        </Form.Item>
      </Form>
      <Modal visible={modalVisible} onCancel={handleCancel} footer={null}>
        <CrearTipoProducto />
      </Modal>
    </div>
  );
};

export default CrearCategoria;
