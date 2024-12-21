
import React ,  { useState, useEffect,  } from 'react';
import {  Row, Col,Button, } from "react-bootstrap";
import {  Form, Input, message, notification,  Space, Table, Tag } from 'antd';
import API_URL from '../config.js';
const DatosB = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({}); 
    const [data, setData] = useState([]); 


    const columns = [
      {
        title: 'Nombre del Banco',
        dataIndex: 'nombre_banco',
        key: 'nombrebanco',
      },
      {
        title: 'Tipo de Cuenta',
        dataIndex: 'tipo_cuenta',
        key: 'tipo_cuenta',
      },
      {
        title: 'Número de Cuenta',
        dataIndex: 'num_cuenta',
        key: 'num_cuenta',
      },
      {
        title: 'Identificación',
        dataIndex: 'identificacion',
        key: 'identificacion',
      },
      {
        title: 'Correo Electrónico',
        dataIndex: 'correoelectronico',
        key: 'correoelectronico',
      },
      {
        title: 'Nombre y Apellidos',
        dataIndex: 'nombreapellidos',
        key: 'nombreapellidos',
      },
    ];
    const onFinish = async (values) => {
      try {
        const response = await fetch(API_URL +'/empleado/agregar_datosB/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          console.log('Datos agregados con éxito');
          notification.success({
            message: 'Datos agregados con exito',
            description: '¡su datos bancarios se han registrado exitosamente!',
          });
          // Obtener nuevamente los datos después de agregar uno nuevo
          fetchData();
        } else {
          console.error('Error al agregar datos:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    };
  
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL +'/empleado/obtener_datosB/');
        const result = await response.json();
  
        setData(result.Cuentas);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []); // Se ejecuta solo al montar el componente
    return (
      <>
      <Row>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 'auto',
          marginRight: '160px',
        }}
        onFinish={onFinish}
      >
        <Row>
          <Col>
            <Form.Item label="Banco" name="banco" rules={[{ required: true }]}>
              <Input onChange={(e) => form.setFieldsValue({ 'nombre_banco': e.target.value })} />
            </Form.Item>
  
            <Form.Item label="Tipo de cuenta" name="tipoCuenta" rules={[{ required: true }]}>
              <Input onChange={(e) => form.setFieldsValue({ 'tipoCuenta': e.target.value })} />
            </Form.Item>
  
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input onChange={(e) => form.setFieldsValue({ 'email': e.target.value })} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Número de cuenta" name="numeroCuenta"  rules={[ {
                    required: true,
                    },
                ]}>
              <Input onChange={(e) => form.setFieldsValue({ 'numeroCuenta': e.target.value })} />
            </Form.Item>
  
            <Form.Item label="Nombre y apellidos" name="nombreApellidos" rules={[{ required: true }]}>
              <Input onChange={(e) => form.setFieldsValue({ 'nombreApellidos': e.target.value })} />
            </Form.Item>
  
            <Form.Item label="Cedula" name="cedula" rules={[ {
                    required: true,
                    },
                ]}>
              <Input onChange={(e) => form.setFieldsValue({ 'cedula': e.target.value })} />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-grid gap-2">
          <Button type="primary" htmlType="submit">
            Agregar
          </Button>
        </div>
    
      </Form>
      </Row>
    <Row style={{marginTop:'30px'}}>
      <Table columns={columns} dataSource={data} />
    </Row>

      </>
    );
  };
  
  export default DatosB;