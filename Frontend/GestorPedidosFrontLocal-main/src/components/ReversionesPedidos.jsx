import React, { useState, useEffect } from 'react';
import { Table, Button, Tooltip, Avatar, Modal, Divider, Pagination, Segmented } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined } from '@ant-design/icons';
import imgmesas from './res/imgmesas.png';
import reversionpedido from './res/reversionpedido.png';
import reversionproveedor from './res/reversionproveedor.png';
import reversionpago from './res/reversionpago.png';
import reversionfactura from './res/reversionfactura.png';
import API_URL from '../config.js';
const VerReversionesPedidos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [detalleMovimiento, setDetalleMovimiento] = useState({});
    const [selectedOpcion, setSelectedOpcion] = useState('ReversionPedido');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [facturas, setFacturas] = useState([]);
    const [detalleFactura, setDetalleFactura] = useState({});

    useEffect(() => {
        cargarFacturas();
    }, []);

    const cargarFacturas = () => {
        fetch(API_URL +'/Mesero/lista_facturas/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las facturas');
                }
                return response.json();
            })
            .then(data => {
                setFacturas(data.facturas);
            })
            .catch(error => {
                console.error('Error al obtener las facturas:', error);
            });
    };

    const handleReversionFactura = (idFactura) => {
        // Aquí puedes implementar la lógica para la reversión de la factura
        console.log("Reversión de factura con ID:", idFactura);
    };

    const columns = [
        {
            title: "ID Factura",
            dataIndex: "id_factura",
            key: "id_factura"
          },
          {
            title: "ID Pedido",
            dataIndex: "id_pedido",
            key: "id_pedido"
          },
          {
            title: "Cliente",
            dataIndex: "id_cliente",
            key: "id_cliente"
          },
          {
            title: "Mesero",
            dataIndex: "id_mesero",
            key: "id_mesero"
          },
          {
            title: "Fecha Emisión",
            dataIndex: "fecha_emision",
            key: "fecha_emision"
          },
          {
            title: "Total",
            dataIndex: "total",
            key: "total"
          },
          {
            title: "IVA",
            dataIndex: "iva",
            key: "iva"
          },
          {
            title: "Descuento",
            dataIndex: "descuento",
            key: "descuento"
          },
          {
            title: "Subtotal",
            dataIndex: "subtotal",
            key: "subtotal"
          },
          {
            title: "A Pagar",
            dataIndex: "a_pagar",
            key: "a_pagar"
          },
          {
            title: "Código Factura",
            dataIndex: "codigo_factura",
            key: "codigo_factura"
          },
          {
            title: "Código Autorización",
            dataIndex: "codigo_autorizacion",
            key: "codigo_autorizacion"
          },
          {
            title: "Número Factura Desde",
            dataIndex: "numero_factura_desde",
            key: "numero_factura_desde"
          },
          {
            title: "Número Factura Hasta",
            dataIndex: "numero_factura_hasta",
            key: "numero_factura_hasta"
          },
          {
            title: "Estado de pago",
            dataIndex: "estado_pago",
            key: "estado_pago"
          },
          {
            title: "Tipo de pedido",
            dataIndex: "tipo_de_pedido",
            key: "tipo_de_pedido"
          },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <Button type="primary" onClick={() => handleReversionFactura(record.id_factura)}>Reversión</Button>
            ),
        },
    ];

    const showDetalle = (record) => {
        setDetalleFactura(record);
        setDetalleVisible(true);
    };

    const handleCloseDetalle = () => {
        setDetalleVisible(false);
    };

    const Changueopcion = (value) => {
        setSelectedOpcion(value);
    }

    return (
        <div>
            <Row>
                <Col md={12}>
                    <Segmented
                        options={[
                            {
                                label: (
                                    <Tooltip title="Reversión de Pedidos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionpedido} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'ReversionPedido',

                            },
                            {
                                label: (
                                    <Tooltip title="Reversión de Pedidos de Proveedor">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionproveedor} size="large" />
                                        </div>
                                    </Tooltip>

                                ),
                                value: 'Mesas',

                            },
                            {
                                label: (
                                    <Tooltip title="Reversión de Facturas">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionfactura} size="large" />
                                        </div>
                                    </Tooltip>

                                ),
                                value: 'Mesas',

                            },
                            {
                                label: (
                                    <Tooltip title="Reversión de Pagos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionpago} size="large" />
                                        </div>
                                    </Tooltip>

                                ),
                                value: 'Mesas',

                            }

                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}

                    />
                </Col>

                {selectedOpcion === 'ReversionPedido' && (
                    <>
                        <Divider>Lista de facturas</Divider>
                        <Col md={12}>
                         <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <Row>
                                <Table dataSource={facturas} columns={columns} />

                                <Modal
                                    title="Detalle de Factura"
                                    visible={detalleVisible}
                                    onCancel={handleCloseDetalle}
                                    footer={[
                                        <Button key="cerrar" onClick={handleCloseDetalle}>
                                            Cerrar
                                        </Button>
                                    ]}
                                >
                                    <p><strong>ID Factura:</strong> {detalleFactura.id_factura}</p>
                                    {/* Aquí puedes agregar más detalles de la factura si es necesario */}
                                </Modal>
                            </Row>
                        </div>
                        </Col>
                    </>
                )}
                {selectedOpcion === 'Categorias' && (
                    <>
                        <Divider>Control categorías</Divider>
                        <Col md={12}>
                            <EditarRecompensaComboForm />
                        </Col>
                    </>
                )}
            </Row>
        </div>
    );
};

export default VerReversionesPedidos;
