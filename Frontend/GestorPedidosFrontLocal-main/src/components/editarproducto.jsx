import React, { useState, useEffect } from 'react';
import { Form, Popconfirm, Card, Input, Pagination, Button, Select, Modal, Upload, Tooltip, Badge, Tag, Segmented, Avatar, Checkbox, Popover, notification, Drawer, Divider, Watermark, message } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined, CalendarTwoTone, EditFilled, EyeOutlined, DeleteFilled } from '@ant-design/icons';
import imgproductos from './res/imgproductos.png';
import categoriaproducto from './res/categoriaproducto.png';
import tipoproducto from './res/tipoproducto.png'
import um from './res/um.png'
import CrearProducto from './CrearProducto';
import EditarTipoProducto from './editartipoproducto'
import EditarCategoria from './editarcategoria';
import EditarUnidadesMedida from './editarunidadmedida';
import CrearHorariosSemanales from './crearhorarioS';
import articulo from './res/articulos.png'
import EditarComponenteForm from './EditarComponente'
import ListProductos from '../Clientes/ListaProductos';
import API_URL from '../config.js';
import ProductosList from './ProductList.jsx';
const { Meta } = Card;
const { Option } = Select;

const EditarProducto = () => {
    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [umList, setUmList] = useState([]);
    const [categoriaList, setCategoriaList] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [form] = Form.useForm();
    const [openp, setOpenp] = useState(false);
    const [selectedOpcion, setSelectedOpcion] = useState('Productos');
    const [openH, setOpenH] = useState(false);
    const [SucursalesData, setSucursalesData] = useState(null);
    const [optionSucursales, setOptions] = useState([]);
    const [optionSucursales2, setOptions2] = useState([]);
    const [selectedSucursal, setSucursal] = useState([null]);
    const [selectedProducto, setProducto] = useState([null]);
    const [horarioDetails, setHorarioDetails] = useState([]);
    const [impuestos, setImpuestos] = useState([]);

    useEffect(() => {
        fetchSucursal();
        fetchImpuestos();
    }, []);
    const fetchImpuestos = async () => {
        try {
          const response = await fetch(API_URL + '/producto/ListarImpuestos/');
          const data = await response.json();
          setImpuestos(data.impuestos);
        } catch (error) {
          console.error('Error fetching impuestos data:', error);
        }
      };

    const handleProductoChange = (value) => {

        setSucursal(value);
        setHorarioDetails("");
        if (selectedProducto.horarios.length > 0) {
            const selectedHorario = selectedProducto.horarios.find(horario => horario.id_sucursal === value);
            if (selectedHorario) {
                fetchHorarioDetails(selectedHorario.id_horarios);
            }
        }
    };


    const fetchSucursal = () => {
        setSucursalesData([]);
        const url = API_URL + `/sucursal/sucusarleslist/`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSucursalesData(data.sucursales);

            })
            .catch((error) => {
                console.error('Error al obtener los datos de sucursales:', error);
            });
    };

    const editHorarioCreate = async (jsonHorario) => {
        try {
            if (selectedProducto.horarios.length > 0) {
                const selectedHorario = selectedProducto.horarios.find(horario => horario.id_sucursal === selectedSucursal);
                if (selectedHorario) {
                    const formDataObject = new FormData();
                    formDataObject.append('detalle', JSON.stringify(jsonHorario));

                    const response = await fetch(API_URL + '/horarios/edit/' + selectedHorario.id_horarios, {
                        method: 'POST',
                        body: formDataObject,
                    });

                    const responseData = await response.json();

                    if (responseData.mensaje) {
                        notification.success({
                            message: 'Éxito',
                            description: 'Horario editado exitosamente',
                        });
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'Error al editar el horario: ' + responseData.error,
                        });
                    }
                }

            }

        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al editar el horario' + error,
            });
        }
    };

    const handleHorarioCreate = async (jsonHorario) => {
        try {
            const formDataObject = new FormData();
            formDataObject.append('nombreh', 'horarioProducto' + selectedProducto.id_producto);
            formDataObject.append('detalle', JSON.stringify(jsonHorario));
            formDataObject.append('idsucursal', selectedSucursal);
            formDataObject.append('idproducto', selectedProducto.id_producto);
            const response = await fetch(API_URL + '/horarios/CrearHorarioProducto/', {
                method: 'POST',
                body: formDataObject,
            });

            const responseData = await response.json();

            if (response.ok) {
                notification.success({
                    message: 'Éxito',
                    description: 'Horario creado exitosamente',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Error al crear el horario: ' + responseData.error,
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario' + error,
            });
        }
    };

    const onCloseH = () => {
        setOpenH(false)
        setSucursal('');
    }

    const viewadminH = (productId) => {
        setProducto(productId);
        console.log(productId.horarios)
        if (SucursalesData && SucursalesData.length > 0) {
            const firstFiveSucursales = SucursalesData.slice(0, 5);
            const options = firstFiveSucursales.map((sucursal) => sucursal.snombre);
            setOptions(options);
            const allSucursalesOptions = SucursalesData.map((sucursal) => ({
                value: sucursal.id_sucursal,
                label: sucursal.snombre,
            }));
            setOptions2(allSucursalesOptions);

        }
        setOpenH(true);
    }

    const HorarioCreate = async (jsonHorario) => {
        try {
            const formDataObject = new FormData();
            formDataObject.append('detalle', JSON.stringify(jsonHorario));
            formDataObject.append('id_sucursal', selectedSucursal);


            const response = await fetch(API_URL + '/producto/editarproducto/' + productId + '/', {
                method: 'POST',
                body: formDataObject,
            });

            const responseData = await response.json();

            if (responseData.mensaje) {
                notification.success({
                    message: 'Éxito',
                    description: 'Horario editado exitosamente',
                });
                fetchproducto(currentPage);
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Error al editar el horario: ' + responseData.error,
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario',
            });
        }
    };

    const Changueopcion = (value) => {
        setSelectedOpcion(value);
    }

    const showDrawerp = () => {
        setOpenp(true);
    };

    const onClosep = () => {
        setOpenp(false);
        fetchproducto(currentPage);
    };

    const fetchproducto = async (page) => {
        try {
            const response = await fetch(API_URL + `/producto/listar/?page=${page}`);
            const data = await response.json();
            setProductos(data.productos);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        form.resetFields();
        fetchproducto(currentPage);
    }, []);

    useEffect(() => {
        const fetchUmList = async () => {
            try {
                const response = await fetch(API_URL + '/producto/listarum/');
                const data = await response.json();
                setUmList(data.unidades_medida);
            } catch (error) {
                console.error('Error fetching UM data:', error);
            }
        };

        const fetchCategoriaList = async () => {
            try {
                const response = await fetch(API_URL + '/producto/listar_categorias/');
                const data = await response.json();
                setCategoriaList(data.categorias);
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        };

        fetchUmList();
        fetchCategoriaList();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchproducto(page); 
    };

    const handleEditClick = (productId) => {
        console.log('Sucede');
        const productoToEdit = productos.find((producto) => producto.id_producto === productId.id_producto);
        setEditingProductId(productId.id_producto);
        setInitialFormValues(productoToEdit);
        console.log("aver:");
        console.log(initialFormValues);
        setEditModalVisible(true);
        fetchproducto(currentPage);
    };

    const handleCancelEdit = () => {

        setEditingProductId(null);
        setInitialFormValues(null);
        console.log("aver2:");
        console.log(initialFormValues);
        setEditModalVisible(false);
        fetchproducto(currentPage);
    };

    const validateImageFormat = (_, fileList) => {
        const isValidFormat = fileList.every(file => file.type.startsWith('image/'));
        if (!isValidFormat) {
            return Promise.reject('Solo se permiten archivos de imagen');
        }
        return Promise.resolve();
    };


    const fetchHorarioDetails = async (idHorario) => {
        try {
            console.log(idHorario);
            const response = await fetch(API_URL + '/horarios/get/' + idHorario);
            const data = await response.json();

            if (data.detalles) {
                setHorarioDetails(data.detalles);
            }
        } catch (error) {
            notification.warning({
                message: 'No hay horario',
                description: 'No haz creado un horario de atención para tu sucursal',
            });
        }
    };

    const handleSaveEdit = async (productId, formValues) => {
        try {
            const formData = new FormData();
            formData.append('impuestos', JSON.stringify(formValues.impuestos));

            const imagenpInput = formValues['imagenp'];
            if (imagenpInput && imagenpInput[0] && imagenpInput[0].originFileObj) {
                formData.append('imagenp', imagenpInput[0].originFileObj);
            }

            const response = await fetch(API_URL + `/producto/editarproducto/${productId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setEditingProductId(null);
                setInitialFormValues(null);
                setEditModalVisible(false);
                fetchproducto(currentPage);
            } else {
                console.error('Error updating product:', response.status, response.statusText);
                const responseData = await response.json();
                console.error('Server response:', responseData);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };


    const getCategoriaNombre = (idCategoria) => {
        const categoria = categoriaList.find((categoria) => categoria.id_categoria === idCategoria);
        return categoria ? categoria.catnombre : '';
    };

    const eliminarp = async (idpro) => {
        try {
            console.log('A');
            const formData = new FormData();
            console.log('B');
            formData.append('id_producto', idpro);
            console.log('C');
            const response = await fetch(API_URL + `/producto/EliminarProducto/`, {
                method: 'POST',
                body: formData,
            });
            console.log('D');

            if (response.ok) {
                message.success('Producto eliminado con éxito');
                fetchproducto(currentPage);
            } else {
                message.error(response.error || 'Hubo un error al realizar la solicitud');
            }
        } catch (error) {
            message.error('Hubo un error al realizar la solicitud' + error);
        }
    };

    const showModalContent = (producto) => {
        form.setFieldsValue({
            nombreproducto: producto.nombreproducto,
            descripcionproducto: producto.descripcionproducto,
            id_um: producto.id_um,
            id_categoria: producto.id_categoria,
            impuestos: producto.impuestos ? producto.impuestos.map((imp) => imp.id_impuesto) : [],
            puntosp: producto.puntosp,
            imagenp: [],
        });
    
        return (
            <Form form={form} onFinish={(values) => handleSaveEdit(producto.id_producto, values)}>
                <Form.Item label="Nombre del Producto" name="nombreproducto">
                    <Input />
                </Form.Item>
                <Form.Item label="Descripción del Producto" name="descripcionproducto">
                    <Input />
                </Form.Item>
                <Form.Item label="Unidad de Medida" name="id_um">
                    <Select>
                        {umList.map((um) => (
                            <Option key={um.id_um} value={um.id_um}>
                                {um.nombre_um}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Categoría" name="id_categoria">
                    <Select>
                        {categoriaList.map((categoria) => (
                            <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.catnombre}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="impuestos" label="Impuestos">
                    <Checkbox.Group>
                        {impuestos.map((impuesto) => (
                            <Checkbox key={impuesto.id_impuesto} value={impuesto.id_impuesto}>
                                {impuesto.nombre} ({impuesto.porcentaje}%)
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item label="Puntos" name="puntosp">
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Imagen del Producto"
                    name="imagenp"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                >
                    <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                        <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                    <Button onClick={handleCancelEdit}>Cancelar</Button>
                </Form.Item>
            </Form>
        );
    };
    return (
        <div>
            <Row>
                <Col md={12}>
                    <Segmented
                        options={[
                            {
                                label: (
                                    <Tooltip title="Productos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={imgproductos} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Productos',
                            },
                            {
                                label: (
                                    <Tooltip title="Categorías">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={categoriaproducto} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Categorias',
                            }
                            ,
                            {
                                label: (
                                    <Tooltip title="Tipos de productos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={tipoproducto} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'tipoproducto',
                            }
                            ,
                            {
                                label: (
                                    <Tooltip title="Unidad de medida">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={um} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'um',
                            }
                            ,
                            {
                                label: (
                                    <Tooltip title="Artículos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={articulo} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'articulo',
                            }
                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}
                    />
                </Col>
                {selectedOpcion === 'Productos' && (
                    <>
                        <Divider>Control productos</Divider>
                        <Col md={12}>
                            <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                                Crear nuevo producto
                            </Button>
                        </Col>
                        <Col md={12}>
                            <Row>
                                <ProductosList
                                    productos={productos}
                                    onEdit={handleEditClick}
                                    onDelete={eliminarp}
                                    categoriaList={categoriaList}
                                />
{
    
}

                            </Row>
                            {/* <Pagination current={currentPage} total={20} onChange={handlePageChange} pageSize={10} style={{ marginTop: '16px', textAlign: 'center' }} /> */}
                        </Col>
                    </>)}
                {selectedOpcion === 'Categorias' && (
                    <>
                        <Divider>Control categorías</Divider>
                        <Col md={12}>
                            <EditarCategoria />
                        </Col>
                    </>)}
                {selectedOpcion === 'tipoproducto' && (
                    <>
                        <Divider>Control tipo de productos</Divider>
                        <Col md={12}>
                            <EditarTipoProducto />
                        </Col>
                    </>)}
                {selectedOpcion === 'um' && (
                    <>
                        <Divider>Control unidad de medida</Divider>
                        <Col md={12}>
                            <EditarUnidadesMedida />
                        </Col>
                    </>)}
                {selectedOpcion === 'articulo' && (
                    <>
                        <Divider>Control de artículos</Divider>
                        <EditarComponenteForm />
                    </>)}
            </Row>
            <Modal
                title="Editar Producto"
                visible={editModalVisible}
                onCancel={handleCancelEdit}
                footer={null}
            >
                {editingProductId !== null && initialFormValues
                    ? showModalContent(initialFormValues)
                    : null}
            </Modal>
            <Drawer
                title="Crear producto"
                width={720}
                onClose={onClosep}
                open={openp}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <CrearProducto />
            </Drawer>
            <Drawer
                title="Horarios de producto"
                width={800}
                onClose={onCloseH}
                open={openH}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >

                <Row>
                    <Col md={6}>
                        <Segmented options={optionSucursales2}
                            value={selectedSucursal}
                            onChange={handleProductoChange}
                        />
                    </Col>
                </Row>
                {selectedSucursal != '' && horarioDetails != '' && (
                    <>
                        <CrearHorariosSemanales detalles={horarioDetails} onHorarioCreate={editHorarioCreate} />
                    </>
                )}
                {selectedSucursal != '' && horarioDetails == '' && (
                    <>
                        <CrearHorariosSemanales onHorarioCreate={handleHorarioCreate} />
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default EditarProducto;