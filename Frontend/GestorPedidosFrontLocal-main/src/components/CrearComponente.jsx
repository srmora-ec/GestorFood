import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, InputNumber, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TransferContainer from './selectcomponent.jsx';
import { Row, Col } from 'react-bootstrap';
import API_URL from '../config.js';

const { Item } = Form;
const { Option } = Select;

const CrearComponenteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [componenteslist, setComponentes] = useState([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [detalleComponente, setDetalleComponente] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [componentesRes, categoriasRes, unidadesRes] = await Promise.all([
          fetch(API_URL + '/producto/listarcomponentes/'),
          fetch(API_URL + '/producto/listar_categorias/'),
          fetch(API_URL + '/producto/listarum/'),
        ]);

        if (componentesRes.ok) {
          const data = await componentesRes.json();
          setComponentes(
            data.componentes.map((componente) => ({
              ...componente,
              costo: componente.costo !== null ? componente.costo : '0.00',
            }))
          );
        }

        if (categoriasRes.ok) {
          const data = await categoriasRes.json();
          setCategorias(data.categorias);
        }

        if (unidadesRes.ok) {
          const data = await unidadesRes.json();
          setUnidadesMedida(data.unidades_medida);
        }
      } catch (error) {
        message.error('Hubo un error al cargar los datos');
      }
    };

    fetchData();
  }, []);

  const handleTipoChange = (value) => setMostrarDetalle(value === 'F');

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      if (values.tipo === 'F') {
        formData.append('detalle_comp', detalleComponente);
        formData.append('cantidad', values.cantidad);
      }
      formData.append('nombre', values.nombre);
      formData.append('costo', values.costo);
      formData.append('tipo', values.tipo);
      formData.append('id_um', values.id_um);
      formData.append('id_categoria', values.id_categoria);
      if (values.descripcion) formData.append('descripcion', values.descripcion);

      const response = await fetch(API_URL + '/producto/crearcomponente/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        notification.success({ message: 'Éxito', description: 'Se creó el componente con éxito' });
        form.resetFields();
      } else {
        message.error('Algo salió mal');
      }
    } catch (error) {
      notification.error({ message: 'Error', description: 'Hubo un problema al crear el componente' });
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: '800px', margin: 'auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Crear Componente</h2>

      <Item
        label="Nombre del Componente"
        name="nombre"
        rules={[{ required: true, message: 'Por favor, ingrese el nombre del componente' }]}
      >
        <Input placeholder="Ingrese el nombre" />
      </Item>

      <Item label="Descripción" name="descripcion">
        <Input.TextArea rows={3} placeholder="Ingrese una descripción" />
      </Item>

      <Row gutter={16}>
        <Col span={12}>
          <Item label="Categoría" name="id_categoria" rules={[{ required: true }]}>
            <Select placeholder="Seleccione una categoría">
              {categorias.map((categoria) => (
                <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.catnombre}
                </Option>
              ))}
            </Select>
          </Item>
        </Col>
        <Col span={12}>
          <Item label="Unidades de Medida" name="id_um" rules={[{ required: true }]}>
            <Select placeholder="Seleccione una unidad de medida">
              {unidadesMedida.map((um) => (
                <Option key={um.id_um} value={um.id_um}>
                  {um.nombre_um}
                </Option>
              ))}
            </Select>
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Costo de Producción"
            name="costo"
            rules={[{ required: true }, { type: 'number', message: 'Por favor, ingrese un valor numérico válido' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Ingrese el costo"
              step={0.01}
              min={0}
            />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Tipo de Componente"
            name="tipo"
            rules={[{ required: true, message: 'Por favor, seleccione el tipo del componente' }]}
          >
            <Select placeholder="Seleccione el tipo" onChange={handleTipoChange}>
              <Option value="N">Normal</Option>
              <Option value="F">Fabricado</Option>
            </Select>
          </Item>
        </Col>
      </Row>

      {mostrarDetalle && (
        <>
          <h3>Detalles del Ensamble</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Item
                label="Cantidad Generada"
                name="cantidad"
                rules={[{ type: 'number', message: 'Ingrese un valor numérico válido' }]}
              >
                <InputNumber style={{ width: '100%' }} step={0.01} min={0} />
              </Item>
            </Col>
            <Col span={24}>
              <h4>Selecciona los artículos que ensamblan tu artículo</h4>
              <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px' }}>
                <TransferContainer onValor={setDetalleComponente} />
              </div>
            </Col>
          </Row>
        </>
      )}

      <Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading} style={{ width: '100%' }}>
          Crear Componente
        </Button>
      </Item>
    </Form>
  );
};

export default CrearComponenteForm;
