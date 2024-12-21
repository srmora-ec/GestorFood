import React, { useState, useContext, useEffect } from "react";
import { Badge, Avatar } from 'antd';
import {
  Container,
  Nav,
  Modal,
  Navbar,
  NavDropdown,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import LoginForm from "../components/login";
import { Link, useNavigate } from "react-router-dom";
import RegistroForm from "../components/registro";
import ShoppingCart from "./shopingcart";
import Historial from "./Historial";
import ValidarPedido from "./Validarpedido";
import Carrusel from "./carrusel";
import { CartContext } from "../context/CarritoContext";
import { RecompensaContext } from "../context/RecompensaContext";
import carrito from './res/carrito.png';
import EditarUser from "./EditarUser";
import ListProductos from "./ListaProductos";
import Reclamar from "./ReclamarRecompensas";
import Reserva from "./Reserva";
import API_URL from '../config';
const NavBar = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const { cart, setCart, totalPoints2, calcularTotalPoints } = useContext(CartContext);
  const [recompensa, setrecompensa] = useContext(RecompensaContext);
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState(() => {
    // Obtener el componente seleccionado de localStorage al cargar la página
    const storedComponente = localStorage.getItem("ComponenteSeleccionado");
    return storedComponente || "Carrusel";
  });
  // const [empresaInfo, setEmpresaInfo] = useState(null);
  const [nombreEmpresa, setNombre] = useState(null);
  const [Logeado, setlogeado] = useState(null);
  const [logoEmpresa, setLogo] = useState(null);
  const [Direccion, setDireccion] = useState(null);
  // const [Correo, setCorreo] = useState(null);
  // const [open, setOpen] = useState(false);
  // const showDrawer = () => {
  //   setOpen(true);
  // };
  // const onClose = () => {
  //   setOpen(false);
  // };

  const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0) + recompensa.reduce((acc, curr) => acc + curr.quantity, 0);


  const navbarStyle = {
    backgroundColor: "#A80000",
  };

  const estiloNavLink = {
    fontSize: "12px",
    borderRadius: "15px",
    textDecoration: "none",
    color: "white",
    transition: "background-color 0.3s, color 0.3s",
    fontFamily: "Arial, sans-serif",
  };


  const manejarMouseOver = (e) => {
    e.target.style.backgroundColor = "black";
    e.target.style.color = "white";
  };

  const manejarMouseOut = (e) => {
    e.target.style.backgroundColor = "";
    e.target.style.color = "black";
  };
  const logoStyle = {
    color: "white",
    width: "50px",
    borderRadius: "50%",
  };
  const [MostrarModal, setMostrarModal] = useState(false);
  // const [Logeado, setLogeado] = useState(() => {
  //   const storedLogeado = localStorage.getItem("Logeado");
  //   return storedLogeado ? JSON.parse(storedLogeado) : false;
  // });
  const [ModalRegistroVisible, setModalRegistroVisible] = useState(false);

  const HacerClick = () => {
    setMostrarModal(true);
  };

  const CerrarModal = () => {
    setMostrarModal(false);
    setModalRegistroVisible(false);
  };
  const IniciarSesion = (userData) => {
    //   setLogeado(true);
    //   setMostrarModal(false);
    //   console.log("Usuario ha iniciado sesión:", userData);
    //   localStorage.setItem("Logeado", JSON.stringify(true));

  };

  const CerrarSesion = () => {
    // setLogeado(false);
    // setComponenteSeleccionado("Carrusel");
    // localStorage.removeItem("Logeado");

  };

  const RegresarAlLogin = () => {
    setModalRegistroVisible(false);
    setMostrarModal(true);
  };

  // const MostrarComponente = (component) => {
  //   setComponenteSeleccionado(component);

  //   // Almacenar el componente seleccionado en localStorage
  //   localStorage.setItem("ComponenteSeleccionado", component);
  // };

  // const Regresar = () => {
  //   setComponenteSeleccionado("Carrusel");
  // };




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
      // setEmpresaInfo(datos.empresa_info);
      console.log(datos.empresa_info);
      setNombre(datos.empresa_info.enombre);
      setLogo(datos.empresa_info.elogo);
      setDireccion(datos.empresa_info.direccion);
      // setCorreo(datos.empresa_info.correoelectronico);
    } catch (error) {
      console.error("Error al obtener la información de la empresa:", error);
    }
  };
  // const [userData, setUserData] = useState(null);
  // const id_cuenta = localStorage.getItem("id_cuenta");

  useEffect(() => {
    obtenerInformacionEmpresa();
    // ObtenerUsuario();
  }, []);

  return (
    <>
    
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
          <Navbar.Brand className="d-flex align-items-center" href="/" onClick={localStorage.removeItem("ComponenteSeleccionado")}>
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
        <Container>
          <Navbar.Collapse className="justify-content-end">
            <Nav className="ml-auto">
              <Nav.Link
                onClick={() => navigate("/menu/0")}
                style={estiloNavLink}
                onMouseOver={manejarMouseOver}
                onMouseOut={manejarMouseOut}
              >
                MENU
              </Nav.Link>
              <Link
                onClick={() => MostrarComponente("Carrito")}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "18px",
                }}

              >
                {" "}

                  <img
                    src={carrito}
                    alt="Logo"
                    width="30px"
                    style={{margin:'0px 10px'}}
                  />
              </Link>
              {Logeado && (
                <NavDropdown
                  style={{ ...estiloNavLink, borderRadius: "50%", color: "white" }}
                  onMouseOver={manejarMouseOver}
                  onMouseOut={manejarMouseOut}
                  title="Perfil"
                >
                  <NavDropdown.Item
                    onClick={() => MostrarComponente("Perfil")}
                    style={{ marginLeft: "auto", fontSize: "18px" }}
                  >
                    Ver perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => MostrarComponente("Historial")}
                    style={{ marginLeft: "auto", fontSize: "18px" }}
                  >
                    Ver Historial
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={CerrarSesion}
                    style={{ fontSize: "18px" }}
                  >
                    Cerrar sesion
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {Logeado && (
                <Nav.Link
                  onClick={() => MostrarComponente("Reserva")}
                  style={estiloNavLink}
                  onMouseOver={manejarMouseOver}
                  onMouseOut={manejarMouseOut}
                >
                  Reserva
                </Nav.Link>
              )}
              {Logeado && (
                <Nav.Link
                  onClick={() => MostrarComponente("ReclamarR")}
                  style={estiloNavLink}
                  onMouseOver={manejarMouseOver}
                  onMouseOut={manejarMouseOut}
                >
                  Puntos: {totalPoints2}
                </Nav.Link>
              )}
              {!Logeado && (
                <Nav.Link
                  onClick={HacerClick}
                  style={estiloNavLink}
                  onMouseOver={manejarMouseOver}
                  onMouseOut={manejarMouseOut}
                >
                  INGRESAR
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* {ComponenteSeleccionado != "Carrusel" && (
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
                  onClick={() => Regresar()}
                >
                  Atrás
                </Button>
              </Col>
            </Row>
          )} */}
      {/* Modal */}
      < Modal show={MostrarModal} onHide={CerrarModal} >
        <Modal.Header
          closeButton
          style={{ borderBottom: "none" }}
        ></Modal.Header>
        <Modal.Body>
          <LoginForm onLogin={IniciarSesion} />
        </Modal.Body>
      </Modal >

      <Modal show={ModalRegistroVisible} onHide={CerrarModal}>
        <Modal.Header
          closeButton
          style={{ borderBottom: "none" }}
        ></Modal.Header>
        <Modal.Body>
          <RegistroForm onGoBackToLogin={RegresarAlLogin} />
        </Modal.Body>
      </Modal>

    </>
  );
};

export default NavBar;
