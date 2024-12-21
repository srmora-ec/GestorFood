import React, { useState, useEffect } from 'react';
import { notification, Divider, Button, Input, Spin, Table } from 'antd';
import { Row, Col, Modal } from 'react-bootstrap';
import MapS from '../Clientes/MapasSucursales';
import Geosector from './geosector';
import API_URL from '../config.js';
const ZonasCover = () => {
    const [MostrarModal, setMostrarModal] = useState(false);
    const [MostrarModalEdit, setMostrarModalEdit] = useState(false);
    const [nombreGeo, setNombreGeo] = useState('');
    const [MostrarModalMoto, setMostrarModalMoto] = useState(false);
    const [rutas, setRutas] = useState([]);
    const [valorGeo, setValorGeo] = useState(false);
    const [idGeo, setidGeo] = useState(false);
    const handleMotorizados = (idGeosector) => {
        // Aquí debes buscar el geosector correspondiente al idGeosector seleccionado
        const geosectorSeleccionado = rutas.find(ruta => ruta.id_geosector === idGeosector);
        console.log('Que es esto?');
        console.log(geosectorSeleccionado.ubicaciones);
        if (geosectorSeleccionado) {
            setNombreGeo(geosectorSeleccionado.secnombre);
            setidGeo(idGeosector);
            setMostrarModalMoto(true);
            listRutas();
        } else {
            console.log('No se encontró el geosector correspondiente');
        }
    };

    const handleEditar = (idGeosector) => {
        // Aquí debes buscar el geosector correspondiente al idGeosector seleccionado
        const geosectorSeleccionado = rutas.find(ruta => ruta.id_geosector === idGeosector);
        console.log('Que es esto?');
        console.log(geosectorSeleccionado.ubicaciones);
        if (geosectorSeleccionado) {
            setValorGeo(geosectorSeleccionado.ubicaciones);
            setNombreGeo(geosectorSeleccionado.secnombre);
            setidGeo(idGeosector);
            setMostrarModalEdit(true);
            listRutas();
        } else {
            console.log('No se encontró el geosector correspondiente');
        }
    };

    const CerrarModal = () => {
        setMostrarModal(false);
    };
    const CerrarModalEdit = () => {
        setMostrarModalEdit(false);
    };
    const CerrarModalMoto = () => {
        setMostrarModalMoto(false);
    };

    useEffect(() => {
        listRutas();
    }, []);

    const listRutas = async () => {
        try {
            const response = await fetch(API_URL + '/sucursal/lisrutas/', {
                method: 'GET',
            })
            const responseData = await response.json();
            if (responseData.rutas) {
                setRutas(responseData.rutas);
                console.log(responseData.rutas);
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario:' + error,
            });
        }
    }
    const guardarRuta = async (jsondetalle) => {
        console.log(nombreGeo);
        try {
            console.log('Lllega algo:');
            console.log(jsondetalle);
            if (nombreGeo) {
                const formDataObject = new FormData();
                formDataObject.append('datosGeosector', JSON.stringify(jsondetalle));
                formDataObject.append('secnombre', nombreGeo);
                formDataObject.append('secdescripcion', 'Sector de atencion');
                formDataObject.append('tipo', 'R');
                const response = await fetch(API_URL + '/sucursal/crearGeosector/', {
                    method: 'POST',
                    body: formDataObject,
                });


                const responseData = await response.json();

                if (responseData.mensaje) {
                    notification.success({
                        message: 'Éxito',
                        description: 'Se creo la ruta con exito',
                    });
                    setNombreGeo('');
                    setMostrarModal(false);
                    listRutas();
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Error al crear la ruta: ' + responseData.error,
                    });
                }
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Completa los campos',
                });
            }

        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario:' + error,
            });
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_geosector',
            key: 'id_geosector',
        },
        {
            title: 'Nombre de la ruta',
            dataIndex: 'secnombre',
            key: 'secnombre',
        },
        {
            title: 'Fecha de creación',
            dataIndex: 'fechacreaciong',
            key: 'fechacreaciong',
            render: (text) => {
                const fecha = new Date(text);
                const fechaFormateada = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                const horaFormateada = fecha.toLocaleTimeString(); // Formato HH:mm:ss
                return <>{fechaFormateada} || {horaFormateada}</>;
            },
        }, {
            title: 'Editar',
            dataIndex: 'id_geosector',
            key: 'id_geosector',
            render: (id) => {
                return <>
                <Button onClick={() => handleEditar(id)}>
                    Editar
                </Button>  <Button onClick={() => handleMotorizados(id)}>
                    Motorizados
                </Button>
                </>;
            },
        }]

        const EditarRuta = async (jsondetalle) => {
            console.log(nombreGeo);
            try {
                console.log('Lllega algo:');
                console.log(jsondetalle);
                if (nombreGeo) {
                    const formDataObject = new FormData();
                    formDataObject.append('datosGeosector', JSON.stringify(jsondetalle));
                    formDataObject.append('secnombre', nombreGeo);
                    formDataObject.append('secdescripcion', 'Sector de atencion');
                    formDataObject.append('tipo', 'R');
                    formDataObject.append('id_geosector',idGeo)
                    const response = await fetch(API_URL + '/sucursal/editarGeosector/', {
                        method: 'POST',
                        body: formDataObject,
                    });
    
    
                    const responseData = await response.json();
    
                    if (responseData.mensaje) {
                        notification.success({
                            message: 'Éxito',
                            description: 'Se edito la ruta con exito',
                        });
                        setNombreGeo('');
                        setMostrarModalEdit(false);
                        listRutas();
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'Error al editar la ruta: ' + responseData.error,
                        });
                    }
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Completa los campos',
                    });
                }
    
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'Error al validar el formulario:' + error,
                });
            }
        }

    return (
        <div>
            <Row>
                <Divider>Zonas de cobertura</Divider>
                <Col md={12}>
                    <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={() => setMostrarModal(true)}>
                        Crear zona de cobertura
                    </Button>
                </Col>
                <Col md={12}>
                    <Table columns={columns} dataSource={rutas} />
                </Col>
            </Row>
            <Modal show={MostrarModal} onHide={CerrarModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Crear zona</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                            Ingresa el nombre de tu zona:
                        </Col>
                        <Col md={8}>
                            <Input
                                onChange={(e) => setNombreGeo(e.target.value)}
                                style={{ width: "100%", height: "40px" }}
                            />
                        </Col>
                    </Row>
                    <Geosector onGeoSectorSave={guardarRuta} />
                </Modal.Body>
            </Modal>
            <Modal show={MostrarModalEdit} onHide={CerrarModalEdit} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar zona</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                            Ingresa el nombre de tu zona:
                        </Col>
                        <Col md={8}>
                            <Input
                            value={nombreGeo}
                                onChange={(e) => setNombreGeo(e.target.value)}
                                style={{ width: "100%", height: "40px" }}
                            />
                        </Col>
                    </Row>
                    {valorGeo && (
                        <Geosector style={{height:'500px'}} onGeoSectorSave={EditarRuta} prevValores={valorGeo} shadedPolygonCoordinates={{ latitude: valorGeo[0].latitud, longitude: valorGeo[0].longitud }} tipogeo={'R'}/>
                    )}
                </Modal.Body>
            </Modal>
            <Modal show={MostrarModalMoto} onHide={CerrarModalMoto} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Motorizados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        
                    </Row>
                </Modal.Body>
            </Modal>
        </div>

    )

};

export default ZonasCover;