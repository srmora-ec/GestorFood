import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Image, Avatar, Card, Badge, Tooltip, Divider } from "antd";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Dropdown,
  Offcanvas,
} from "react-bootstrap";
import imgempresa from "./res/imgempresa.png";
import imgValidar from "./res/validar.png";
import imgempleado from "./res/imgempleado.png";
import imgproductos from "./res/imgproductos.png";
import imgaviso from "./res/imgaviso.png";
import imgmesas from "./res/imgmesas.png";
import imgcombos from "./res/imgcombos.png";
import imgrecompensa from "./res/imgrecompensa.png";
import imgzonas from "./res/zonaentrega.png"
import imcocina from "./res/cocinar.png";
import imgbodegas from "./res/imgbodegas.png";
import imginventario from "./res/imginventario.png";
import logosri from "./res/logosri.png";
import Empresa from "./Empresa";
import Empleados from "./empleados.jsx";
import Sucursales from "./sucursales.jsx";
import subsidiario from "./res/subsidiario.png";
import EditarProducto from "./editarproducto.jsx";
import proveedor from "./res/proveedor.png";
import Combos from "./combo.jsx";
import Bodegas from "./bodegas.jsx";
import Mesas from "./editarmesa.jsx";
import EditarBodegaForm from "./editarbodega.jsx";
import Proveedores from "./proveedores.jsx";
import Inventario from "./editarinventario.jsx";
import ZonasCover from "./zonascobertura.jsx";
import Pagos from "./res/pagosempleado.png";
import CrearRecompensaProductoForm from "./CrearRecompensaProducto.jsx";
import Recompensa from "./recompensa.jsx";
import EditarRecompensaProductoForm from "./EditarRecompensaProducto.jsx";
import EditarAvisos from "./editaravisos.jsx";
import imgreserva from "./res/imgreserva.png";
import reverso from "./res/reverso.png";
import EditarReservacionesForm from "./EditarReservacion.jsx";
import PagosE from "./pagose.jsx";
import MovimientosInventario from "./ReversionMovimientosInventario.jsx";
import SRI from "./SRI.jsx";
import VerReversionesPedidos from "./ReversionesPedidos.jsx";
import ReportManagement from "./reporte.jsx";
import ValidarPedido from "../Clientes/Validarpedido.jsx";
import reportes from "./res/reportes.png";
import maquina from "./res/maquina.png";
import datosB from "./res/datosB.png";
import PuntosFacturacion from "./puntosFacturacion.jsx";
import DatosB from "./DatosBancarios.jsx";

const MenuG = ({menuSelect}) => {
  const { Meta } = Card;
  const tooltipTitle = "Configura tu empresa";
  const tooltipTitle2 = "Agrega y edita tus empleados";
  const tooltipTitle3 = "Agrega y edita productos";
  const tooltipTitle4 = "Agrega y edita anuncios para los clientes";
  const tooltipTitle5 = "Agrega y edita mesas para las sucursales";
  const tooltipTitle6 = "Agrega y edita combos de los productos";
  const tooltipTitle7 = "Agrega y gestiona las rescompensas de los productos";
  const tooltipTitle8 = "Agrega y gestiona tus sucursales";
  const tooltipTitle9 = "Agrega y gestiona las bodegas";
  const tooltipTitle10 = "Agrega y gestiona tus proveedores";
  const tooltipTitle11 = "Agrega y gestiona tus inventarios";
  const tooltipTitle12 = "Prepara insumos y productos";
  const tooltipTitle13 = "Agrega y edita reservaciones";
  const tooltipTitle14 = "Registra los pagos de tus empleados";
  const tooltipTitle15 = "Control de reversiones";
  const tooltipTitle16 = "Gestiona los codigos de tus facturas";
  const tooltipTitle17 = "Gestión de reportes";
  const tooltipTitle18 = "Validar pagos de pedidos";
  const tooltipTitle19 = "Gestiona tus puntos de facturación";
  const tooltipTitle20 = "Agrega tus datos bancarios";
  const tooltipTitle21="Agrega zonas de entrega"

  const [currentPage, setCurrentPage] = useState("home");

  const handleCardClick = (page) => {
    console.log("Clicked on:", page);
    setCurrentPage(page);
    menuSelect(page);
  };

  const handleAtrasClick = (page) => {
    console.log("Clicked on:", page);
    setCurrentPage("home");
    menuSelect("home");
  };

  const cardStyle = {
    width: "100%",
    height: "50%",
    margin: "16px",
    marginLeft: "1px",
    backgroundColor: "#CDEECC",
    border: "1px solid #A4A4A4",
  };

  const titleStyle = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const openNewWindow = () => {
    window.open("/cocina", "_blank");
  };

  return (
    <>
      <Row>
        {currentPage === "home" && (
          <>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Empresa">
                <Tooltip title={tooltipTitle}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Empresa"
                        src={imgempresa}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("empresa")}
                  >
                    <Meta title={tooltipTitle}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Empleados" color="pink">
                <Tooltip title={tooltipTitle2}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Empleados"
                        src={imgempleado}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("empleado")}
                  >
                    <Meta title={tooltipTitle2}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Productos" color="red">
                <Tooltip title={tooltipTitle3}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Productos"
                        src={imgproductos}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("productos")}
                  >
                    <Meta title={tooltipTitle3}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Combos" color="green">
                <Tooltip title={tooltipTitle6}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Combos"
                        src={imgcombos}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("combos")}
                  >
                    <Meta title={tooltipTitle6}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Anuncios principales" color="cyan">
                <Tooltip title={tooltipTitle4}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Avisos principales"
                        src={imgaviso}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("avisos")}
                  >
                    <Meta title={tooltipTitle4}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Mesas" color="yellow">
                <Tooltip title={tooltipTitle5}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Mesas"
                        src={imgmesas}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("mesas")}
                  >
                    <Meta title={tooltipTitle5}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Recompensas" color="purple">
                <Tooltip title={tooltipTitle7}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Recompensas"
                        src={imgrecompensa}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("Recompensas")}
                  >
                    <Meta title={tooltipTitle7}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Sucursales" color="#F84173">
                <Tooltip title={tooltipTitle8}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Sucursales"
                        src={subsidiario}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("sucursal")}
                  >
                    <Meta title={tooltipTitle8}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Bodegas" color="#F84173">
                <Tooltip title={tooltipTitle9}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Bodegas"
                        src={imgbodegas}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("bodegas")}
                  >
                    <Meta title={tooltipTitle9}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Proveedores" color="#7C1818">
                <Tooltip title={tooltipTitle10}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Proveedores"
                        src={proveedor}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("proveedores")}
                  >
                    <Meta title={tooltipTitle10}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Inventario" color="#7C1818">
                <Tooltip title={tooltipTitle11}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Inventario"
                        src={imginventario}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("inventario")}
                  >
                    <Meta title={tooltipTitle11}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Cocina" color="#4CAF50">
                <Tooltip title={tooltipTitle12}>
                  <Card
                    hoverable
                    style={cardStyle}
                    onClick={openNewWindow}
                    cover={
                      <Image
                        alt="Cocina"
                        src={imcocina}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                  >
                    <Meta title={tooltipTitle12}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Pagos empleados" color="#7C1818">
                <Tooltip title={tooltipTitle14}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Pagos"
                        src={Pagos}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("pagose")}
                  >
                    <Meta title={tooltipTitle14}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Reversiones" color="red">
                <Tooltip title={tooltipTitle15}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="reverso"
                        src={reverso}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("reversion")}
                  >
                    <Meta title={tooltipTitle15}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="SRI" color="red">
                <Tooltip title={tooltipTitle16}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="sri"
                        src={logosri}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("sri")}
                  >
                    <Meta title={tooltipTitle16}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Reportes" color="#359BE6">
                <Tooltip title={tooltipTitle17}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Reportes"
                        src={reportes}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("reporte")}
                  >
                    <Meta title={tooltipTitle17}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Validar pedidos" color="#162703">
                <Tooltip title={tooltipTitle18}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Pedidos"
                        src={imgValidar}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("validar")}
                  >
                    <Meta title={tooltipTitle18}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Puntos de facturación" color="#162703">
                <Tooltip title={tooltipTitle19}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Puntos de facturación"
                        src={maquina}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("puntosfactura")}
                  >
                    <Meta title={tooltipTitle19}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Datos bancarios" color="#162703">
                <Tooltip title={tooltipTitle20}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Datos bancarios"
                        src={datosB}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("DatosBancarios")}
                  >
                    <Meta title={tooltipTitle20}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={12} sm={6} md={5} lg={3}>
              <Badge.Ribbon text="Zonas de entrega" color="#162703">
                <Tooltip title={tooltipTitle21}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Datos bancarios"
                        src={imgzonas}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("Zonas")}
                  >
                    <Meta title={tooltipTitle21}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            {/*<Col xs={24} sm={12} md={5} lg={3}>
              <Badge.Ribbon text="Reservaciones" color="#4CAF50">
                <Tooltip title={tooltipTitle13}>
                  <Card
                    hoverable
                    style={cardStyle}
                    onClick={() => handleCardClick("reserva")}
                    cover={
                      <Image
                        alt="Reservaciones"
                        src={imgreserva}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                  >
                    <Meta title={tooltipTitle13}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>*/}
          </>
        )}
        {currentPage === "empresa" && (
          <>
            <Row>
              <Col md={12}>
                <Empresa />
              </Col>
            </Row>
          </>
        )}
        {currentPage === "Zonas" && (
          <>
            <Row>
              <Col md={12}>
                <ZonasCover/>
              </Col>
            </Row>
          </>
        )}
        {currentPage === "empleado" && (
          <>
            <Row>
              <Col md={12}>
                <Empleados />
              </Col>
            </Row>
          </>
        )}
        {currentPage === "sucursal" && (
          <>
            <Row>
              <Col md={12}>
                <Sucursales />
              </Col>
            </Row>
          </>
        )}
        {currentPage != "home" && (
          <>
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
                  onClick={() => handleAtrasClick()}
                >
                  Atrás
                </Button>
              </Col>
            </Row>
          </>
        )}
        {currentPage == "productos" && (
          <>
            <Divider>Productos</Divider>
            <Row>
              <Col md={12}>
                <EditarProducto />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "combos" && (
          <>
            <Divider>Combos</Divider>
            <Row>
              <Col md={12}>
                <Combos />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "mesas" && (
          <>
            <Divider>Mesas</Divider>
            <Row>
              <Col md={12}>
                <Mesas />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "bodegas" && (
          <>
            <Divider>Bodegas</Divider>
            <Row>
              <Col md={12}>
                <EditarBodegaForm />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "proveedores" && (
          <>
            <Divider>Proveedores</Divider>
            <Row>
              <Col md={12}>
                <Proveedores />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "inventario" && (
          <>
            <Divider>Inventario</Divider>
            <Row>
              <Col md={12}>
                <Inventario />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "Recompensas" && (
          <>
            <Divider>Recompensas</Divider>
            <Row>
              <Col md={12}>
                <Recompensa />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "avisos" && (
          <>
            <Divider>Avisos</Divider>
            <Row>
              <Col md={12}>
                <EditarAvisos />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "reserva" && (
          <>
            <Divider>Reservaciones</Divider>
            <Row>
              <Col md={12}>
                <EditarReservacionesForm />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "pagose" && (
          <>
            <Divider>Pagos</Divider>
            <Row>
              <Col md={12}>
                <PagosE />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "reversion" && (
          <>
            <Divider>Reversiones</Divider>
            <Row>
              <Col md={12}>
                <VerReversionesPedidos />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "sri" && (
          <>
            <Divider>SRI</Divider>
            <Row>
              <Col md={12}>
                <SRI />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "reporte" && (
          <>
            <Divider>Reportes</Divider>
            <Row>
              <Col md={12}>
                <ReportManagement />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "validar" && (
          <>
            <Divider>Validar Pedidos</Divider>
            <Row>
              <Col md={12}>
                <ValidarPedido />
              </Col>
            </Row>
          </>
        )}
        {currentPage == "puntosfactura" && (
          <>
            <Divider>Puntos de facturación</Divider>
            <Row>
              <Col md={12}>
                <PuntosFacturacion />
              </Col>
            </Row>
          </>
        )}
      </Row>
      {currentPage == "DatosBancarios" && (
          <>
            <Divider>Ingrese sus datos bancarios</Divider>
            <Row>
              <Col md={12}>
                <DatosB />
              </Col>
            </Row>
          </>
        )}
    </>
  );
};

export default MenuG;
