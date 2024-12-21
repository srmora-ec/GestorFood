import React, { useState, useContext, useEffect, useMediaQuery } from "react";
import { Card, Tooltip, Popover, Spin } from 'antd';
import {
    Container,
    Nav,
    Modal,
    Navbar,
    NavDropdown,
    Button, Row, Col,
} from "react-bootstrap";
import logo from "../assets/images/descargar.jpg";
import LoginForm from "../components/login";
import { Link } from "react-router-dom";
import RegistroForm from "../components/registro";
import ShoppingCart from "./shopingcart";
import Historial from "./Historial";
import ValidarPedido from "./Validarpedido";
import Carrusel from "./carrusel";
import { CartContext } from "../context/CarritoContext";
import EditarUser from "./EditarUser";
import ListProductos from "./ListaProductos";
import Reserva from "./Reserva";
import "../components/comanda.css";
import API_URL from '../config';
import MapS from "./MapasSucursales";

const Sucursalescliente = () => {
    const [cart, setCart] = useContext(CartContext);
    const [ComponenteSeleccionado, setComponenteSeleccionado] =
        useState("Sucursales");
    const [empresaInfo, setEmpresaInfo] = useState(null);
    const [nombreEmpresa, setNombre] = useState(null);
    const [logoEmpresa, setLogo] = useState(null);
    const [Direccion, setDireccion] = useState(null);
    const [Correo, setCorreo] = useState(null);
    const [sucursalesData, setSucursalesData] = useState([]);
    const [estadoApertura, setEstadoApertura] = useState(null);
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [loading, setLoading] = useState(true);


    const quantity = cart.reduce((acc, curr) => {
        return acc + curr.quantity;
    }, 0);
    const diasEnEspanol = {
        L: 'Lunes',
        M: 'Martes',
        X: 'Miercoles',
        J: 'Jueves',
        V: 'Viernes',
        S: 'Sabado',
        D: 'Domingo',
    };

    const formatHorario = (detalles) => {
        return detalles.map((detalle) => {
            const dia = diasEnEspanol[detalle.dia];
            const horaInicio = detalle.horainicio.slice(0, 5);
            const horaFin = detalle.horafin.slice(0, 5);
            return `${dia}: ${horaInicio} - ${horaFin}`;
        });
    };

    const navbarStyle = {
        backgroundColor: "#A80000",
    };

    const estiloNavLink = {
        fontSize: "12px",
        borderRadius: "15px",
        textDecoration: "none",
        color: "white",
        transition: "background-color 0.3s, color 0.3s", // Agrega una transición suave
        fontFamily: "Arial, sans-serif",
    };

    const manejarMouseOver = (e) => {
        e.target.style.backgroundColor = "black"; // Cambia el color de fondo al pasar el mouse
    };

    const manejarMouseOut = (e) => {
        e.target.style.backgroundColor = ""; // Restaura el color de fondo al salir del mouse
        e.target.style.color = "white"; // Restaura el color del texto al salir del mouse
    };
    const logoStyle = {
        color: "white",
        width: "50px",
        borderRadius: "50%",
    };
    const [MostrarModal, setMostrarModal] = useState(false);
    const [Logeado, setLogeado] = useState(false);
    const [ModalRegistroVisible, setModalRegistroVisible] = useState(false);

    const HacerClick = () => {
        setMostrarModal(true);
    };

    const CerrarModal = () => {
        setMostrarModal(false);
        setModalRegistroVisible(false);
    };
    const IniciarSesion = (userData) => {
        setLogeado(true);
        setMostrarModal(false);
        console.log("Usuario ha iniciado sesión:", userData);
    };

    const CerrarSesion = () => {
        setLogeado(false);
        setComponenteSeleccionado("Sucursales");
    };

    const RegresarAlLogin = () => {
        setModalRegistroVisible(false);
        setMostrarModal(true);
    };

    const MostrarComponente = (component) => {
        setComponenteSeleccionado(component);
    };

    const Regresar = () => {
        setComponenteSeleccionado("Sucursales");
    };

    const obtenerInformacionEmpresa = async () => {
        try {
            const respuesta = await fetch(
                API_URL + "/empresa/infoEmpresa/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                }
            );

            const datos = await respuesta.json();
            setEmpresaInfo(datos.empresa_info);
            console.log(datos.empresa_info);
            setNombre(datos.empresa_info.enombre);
            setLogo(datos.empresa_info.elogo);
            setDireccion(datos.empresa_info.direccion);
            setCorreo(datos.empresa_info.correoelectronico);
        } catch (error) {
            console.error("Error al obtener la información de la empresa:", error);
        }
    };

    const handleSucursalClick = (sucursal) => {
        setSelectedSucursal(sucursal);
    }

    const id_cuenta = localStorage.getItem('id_cuenta');
    useEffect(() => {
        if (id_cuenta) {
            obtenerInformacionEmpresa();
            listarsucursales();
            fetch(API_URL + `/Login/obtener_usuario/${id_cuenta}/`)
                .then(response => response.json())
                .then(data => {
                    setUserData(data.usuario);

                    setLocationData({
                        latitud1: data.usuario?.ubicacion1?.latitud || undefined,
                        longitud1: data.usuario?.ubicacion1?.longitud || undefined,
                        latitud2: data.usuario?.ubicacion2?.latitud || undefined,
                        longitud2: data.usuario?.ubicacion2?.longitud || undefined,
                        latitud3: data.usuario?.ubicacion3?.latitud || undefined,
                        longitud3: data.usuario?.ubicacion3?.longitud || undefined,
                    });

                })
                .catch(error => console.error('Error al obtener datos del usuario:', error));
        } else {
            console.error('Nombre de usuario no encontrado en localStorage');
        }
    }, []);
    const listarsucursales = () => {
        fetch(API_URL + '/sucursal/sucusarleslist/')
            .then((response) => response.json())
            .then((data) => {
                console.log(data.sucursales);
                const now = new Date();
                const dayOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][now.getDay()];
                const month = now.getMonth() + 1; // Los meses en JavaScript son de 0 a 11, así que sumamos 1
                const day = now.getDate();
                console.log('Día de la semana actual:', dayOfWeek);

                const sucursalesConEstado = data.sucursales.map((sucursal) => {
                    const horarioAbierto = sucursal.horario && sucursal.horario.detalles
                        ? sucursal.horario.detalles.find(
                            (detalle) => {
                                const fechaInicio = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horainicio}`);
                                const fechaFin = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horafin}`);

                                console.log('Fecha de inicio:', fechaInicio);
                                console.log('Fecha de fin:', fechaFin);
                                console.log('dia actual:', detalle.dia);
                                console.log('Fecha actual:', now);
                                return detalle.dia === dayOfWeek &&
                                    fechaInicio <= now &&
                                    fechaFin >= now;
                            }
                        )
                        : null;

                    return {
                        ...sucursal,
                        estadoApertura: horarioAbierto ? 'Abierto ahora' : 'Cerrado',
                    };
                });
                setSucursalesData(sucursalesConEstado);
                console.log(sucursalesConEstado);
            })
            .catch((error) => {
                console.error('Error al obtener los datos de sucursales:', error);
            })
            .finally(() => setLoading(false))

    };

    return (
        <>
            <div className='contentlight' style={{ height: '100%', minHeight: '100vh' }}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Merienda:wght@300..900&display=swap"
                    rel="stylesheet"
                />
                <Row style={{ background: "black", color: "white", height: "25px" }}>
                    <Col
                        md={12}
                        className="d-flex justify-content-center align-items-center"
                    >
                        {Direccion}
                    </Col>
                </Row>
                <Navbar expand="lg" style={navbarStyle}>
                    <Container>
                        <Navbar.Brand className="d-flex align-items-center" href="/">
                            <img
                                src={`data:image/png;base64,${logoEmpresa}`}
                                alt="Logo"
                                style={logoStyle}
                            />
                            <span
                                style={{
                                    color: "white",
                                    fontSize: "20px",
                                    fontFamily: "Merienda",
                                    marginLeft: "5px",
                                }}
                            >
                                {nombreEmpresa}
                            </span>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </Container>
                </Navbar>
                <Spin spinning={loading} tip="Cargando..." style={{ height: '500px' }}>
                    <div>
                        {ComponenteSeleccionado === "Sucursales" && (
                            <>
                                <Row>
                                    <Col md={24} >
                                        <div style={{ background: 'white', border: "1px solid #A4A4A4", padding: '15px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'black', display: 'block', textAlign: 'center', fontSize: '20px' }}>
                                                ENCUENTRANOS CERCA DE TI
                                            </span>
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col md={2} >
                                        {sucursalesData.map((sucursal) => (
                                            <Card
                                                hoverable
                                                title={
                                                    <Tooltip title={sucursal.snombre}>
                                                        {sucursal.snombre}
                                                    </Tooltip>
                                                }
                                                style={{
                                                    width: "auto",
                                                    border: "1px solid #A4A4A4",
                                                    margin: "10px",
                                                }}
                                                cover={
                                                    <a href={'#mapa'} className="map-link">
                                                        <img
                                                            alt="Descarga la aplicación movil"
                                                            src={`data:image/png;base64,${sucursal.imagensucursal}`}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        />
                                                    </a>

                                                }
                                                onClick={() => handleSucursalClick(sucursal)} // Manejador de clics para cada tarjeta de sucursal
                                                className="text-center"
                                            >
                                                {sucursal.horario && (
                                                    <Popover
                                                    key={sucursal.id_sucursal}
                                                    title={"Horario:"}
                                                    content={
                                                        <div style={{ width: "100%" }}>
                                                            <ul>
                                                                {
                                                                    formatHorario(sucursal.horario.detalles).map((horar, index) => (
                                                                        <li key={index}>{horar}</li>
                                                                    ))}
                                                            </ul>
                                                        </div>
                                                    }
                                                    placement="bottom"
                                                    responsive

                                                >
                                                    <spam style={{ fontWeight: 'bold', color: 'black', display: 'block' }}>{sucursal.sdireccion}</spam>
                                                    <span style={{ color: sucursal.estadoApertura === 'Abierto ahora' ? 'green' : 'red' }}>
                                                        {sucursal.estadoApertura}
                                                    </span>
                                                </Popover>
                                                )}
                                                
                                            </Card>
                                        ))}
                                    </Col>
                                    <Col md={10} >
                                        <Card
                                            id={'mapa'}
                                            hoverable
                                            title={"Encuentra tu sucursal"}
                                            style={{
                                                width: "auto",
                                                border: "1px solid #A4A4A4",
                                                margin: "10px",

                                            }}
                                            cover={
                                                <MapS sucursales={sucursalesData} logo={logoEmpresa} selectedSucursal={selectedSucursal} onSucursalClick={handleSucursalClick}
                                                ></MapS>
                                            }
                                            className="text-center"
                                        >
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}
                        <Row>
                            <Col md={12}>
                                <Button
                                    variant="success"
                                    style={{
                                        position: "fixed",
                                        right: "16px",
                                        bottom: "16px",
                                        zIndex: 1000,
                                    }}
                                    href="/"
                                >
                                    Atrás
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        </>
    );
};

export default Sucursalescliente;
