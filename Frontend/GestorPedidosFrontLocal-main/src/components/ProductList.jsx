import React, { useState } from 'react';
import { Card, Button, Tag, Tooltip, Row, Col, Pagination, Popconfirm, Image,Badge  } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ProductosList = ({ productos, onEdit, onDelete,categoriaList }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getCategoriaNombre = (idCategoria) => {
        const categoria = categoriaList.find((categoria) => categoria.id_categoria === idCategoria);
        return categoria ? categoria.catnombre : '';
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProductos = productos.slice(startIndex, endIndex);

    return (
        <div>
            <Row gutter={[16, 16]}>
                {currentProductos.map((producto) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={producto.id_producto}>
                        <Card
                            key={producto.id_producto}
                            title={producto.nombreproducto}
                            style={{
                                borderColor: '#CFCFCF',
                                borderWidth: 2,
                                borderStyle: 'solid',
                                height: 450,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                            cover={
                                producto.imagenp ? (
                                    <Image
                                        alt="Imagen del producto"
                                        src={`data:image/png;base64, ${producto.imagenp}`}
                                        style={{ height: 150, objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ height: 150, background: '#f0f0f0', textAlign: 'center', lineHeight: '150px' }}>
                                        Sin imagen
                                    </div>
                                )
                            }
                            actions={[
                                <Tooltip title="Editar producto">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => onEdit(producto)}
                                    />
                                </Tooltip>,
                                <Tooltip title="Eliminar producto">
                                    <Popconfirm
                                        title="Eliminar producto"
                                        onConfirm={() => onDelete(producto.id_producto)}
                                        okText="Sí"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                        />
                                    </Popconfirm>
                                </Tooltip>,
                            ]}
                        >
                            <div style={{ height: 50, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <p><strong>Descripción:</strong> {producto.descripcionproducto || 'Sin descripción'}</p>
                            </div>
                            <p>
                                <Tooltip title={"Categoría de " + producto.nombreproducto}>
                                    <Badge count={getCategoriaNombre(producto.id_categoria)} showZero color='#CE6F04' />
                                </Tooltip> 
                                <Tag color={producto.stock > 0 ? 'green' : 'red'}>
                                    {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
                                </Tag>
                                <Tooltip title={"Puntos de " + producto.nombreproducto}>
                                    <Badge count={producto.puntosp} showZero color='#faad14' />
                                </Tooltip>

                            </p>
                            <p><strong>Precio:</strong> ${(Number(producto.preciounitario) || 0).toFixed(2)}</p>
                            </Card>
                    </Col>
                ))}
            </Row>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={productos.length}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
        </div>
    );
};

export default ProductosList;
