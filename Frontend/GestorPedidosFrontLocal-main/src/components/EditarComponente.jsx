import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, InputNumber, Drawer, Tag, Tooltip, Popover, Popconfirm, notification } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import CrearComponenteForm from './CrearComponente';
import TransferContainer from './selectcomponent.jsx';
import API_URL from '../config.js';
import ArticulosList from './viewComponente.jsx';
const { Item } = Form;
const { Option } = Select;

const EditarComponenteForm = () => {
  const [componentes, setComponentes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editComponente, setEditComponente] = useState(null);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [opencom, setOpencom] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [form] = Form.useForm();
  const [agregarDetalle, setagregarDetalle] = useState(false);
  const [detallecomponente, setdetallecomponente] = useState(false);
  const [detalleeditar, setdetalleeditar] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleTipoChange = (value) => {
    setagregarDetalle(value === 'F');
  };

  const onViewEnsamble = (record) => {
    Modal.info({
      title: `Ensamble del componente: ${record.nombre}`,
      content: (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {record.detalle ? (
            <>
              <p>Generado por ensamble: {record.detalle.padrecant}</p>
              <hr />
              {record.detalle.detalle.map((detalleItem, index) => (
                <div key={index}>
                  <Tag color="#55971A">{detalleItem.id_componentehijo.nombre}</Tag>
                  <p>Cantidad: {detalleItem.cantidadhijo}</p>
                  <p>Unidad de Medida: {detalleItem.um.nombre}</p>
                  <hr />
                </div>
              ))}
            </>
          ) : (
            <p>Este componente no tiene detalles de ensamble.</p>
          )}
        </div>
      ),
      onOk() {},
    });
  };
  

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
  const eliminarcomp = async (rec) => {
    try {
      const formDataObject = new FormData();
      formDataObject.append('id_componente', rec.id_componente);
      console.log(rec.id_componente);
      const response = await fetch(API_URL +'/producto/eliminarcomponente/', {
        method: 'POST',
        body: formDataObject,
      });
      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Artículo eliminado con éxito',
        });
        fetchComponentes();
      } else {
        notification.error({
          message: 'Error',
          description: 'Algo salío mal: ' + data.error,
        });
      }
    } catch (error) {
      message.error('Ocurrió un error al eliminar el artículo' + error);
    }
  };

  const showDrawercom = () => {
    setOpencom(true);
  };

  const onClosecom = () => {
    setOpencom(false);
    form.resetFields();
    setEditComponente(null);
    fetchComponentes();
  };

  const fetchComponentes = async () => {
    try {
      const response = await fetch(API_URL +'/producto/listarcomponentes/');
      if (response.ok) {
        const data = await response.json();
        setComponentes(data.componentes);
      } else {
        const errorData = await response.json();
        message.error(errorData.error);
      }
    } catch (error) {
      console.error('Error al cargar los componentes:', error);
      message.error('Hubo un error al cargar los componentes');
    }
  };


  useEffect(() => {


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

    fetchComponentes();
    fetchCategorias();
    fetchUnidadesMedida();
  }, []);

  const handleEdit = (record) => {
    console.log("Aver que pasa");
    console.log(record);
    console.log(record.id_um);    
    setEditComponente(record);
    setdetalleeditar(record.detalle);
    handleTipoChange(record.tipo);
    form.resetFields();
    setModalVisible(true);
    console.log(record.detalle);


  };

  const handleModalOk = async (values) => {
    try {
      console.log("Valor a enviar:");
      console.log(detallecomponente);
      const formDataObject = new FormData();
      formDataObject.append('nombre', values.nombre);
      formDataObject.append('descripcion', values.description);
      formDataObject.append('tipo', values.tipo);
      console.log(values.tipo);
      formDataObject.append('costo', values.costo);
      formDataObject.append('categoria', values.id_categoria);
      formDataObject.append('id_um', values.id_um);
      if (values.tipo == 'F') {
        formDataObject.append('detalle_comp', detallecomponente);
        formDataObject.append('cantidad', values.cantidad);
      }
      const response = await fetch(API_URL +`/producto/editarcomponente/${editComponente.id_componente}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: formDataObject,
      });
      const data = await response.json();
      if (response.ok) {
        setComponentes((prevComponentes) =>
          prevComponentes.map((c) =>
            c.id_componente === editComponente.id_componente ? { ...c, ...data.componente } : c
          )
        );
        setModalVisible(false);
        console.log('vamo');
        fetchComponentes();
        notification.success({
          message: 'Éxito',
          description: 'Artículo editado con exito',
        });
      } else {
        notification.error({
          message: 'Error',
          description: 'Algo salió mal:'+data.error,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Algo salió mal:'+error,
      });
    }
  };
  useEffect(() => {
    if (modalVisible && editComponente) {
      form.setFieldsValue({
        nombre: editComponente.nombre,
        descripcion: editComponente.descripcion,
        costo: editComponente.costo,
        id_categoria: editComponente.id_categoria.id_categoria,
        tipo: editComponente.tipo,
        id_um: editComponente.id_um.id_um,
      });
    }
  }, [modalVisible, editComponente, form]);
  const savedetalle = async (jsondetalle) => {
    setdetallecomponente(jsondetalle);
  }

  const filteredComponente = componentes.filter((componente) =>
    componente.nombre.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>        
      <Col span={8}>
      <Button type="primary" icon={<UploadOutlined />} style={{ width: '100%', margin: '2%' }} onClick={showDrawercom}>
            Crear artículo
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Input
            placeholder="Buscar componente"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      
      <ArticulosList articulos={filteredComponente} onEdit={handleEdit} onDelete={eliminarcomp} onViewEnsamble={onViewEnsamble}  ></ArticulosList>
      {editComponente && (
        <Modal
          title="Editar Componente"
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditComponente(null);
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleModalOk}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Item label="Nombre" name="nombre" values={editComponente.nombre} rules={[{ required: true, message: 'Por favor, ingrese el nombre del componente' }]}>
              <Input />
            </Item>

            <Item label="Descripción" name="descripcion" initialValue={editComponente.descripcion}>
              <Input.TextArea />
            </Item>

            <Item label="Costo de producción" name="costo" values={editComponente.costo} rules={[{ required: true }, { type: 'decimal', message: 'Por favor, ingrese un valor numérico válido para el costo' }]} min={0} default={0}>
              <InputNumber
                step={0.01}
              />
            </Item>
            <Form.Item name="id_categoria" label="Categoría" rules={[{ required: true }]} initialValue={editComponente.id_categoria.id_categoria}>
              <Select placeholder="Seleccione una categoría">
                {categorias.map((categoria) => (
                  <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.catnombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Item label="Tipo" name="tipo" initialValue={editComponente.tipo} rules={[{ required: true, message: 'Por favor, seleccione el tipo del componente' }]}>
              <Select onChange={handleTipoChange} >
                <Option value="N">Normal</Option>
                <Option value="F">Fabricado</Option>
              </Select>
            </Item>

            <Item label="Unidad de Medida" name="id_um" initialValue={editComponente.id_um} rules={[{ required: true, message: 'Por favor, seleccione la unidad de medida' }]}>
              <Select>
                {unidadesMedida.map((um) => (
                  <Option value={um.id_um}>
                    {um.nombre_um}
                  </Option>
                ))}
              </Select>
            </Item>


            {
              agregarDetalle && (

                <Row>
                  <label>Cantidad generada a partir del ensamble</label>
                  <Col md={12}>
                    <Item
                      label=':'
                      name="cantidad"
                      initialValue={(detalleeditar && (detalleeditar.padrecant))}
                    >
                      <InputNumber
                        step={0.01}
                        min={0}
                      />
                    </Item>
                    <h6>Selecciona los artículos que ensamblan tu artículo</h6>
                    <div style={{ border: '1px solid #A4A4A4', padding: '2%', margin: '5%' }}>
                      <TransferContainer onValor={savedetalle} previouslySelectedItems={detalleeditar} />
                    </div>
                  </Col>
                </Row>
              )}
            <Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Guardar Cambios
              </Button>
            </Item>
          </Form>
        </Modal>
      )}

      <Drawer
        title="Crear artículo"
        width={720}
        open={opencom}
        onClose={onClosecom}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearComponenteForm />
      </Drawer>
    </div>
  );
};

export default EditarComponenteForm;
