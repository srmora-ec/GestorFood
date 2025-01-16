import React, { useState, useEffect, useRef } from 'react';
import { notification, Form, Input, Button, Upload, message, Select, Checkbox, InputNumber, Tour } from 'antd';
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Row, Col } from 'react-bootstrap';
import TransferContainer from './selectcomponent.jsx';
import categoriasejem from './res/categoriasejem.png';
import API_URL from '../config.js';

const CrearProducto = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [impuestos, setImpuestos] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imagenP, setImagenP] = useState(null);
  const [detallecomponente, setDetallecomponente] = useState(false);
  const [mostrarFabricacion, setMostrarFabricacion] = useState(false);
  const [open, setOpen] = useState(false);

  const refs = Array(10).fill(null).map(() => useRef(null));

  const steps = [
    {
      title: 'Categoría',
      description: 'La categoría es la clasificación principal del producto. Por ejemplo, si estás vendiendo comida rápida, las categorías podrían ser "Hamburguesas", "Papas", "Bebidas", etc.',
      cover: <img alt="categorias.png" src={categoriasejem || "/placeholder.svg"} />,
      target: () => refs[0].current,
    },
    {
      title: 'Unidad de Medida',
      description: 'Selecciona la unidad de medida para tu producto (ej: unidades, kilos, litros).',
      target: () => refs[1].current,
    },
    {
      title: 'Nombre del Producto',
      description: 'Ingresa un nombre claro y conciso para tu producto.',
      target: () => refs[2].current,
    },
    {
      title: 'Descripción del Producto',
      description: 'Proporciona una descripción detallada de tu producto, incluyendo sus características y beneficios.',
      target: () => refs[3].current,
    },
    {
      title: 'Precio Unitario',
      description: 'Ingresa el precio unitario de tu producto.',
      target: () => refs[4].current,
    },
    {
      title: 'Impuestos',
      description: 'Selecciona los impuestos aplicables a tu producto.',
      target: () => refs[5].current,
    },
    {
      title: 'Imagen',
      description: 'Sube una imagen de tu producto.',
      target: () => refs[9].current,
    },
    {
      title: 'Añadir Fabricación',
      description: 'Si tu producto se fabrica a partir de otros artículos, puedes añadir la información de fabricación aquí.',
      target: () => refs[6].current,
    },
    {
      title: 'Cantidad Generada',
      description: 'Indica la cantidad del producto que se genera a partir del ensamble.',
      target: () => refs[7].current,
    },
    {
      title: 'Artículos de Ensamble',
      description: 'Selecciona los artículos que se utilizan para ensamblar tu producto.',
      target: () => refs[8].current,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, unidadesMedidaRes, impuestosRes] = await Promise.all([
          fetch(API_URL + '/producto/listar_categorias/'),
          fetch(API_URL + '/producto/listarum/'),
          fetch(API_URL + '/producto/ListarImpuestos/')
        ]);

        const categoriasData = await categoriasRes.json();
        const unidadesMedidaData = await unidadesMedidaRes.json();
        const impuestosData = await impuestosRes.json();

        setCategorias(categoriasData.categorias);
        setUnidadesMedida(unidadesMedidaData.unidades_medida);
        setImpuestos(impuestosData.impuestos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        message.error('Hubo un error al cargar los datos necesarios');
      }
    };

    fetchData();
  }, []);

  const savedetalle = async (jsondetalle) => {
    setDetallecomponente(jsondetalle);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'imagen_p' && key !== 'impuestos') {
          formData.append(key, values[key]);
        }
      });
      formData.append('detalle_comp', detallecomponente);
      if (imagenP) {
        formData.append('imagen_p', imagenP);
      }
      formData.append('impuestos', JSON.stringify(values.impuestos));

      const response = await fetch(API_URL + '/producto/crearproducto/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.mensaje,
        });
        form.resetFields();
        setFileList([]);
        setImagenP(null);
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      console.error('Error al crear el producto:', error);
      notification.error({
        message: 'Error',
        description: 'Hubo un error al crear el producto',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (info) => {
    if (Array.isArray(info.fileList)) {
      setFileList(info.fileList.slice(-1));
      setImagenP(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
    } else {
      console.error('fileList is not an array:', info.fileList);
      setFileList([]);
      setImagenP(null);
    }
  };

  return (
    <>
      <Button
        type="link"
        icon={<QuestionCircleOutlined />}
        onClick={() => setOpen(true)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      />
      <Form form={form} onFinish={onFinish} layout="vertical">
        <span ref={refs[0]}>
          <Form.Item name="id_categoria" label="Categoría" rules={[{ required: true, message: 'Por favor seleccione una categoría' }]}>
            <Select placeholder="Seleccione una categoría">
              {categorias.map((categoria) => (
                <Select.Option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.catnombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </span>
        <span ref={refs[1]}>
          <Form.Item name="id_um" label="Unidad de Medida" rules={[{ required: true, message: 'Por favor seleccione una unidad de medida' }]}>
            <Select placeholder="Seleccione una unidad de medida">
              {unidadesMedida.map((um) => (
                <Select.Option key={um.id_um} value={um.id_um}>
                  {um.nombre_um}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </span>
        <span ref={refs[2]}>
          <Form.Item name="nombre_producto" label="Nombre del Producto" rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}>
            <Input />
          </Form.Item>
        </span>
        <span ref={refs[3]}>
          <Form.Item name="descripcion_producto" label="Descripción del Producto">
            <Input.TextArea />
          </Form.Item>
        </span>
        <span ref={refs[4]}>
          <Form.Item name="precio_unitario" label="Precio Unitario" rules={[{ required: true, message: 'Por favor ingrese el precio unitario' }]}>
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
        </span>
        <span ref={refs[5]}>
          <Form.Item name="impuestos" label="Impuestos">
            <Checkbox.Group>
              {impuestos.map((impuesto) => (
                <Checkbox key={impuesto.id_impuesto} value={impuesto.id_impuesto}>
                  {impuesto.nombre} ({impuesto.porcentaje}%)
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </span>
        <span ref={refs[6]}>
          <Form.Item>
            <Button type="primary" onClick={() => setMostrarFabricacion(!mostrarFabricacion)}>
              Añadir fabricación
            </Button>
          </Form.Item>
        </span>
        <span ref={refs[6]}>
        <Form.Item
          name="puntos_p"
          label="Puntos del Producto"
          rules={[
            { required: true, message: 'Por favor ingrese los puntos del producto' },
            {
              type: 'number',
              transform: value => parseFloat(value),
              validator: (rule, value) => {
                if (isNaN(value) || value < 0) {
                  return Promise.reject('Los puntos del producto no pueden ser negativos');
                }
                if (value.toString().length > 3) {
                  return Promise.reject('Los puntos del producto no pueden tener más de 3 dígitos');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>
        </span>
        <span ref={refs[7]}>
          <Row hidden={!mostrarFabricacion}>
            <label>Cantidad generada a partir del ensamble</label>
            <Col md={12}>
              <Form.Item
                label=":"
                name="cantidad"
                rules={[
                  { type: 'number', message: 'Por favor, ingrese un valor numérico válido para la cantidad' },
                ]}
              >
                <InputNumber
                  step={0.01}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  min={0}
                />
              </Form.Item>
              <h6>Selecciona los artículos que ensamblan tu artículo</h6>
              <div style={{ border: '1px solid #A4A4A4', padding: '2%', margin: '5%' }}>
                <TransferContainer onValor={savedetalle} />
              </div>
            </Col>
          </Row>
        </span>
        <span ref={refs[8]}>
        </span>
        <span ref={refs[9]}>
          <Form.Item label="Imagen" name="imagen_p" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
            <Upload
              accept="image/*"
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleImageChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
            </Upload>
          </Form.Item>
        </span>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Producto
          </Button>
        </Form.Item>
      </Form>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </>
  );
};

export default CrearProducto;

