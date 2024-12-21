import React, { useState, useEffect, useRef } from 'react';
import { notification, Form, Input, Button, Upload, message, Select, Checkbox, InputNumber, Tour } from 'antd';
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import TransferContainer from './selectcomponent.jsx';
import { Row, Col } from 'react-bootstrap';  // Importar el nuevo componente
import categoriasejem from './res/categoriasejem.png'
import API_URL from '../config.js';
const CrearProducto = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imagenP, setimagenP] = useState(null);
  const [detallecomponente, setdetallecomponente] = useState(false);
  const [mostrarFabricacion, setMostrarFabricacion] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);
  const ref10 = useRef(null);

  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: 'Categoría',
      description: 'La categoría es la clasificación principal del producto. \nPor ejemplo, si estás vendiendo comida rapida, las categorías podrían ser "Hamburguesas", "Papas", "Bebidas", etc.',
      cover: (
        <img
          alt="categorias.png"
          src={categoriasejem}
        />
      ),
      target: () => ref1.current,
    },
    {
      title: 'Unidad de medida',
      description: 'La unidad de medida indica cómo se cuantifica o mide el producto. Por ejemplo, "Unidades", "Kilogramos", "Litros", etc. Especifica la unidad en la que se vende o se mide el producto.',
      target: () => ref2.current,
    },
    {
      title: 'Nombre del producto',
      description: 'El nombre del producto es el identificador principal del artículo. Es el nombre que se mostrará a los clientes y los ayudará a identificar y distinguir el producto.',
      target: () => ref3.current,
    },
    {
      title: 'Descripción del producto',
      description: 'La descripción proporciona detalles adicionales sobre el producto. Puede incluir información sobre características, materiales, tamaños o cualquier otra información relevante que ayude a los clientes a comprender mejor el producto.',
      target: () => ref4.current,
    },
    {
      title: 'Precio Unitario',
      description: 'El precio unitario es el costo individual de una unidad del producto. Indica cuánto cuesta una sola pieza, unidad o cantidad específica del producto.',
      target: () => ref5.current,
    },
    {
      title: 'Puntos del producto',
      description: 'Si quieres manejar el sistema de recompensas puedes añadir puntos a los productos. Estos puntos podrán ser canjeados por los clientes para obtener una recompensa.',
      target: () => ref6.current,
    },
    {
      title: 'IVA (Impuesto al Valor Agregado)',
      description: 'El IVA es un impuesto sobre el valor agregado al precio de venta del producto. Es un porcentaje adicional que se agrega al costo y se paga al gobierno. Puede variar según la ubicación y las regulaciones fiscales.',
      target: () => ref7.current,
    },
    {
      title: 'ICE (Impuesto a los Consumos Especiales)',
      description: 'El ICE es un impuesto aplicado a ciertos productos considerados de lujo o especiales. No todos los productos están sujetos a este impuesto, y su tasa puede variar según la legislación fiscal.',
      target: () => ref8.current,
    },
    {
      title: 'IRBPNR (Impuesto a la Renta por Bienes Inmuebles y Plusvalía No Realizada)',
      description: 'El IRBPNR es un impuesto que puede aplicarse a ganancias derivadas de bienes inmuebles y plusvalía no realizada. Este impuesto puede tener reglas específicas según la jurisdicción.',
      target: () => ref9.current,
    },
    {
      title: 'Imagen',
      description: 'La imagen es una representación visual del producto. Puede ser una foto, gráfico o cualquier representación visual que ayude a los clientes a visualizar el producto antes de comprarlo. Ayuda a mejorar la presentación y la comercialización del producto.',
      target: () => ref10.current,
    },
  ];


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(API_URL +'/producto/listar_categorias/');
        if (response.ok) {
          const data = await response.json();
          setCategorias(data.categorias);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        message.error('Hubo un error al cargar las categorías');
      }
    };



    const fetchUnidadesMedida = async () => {
      try {
        const response = await fetch(API_URL +'/producto/listarum/');
        if (response.ok) {
          const data = await response.json();
          setUnidadesMedida(data.unidades_medida);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar las unidades de medida:', error);
        message.error('Hubo un error al cargar las unidades de medida');
      }
    };
    fetchCategorias();
    fetchUnidadesMedida();
  }, []);

  const savedetalle = async (jsondetalle) => {
    setdetallecomponente(jsondetalle);
  }

  useEffect(() => {
    const imagenValue = form.getFieldValue('imagen_p');
    console.log(imagenValue);
    if (imagenValue) {
      setFileList([
        {
          uid: '-1',
          name: 'Imagen existente',
          status: 'done',
          url: imagenValue,
        },
      ]);
    }
  }, [form.getFieldValue('imagen_p')]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('id_categoria', values.id_categoria);
      formData.append('id_um', values.id_um);
      formData.append('nombre_producto', values.nombre_producto);
      formData.append('descripcion_producto', values.descripcion_producto);
      formData.append('precio_unitario', values.precio_unitario);
      formData.append('puntos_p', values.puntos_p);
      formData.append('iva', values.iva ? '1' : '0');
      formData.append('ice', values.ice ? '1' : '0');
      formData.append('irbpnr', values.irbpnr ? '1' : '0');
      console.log("Hay imagn?" + imagenP);
      formData.append('imagen_p', imagenP);
      formData.append('detalle_comp', detallecomponente);
      formData.append('cantidad', values.cantidad);

      const response = await fetch(API_URL +'/producto/crearproducto/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.mensaje,
        });
        form.resetFields();
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
    setimagenP(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
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
      <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        <span ref={ref1}>
          <Form.Item name="id_categoria" label="Categoría" rules={[{ required: true }]}>
            <Select placeholder="Seleccione una categoría">
              {categorias.map((categoria) => (
                <Select.Option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.catnombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </span>
        <span ref={ref2}>
        <Form.Item name="id_um" label="Unidad de Medida" rules={[{ required: true }]}>
          <Select placeholder="Seleccione una unidad de medida">
            {unidadesMedida.map((um) => (
              <Select.Option key={um.id_um} value={um.id_um}>
                {um.nombre_um}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </span>
        <span ref={ref3}>
        <Form.Item name="nombre_producto"label="Nombre del Producto" rules={[
          { required: true, message: 'Por favor ingrese el nombre del producto' },
          { max: 300, message: 'El nombre del producto no puede tener más de 300 caracteres' },
        ]}>
          <Input />
        </Form.Item>
        </span>
        <span ref={ref4}>
        <Form.Item name="descripcion_producto" label="Descripción del Producto" rules={[
          { max: 300, message: 'La descripción del producto no puede tener más de 300 caracteres' },
        ]}>
          <Input.TextArea />
        </Form.Item>
        </span>
        <span ref={ref5}>
        <Form.Item
          name="precio_unitario"
          label="Precio Unitario"
          rules={[
            { required: true, message: 'Por favor ingrese el precio unitario' },
            {
              pattern: /^(?:\d+)?(?:\.\d{1,2})?$/,
              message: 'El precio unitario debe ser un número válido con hasta 2 decimales',
            },
          ]}
        >
          <Input type="text" min={0} />
        </Form.Item>
        </span>
        <span ref={ref6}>
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
        <span ref={ref7}>
        <Form.Item name="iva" label="IVA" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        </span>
        <span ref={ref8}>
        <Form.Item name="ice" label="ICE" ref={ref8} valuePropName="checked">
          <Checkbox />
        </Form.Item>
        </span>
        <span ref={ref9}>
        <Form.Item name="irbpnr" label="IRBPNR" ref={ref9} valuePropName="checked">
          <Checkbox />
        </Form.Item>
        </span>
        <span ref={ref10}>
        <Form.Item label="Imagen" name="imagen_p" ref={ref10} valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload
            accept="image/*"
            listType="picture"
            beforeUpload={() => false}
            fileList={imagenP ? [{ uid: '1', originFileObj: imagenP }] : []}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
          </Upload>
        </Form.Item>
        </span>
        <Row hidden={!mostrarFabricacion}>
          <label>Cantidad generada a partir del ensamble</label>
          <Col md={12}>
            <Form.Item
              label=':'
              name="cantidad"
              rules={[
                { required: false },
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
        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button type="primary" onClick={() => setMostrarFabricacion(!mostrarFabricacion)}>
            Añadir fabricación
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
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
