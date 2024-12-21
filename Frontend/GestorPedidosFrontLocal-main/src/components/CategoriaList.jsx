import React, { useState } from 'react';
import { Card, Button, Tag, Tooltip, Row, Col, Pagination, Popconfirm, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CategoriasList = ({ categorias, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCategorias = categorias.slice(startIndex, endIndex);

  return (
    <div>
      <Row gutter={[16, 16]}>
        {currentCategorias.map((categoria) => (
          <Col xs={24} sm={12} md={8} lg={6} key={categoria.id_categoria}>
            <Card
              title={categoria.catnombre}
              style={{
                borderColor: '#CFCFCF',
                borderWidth: 2,
                borderStyle: 'solid',
                height: 450, // Altura fija para todos los Cards
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              cover={
                categoria.imagencategoria ? (
                  <Image
                    alt="Imagen de categoría"
                    src={`data:image/png;base64, ${categoria.imagencategoria}`}
                    style={{ height: 150, objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: 150, background: '#f0f0f0', textAlign: 'center', lineHeight: '150px' }}>
                    Sin imagen
                  </div>
                )
              }
              actions={[
                <Tooltip title="Editar categoría">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(categoria)}
                  />
                </Tooltip>,
                <Tooltip title="Eliminar categoría">
                  <Popconfirm
                    title="Eliminar categoría"
                    onConfirm={() => onDelete(categoria.id_categoria)}
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
              <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <p><strong>Descripción:</strong> {categoria.descripcion || 'Sin descripción'}</p>
              </div>
              <p>
                <Tag color="blue">{categoria.tipoProducto?.tpnombre || 'Sin tipo'}</Tag>
                <Tag color={categoria.muestracliente?'green':'red'}>{categoria.muestracliente?'Se muestra a clientes': 'No se muestra a clientes'}</Tag>
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={categorias.length}
        onChange={handlePageChange}
        style={{ marginTop: '20px', textAlign: 'center' }}
      />
    </div>
  );
};

export default CategoriasList;
