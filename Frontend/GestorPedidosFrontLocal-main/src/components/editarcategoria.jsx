import React, { useState, useEffect } from 'react';
import { Tag, Table, Space, Image, Button, Form, Input, Select, Modal, Upload, Drawer, Switch, Tooltip, message } from 'antd';
import { UploadOutlined, DeleteFilled } from '@ant-design/icons';
import { Row, Col } from 'react-bootstrap';
import CrearCategoria from './crearcategoria';
import API_URL from '../config.js';
import CategoriasList from './CategoriaList.jsx';

const EditarCategoria = ({ onCancel }) => {
  const [categorias, setCategorias] = useState([]);
  const [tiposProductos, setTiposProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [openc, setOpenc] = useState(false);
  const [openca, setOpenca] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form, setForm] = Form.useForm();

  const showDrawerc = () => {
    console.log('Que pasaa');
    setOpenc(true);
  };

  const onClosec = () => {
    console.log('Que pasab');
    setOpenc(false);
    fetchCategorias();
  };

  const onCloseca = () => {
    setSelectedCategoria(null); // Limpia la categoría seleccionada
    setOpenca(false); // Cierra el Drawer
    form.resetFields(); // Resetea los valores del formulario
    fetchCategorias(); // Actualiza las categorías
  };

  const handleTipoProductoChange = (value) => {
    setSelectedTipoProducto(value);
  };


  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del localStorage

      const responseCategorias = await fetch(API_URL + '/producto/listar_categorias/', {
        method: 'GET', // Método HTTP (opcional, 'GET' es el predeterminado)
        headers: {
          'Content-Type': 'application/json', // Indica que esperas JSON
          Authorization: `Bearer ${token}`, // Incluye el token en los headers
        },
      });

      if (!responseCategorias.ok) {
        throw new Error('Error al obtener las categorías');
      }

      const dataCategorias = await responseCategorias.json();

      const responseTiposProductos = await fetch(API_URL + '/producto/listarproductos/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!responseTiposProductos.ok) {
        throw new Error('Error al obtener los tipos de productos');
      }

      const dataTiposProductos = await responseTiposProductos.json();

      const tiposProductosMap = {};
      dataTiposProductos.tipos_productos.forEach((tipoProducto) => {
        tiposProductosMap[tipoProducto.id_tipoproducto] = tipoProducto;
      });

      const categoriasConTipos = dataCategorias.categorias.map((categoria) => ({
        ...categoria,
        id_tipoproducto: categoria.id_tipoproducto, // Esto debería coincidir con el tipo en tiposProductos
      }));

      setCategorias(categoriasConTipos);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const eliminartp = async (idca) => {
    try {
      const formData = new FormData();
      console.log('El valor enviado es :' + idca)
      formData.append('sestado', 0);
      const response = await fetch(API_URL + `/producto/editar_categoria/${idca}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Categoria eliminada con exito');
        listarca();
      } else {
        message.error(responseData.error || 'Hubo un error al realizar la solicitud');
      }
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    }
  }

  useEffect(() => {
    listarca();
  }, []);

  const listarca = () => {
    const fetchTiposProductos = async () => {
      console.log('Que pasae');
      try {
        const response = await fetch(API_URL + '/producto/listarproductos/');
        const data = await response.json();
        setTiposProductos(data.tipos_productos);
      } catch (error) {
        console.error('Error fetching tipos de productos:', error);
      }
    };

    fetchTiposProductos();
    fetchCategorias();
  }

  const handleEdit = (record) => {
    setSelectedCategoria(record);
    setOpenca(true); // Abre el Drawer de edición
    setTimeout(() => {
      const tipoProductoId = record.id_tipoproducto || tiposProductos[0]?.id_tipoproducto;
      form.setFieldsValue({
        ...record,
        id_tipoproducto: tipoProductoId,
      });
    }, 100); // Ajusta el tiempo si es necesario
  };

  const handleCancelEdit = () => {
    console.log('Que pasag');
    setSelectedCategoria(null);
  };

  const handleUpdateCategoria = async (values) => {
    try {
      const formData = new FormData();
      formData.append('catnombre', values.catnombre);
      if (values.descripcion != null) {
        formData.append('descripcion', values.descripcion);
      }

      formData.append('id_tipoproducto', values.id_tipoproducto);
      formData.append('muestracliente', values.muestracliente ? 1 : 0); // Convertir booleano a número

      if (values.imagen && values.imagen[0]?.originFileObj) {
        formData.append('imagencategoria', values.imagen[0].originFileObj);
      }

      const response = await fetch(
        API_URL + `/producto/editar_categoria/${selectedCategoria.id_categoria}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchCategorias();
        handleCancelEdit();
        Modal.success({
          title: 'Éxito',
          content: 'Categoría editada con éxito',
        });
      } else {
        Modal.error({
          title: 'Error',
          content: `Error al editar categoría: ${data.error}`,
        });
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'Error en la solicitud de edición',
      });
    }
  };


  const validateImageFormat = (_, fileList) => {
    const isValidFormat = fileList.every(file => file.type.startsWith('image/'));
    if (!isValidFormat) {
      return Promise.reject('Solo se permiten archivos de imagen');
    }
    return Promise.resolve();
  };

  const CategoriaForm = ({ onFinish, onCancel, initialValues, tiposProductos }) => {
    const [form] = Form.useForm();
  };


  const filteredCategorias = categorias.filter(categoria =>
    categoria.catnombre.toLowerCase().includes(searchText.toLowerCase())
  );

  var selectedCategoriaWithValidTipo = {
    ...selectedCategoria,
    id_tipoproducto:
      selectedCategoria?.id_tipoproducto &&
        tiposProductos.find((tipo) => tipo.id_tipoproducto === selectedCategoria.id_tipoproducto)
        ? selectedCategoria.id_tipoproducto
        : tiposProductos[0]?.id_tipoproducto,
  };

  return (
    <>
      <Row>
        <Col md={12}>
          <Button type="primary" icon={<UploadOutlined />} style={{ width: '100%', margin: '2%' }} onClick={showDrawerc}>
            Crear nueva categoria
          </Button>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={12}>
          <Input
            placeholder="Buscar categoría"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <CategoriasList categorias={filteredCategorias} onEdit={handleEdit} onDelete={eliminartp}></CategoriasList>
        </Col>
      </Row>
      <Drawer
        title="Crear categoria"
        width={720}
        onClose={onClosec}
        open={openc}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearCategoria />
      </Drawer>
      {selectedCategoria && (
        <Drawer
          title="Editar categoría"
          width={720}
          open={openca}
          onClose={onCloseca}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
        >
          <Form
            form={form}
            name="editarCategoriaForm"
            onFinish={handleUpdateCategoria}
            initialValues={{
              ...selectedCategoria,
              id_tipoproducto: selectedCategoria?.id_tipoproducto || tiposProductos[0]?.id_tipoproducto,
              muestracliente: selectedCategoria?.muestracliente, // Valor inicial para muestracliente
            }}
          >

            <Form.Item
              label="Nombre"
              name="catnombre"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa el nombre de la categoría',
                },
                { max: 300, message: 'El nombre de la categoría no puede exceder los 300 caracteres' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[{ max: 500, message: 'La descripción no puede exceder los 500 caracteres' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Tipo de Producto"
              name="id_tipoproducto"
              rules={[
                {
                  required: true,
                  message: 'Por favor selecciona el tipo de producto',
                },
              ]}
            >
              <Select>
                {tiposProductos.map((tipo) => (
                  <Select.Option key={tipo.id_tipoproducto} value={tipo.id_tipoproducto}>
                    {tipo.tpnombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Imagen de la Categoría"
              name="imagen"
              valuePropName="fileList"
              getValueFromEvent={(e) => e && e.fileList}
            >
              <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Mostrar al cliente"
              name="muestracliente"
              valuePropName="checked" // Esto asegura que funcione con Switch
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar cambios
              </Button>
            </Form.Item>
          </Form>

        </Drawer>
      )}
    </>
  );
};
export default EditarCategoria;