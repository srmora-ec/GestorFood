import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Image, Avatar, Card, Badge, Watermark } from 'antd';
import { Container, Row, Col, Button, Form, Nav, Navbar, NavDropdown, Dropdown, Offcanvas } from 'react-bootstrap';
import EditarCliente from './editarcliente.jsx';
import MenuG from './menu.jsx';
import API_URL from '../config.js';


const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Meta } = Card;

const AdminMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [empresaInfo, setEmpresaInfo] = useState(null);
    const [sucursalesInfo, setSucursalesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [menuSeleccionado, setMenuSeleccionado] = useState("home");
    const[spaceMenu, setSpaceMenu]=useState(9);
    const obtenerInformacionEmpresa = async () => {
        try {
            const respuesta = await fetch(API_URL +'/empresa/infoEmpresa/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            console.log();
            const datos = await respuesta.json();
            console.log(datos.empresa_info);
            setEmpresaInfo(datos.empresa_info);
            setLoading(false);
            fetch(API_URL +'/sucursal/sucusarleslist/')
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.sucursales)
                    setSucursalesData(data.sucursales);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error al obtener los datos de sucursales:', error);
                    setLoading(false);
                });
        } catch (error) {
            console.error('Error al obtener la información de la empresa:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerInformacionEmpresa();
    }, []);
    const cambioMenu = (value) =>{
        setMenuSeleccionado(value);
        if(value=="home"){
            setSpaceMenu(9);
        }else{
            setSpaceMenu(12);
        }
        
    }

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleSubMenuClick = (key) => {
        setSelectedSubMenu(key);
    };

    const handleClearLocalStorage = () => {

        window.location.href = '/';
        localStorage.clear();

        console.log('LocalStorage limpiado.');
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL +'/Login/rol/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('token'),
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const rol = data.rol;

                    if (rol !== 'A') {
                        window.location.href = '/';
                    }
                } else {
                    // Manejar errores de la solicitud a la API
                    window.location.href = '/';
                }
            } catch (error) {
                // Manejar errores de la solicitud
                console.error('Error en la solicitud:', error);
            }
        };
        fetchData();
    }, []);


    return (
        <>
            <div style={{ backgroundColor: '#DBE3E3', padding: '0.5%' }}>
                <Navbar expand="lg" style={{ backgroundColor: '#4CAF50', color: '#fff', borderRadius: '10px' }}>
                    <Container fluid>
                        <Navbar.Brand href="/home">
                            {empresaInfo && empresaInfo.elogo && (
                                <img src={`data:image/png;base64,${empresaInfo.elogo}`} width={50} style={{ borderRadius: '50%' }} />
                            )}
                            <strong style={{ fontWeight: 'bold', fontSize: '15px' }}>      CONTROL ADMINISTRADOR</strong>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                            </Nav>
                            <Form className="d-flex">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                        <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}> Perfil</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1" onClick={handleClearLocalStorage}>Salir</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Row>
                    
                    <Col>
                        <Card
                            hoverable
                            style={{ height: '96%', width: '100%', margin: '16px', marginLeft: '2px', marginBottom: '16px', cursor: 'default' }}
                            className="text-center"
                        >
                            <MenuG menuSelect={cambioMenu} />
                        </Card>
                    </Col>
                </Row>

            </div >
        </>
    );
};

export default AdminMenu;