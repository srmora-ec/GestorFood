import React, { useState } from 'react';
import { Card, Tag, Button, Pagination, Row, Col, Tooltip,Popconfirm  } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const ArticulosList = ({ articulos, onEdit, onDelete, onViewEnsamble }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const getTagColor = (tipo) => {
        return tipo === 'N' ? 'blue' : 'green';
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentArticulos = articulos.slice(startIndex, endIndex);

    return (
        <div>
            <Row gutter={[16, 16]}>
                {currentArticulos.map((articulo) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={articulo.id}> {/* Responsive grid */}
                        <Card
                            style={{ borderColor: '#CFCFCF', borderWidth: 2, borderStyle: 'solid' }}
                            title={articulo.nombre}
                            extra={<Tag color={getTagColor(articulo.tipo)}>{articulo.tipo==='N'?'Normal':'Fabricado'}</Tag>}
                            actions={[
                                <Tooltip title='Editar artículo'>
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => onEdit(articulo)}
                                    />
                                </Tooltip>,
                                <>
                                    <Tooltip title='Eliminar producto'>
                                        <Popconfirm
                                            title="Eliminar artículo"
                                            description="¿Seguro que desea eliminar este artículo?"
                                            onConfirm={() => onDelete(articulo)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                            />
                                        </Popconfirm>
                                    </Tooltip>
                                </>,
                                articulo.tipo === 'F' && (
                                    <Tooltip
                                        title='Ver componente'
                                        overlayStyle={{ width: 300 }}
                                    >
                                        <Button
                                            type="text"
                                            icon={<EyeOutlined />}
                                            onClick={() => onViewEnsamble(articulo)}
                                        /></Tooltip>
                                ),
                            ].filter(Boolean)} // Filter out falsy actions
                        >
                            <p><strong>Costo:</strong> ${articulo.costo}</p>
                            <p><Tag color='Purple'>{articulo.id_categoria ? articulo.id_categoria.catnombre : 'Sin categoría'}</Tag></p>
                        </Card >
                    </Col>
                ))}
            </Row>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={articulos.length}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
        </div>
    );
};

export default ArticulosList;
