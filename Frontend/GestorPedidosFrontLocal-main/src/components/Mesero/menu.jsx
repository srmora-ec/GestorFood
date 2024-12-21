import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import {
  Image,
  Card,
  Badge,
  Tooltip,
  Divider,
  Modal,
  Table,
  notification,
} from "antd";
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
import imgtomarpedido from "./res/imgtomarpedido.png";
import imgfacturas from "./res/imgfacturas.png";
import validando from "./res/validando.png";
import ReversoFactura from "./res/ReversoFactura.png";

import RealizarPedidoMesero from "./pedidomesa";
import FacturasMesero from "./facturasmesero";
import RealizarPedidoLocal from "./pedidoslocal";
import ValidarFacturas from "./validarfacturas";
import API_URL from '../../config';
import ReversionesFacturas from "./GestionReversiones";

const MenuM = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [CantPedidosP, setCantPedidosP] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionNotification, setPermissionNotification] = useState({
    message: "",
    description: "",
  });

  useEffect(() => {
    validarPermisos();
  }, []);

  const validarPermisos = () => {
    const idCuenta = localStorage.getItem("id_cuenta");
    fetch(
      API_URL +`/CodigoFactura/validar_permisos_factura/${idCuenta}/`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setHasPermission(false);
        } else {
          setHasPermission(true);
        }
      })
      .catch((error) => {
        console.error("Error al validar permisos:", error);
        setHasPermission(false);
      });
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const { Meta } = Card;
  const tooltipTitle = "Realiza pedidos a las mesas";
  const tooltipTitle1 = "Ver tus facturas";
  const tooltipTitle2 = "Gestiona tus pedidos";
  const tooltipTitle3 = "Gestion de reversiones";

  const [userData, setUserData] = useState(null);
  const id_cuenta = localStorage.getItem("id_cuenta");

  const ObtenerUsuario = async () => {
    if (id_cuenta) {
      fetch(API_URL +`/Mesero/obtener_usuario/${id_cuenta}/`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.mesero);
          console.log("Datos del usuario:", data.mesero); // Imprimir los datos del usuario por consola
        })
        .catch((error) =>
          console.error("Error al obtener datos del usuario:", error)
        );
    } else {
      console.error("Nombre de usuario no encontrado en localStorage");
    }
  };

  useEffect(() => {
    ObtenerUsuario();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_pedido",
      key: "id_pedido",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
    },
    {
      title: "Mesa Asociada",
      dataIndex: "mesa_asociada",
      key: "mesa_asociada",
      render: (mesa_asociada) => (
        <Badge
          color={mesa_asociada ? "#F08C1E" : "#50B496"}
          count={mesa_asociada ? mesa_asociada.observacion : "Local"}
        />
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_del_pedido",
      key: "estado_del_pedido",
      render: (estado_del_pedido) => (
        <Badge
          count={estado_del_pedido === "O" ? "Ordenado" : "Preparado"}
          style={{
            backgroundColor: estado_del_pedido === "O" ? "#f5222d" : "#52c41a",
          }}
        />
      ),
    },
    {
      title: "Accion",
      dataIndex: "estado_del_pedido",
      key: "Accion",
      render: (estado_del_pedido, record) => {
        console.log(record.estado_del_pedido);
        return estado_del_pedido === "P" ? (
          <Button onClick={() => handleConfirmarPedido(record.id_pedido)}>
            Confirmar Pedido
          </Button>
        ) : null;
      },
    },
  ];

  const [currentPage, setCurrentPage] = useState("homemesero");
  useEffect(() => {
    listpedidos();
    const intervalId = setInterval(() => {
      listpedidos();
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  const listpedidos = () => {
    fetch(API_URL +"/Mesero/listpedidos/")
      .then((response) => response.json())
      .then((data) => {
        setPedidos(data.pedidos);
        const pedidosPendientes = data.pedidos.filter((pedido) => pedido.estado_del_pedido === 'P');
        setCantPedidosP(pedidosPendientes.length);
        console.log(data.pedidos);
      })
      .catch((error) => console.error("Error fetching pedidos:", error));
  };

  const handleCardClick = (page) => {
    if (page === "validarfacturas" && !hasPermission) {
      // Si el usuario no tiene permiso para acceder a "Validar Facturas",
      // mostramos la notificación de acceso denegado
      setPermissionNotification({
        message: "Acceso denegado",
        description: "No tienes permiso para acceder a este módulo.",
      });
    } else {
      // Si el usuario tiene permiso o el módulo no es "Validar Facturas",
      // cambiamos la página normalmente y ocultamos la notificación
      setCurrentPage(page);
      setPermissionNotification({
        message: "",
        description: "",
      });
    }
  };

  const handleAtrasClick = (page) => {
    console.log("Clicked on:", page);
    setCurrentPage("homemesero");
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
  const handleConfirmarPedido = (idPedido) => {
    // Lógica para confirmar el pedido
    const formData = new FormData();
    formData.append("id_pedido", idPedido);

    fetch(API_URL +"/Mesero/confirmarpedido/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        listpedidos();
      })
      .catch((error) => console.error("Error confirmando el pedido:", error));
  };

  const showNotification = (message, description) => {
    notification.error({
      message: message,
      description: description,
    });
  };

  return (
    <>
      <Row>
        {currentPage === "homemesero" && (
          <>
            <Col md={6}>
              <Row>
                <Col md={6}>
                  <Badge.Ribbon text="Pedidos">
                    <Tooltip title={tooltipTitle}>
                      <Card
                        hoverable
                        style={cardStyle}
                        cover={
                          <Image
                            alt="Pedidos"
                            src={imgtomarpedido}
                            style={{
                              padding: "5%",
                              height: "150px",
                              width: "auto",
                            }}
                            preview={false}
                          />
                        }
                        className="text-center"
                        onClick={() => handleCardClick("pedidos")}
                      >
                        <Meta title={tooltipTitle}></Meta>
                      </Card>
                    </Tooltip>
                  </Badge.Ribbon>
                </Col>
                <Col md={6}>
                  <Badge.Ribbon text="Facturas">
                    <Tooltip title={tooltipTitle1}>
                      <Card
                        hoverable
                        style={cardStyle}
                        cover={
                          <Image
                            alt="Facturas"
                            src={imgfacturas}
                            style={{
                              padding: "5%",
                              height: "150px",
                              width: "auto",
                            }}
                            preview={false}
                          />
                        }
                        className="text-center"
                        onClick={() => handleCardClick("facturas")}
                      >
                        <Meta title={tooltipTitle1}></Meta>
                      </Card>
                    </Tooltip>
                  </Badge.Ribbon>
                </Col>
                <Col md={6}>
                  <Badge.Ribbon text="Reversiones">
                    <Tooltip title={tooltipTitle3}>
                      <Card
                        hoverable
                        style={cardStyle}
                        cover={
                          <Image
                            alt="Reversiones"
                            src={ReversoFactura}
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
                        <Meta title={tooltipTitle3}></Meta>
                      </Card>
                    </Tooltip>
                  </Badge.Ribbon>
                </Col>
                <Col md={6}>
                  <Badge.Ribbon text="Validar Facturas">
                    <Tooltip title={tooltipTitle2}>
                      {hasPermission ? (
                        <Card
                          hoverable
                          style={cardStyle}
                          cover={
                            <Image
                              alt="Validar Facturas"
                              src={validando}
                              style={{
                                padding: "5%",
                                height: "150px",
                                width: "auto",
                              }}
                              preview={false}
                            />
                          }
                          className="text-center"
                          onClick={() => handleCardClick("validarfacturas")}
                        >
                          <Meta title={tooltipTitle2}></Meta>
                        </Card>
                      ) : (
                        <div
                          style={{
                            ...cardStyle,
                            cursor: "not-allowed",
                            backgroundColor: "#E8E8E8",
                          }}
                        >
                          <Image
                            alt="Validar Facturas"
                            src={validando}
                            style={{
                              padding: "5%",
                              height: "150px",
                              width: "auto",
                            }}
                            preview={false}
                          />
                          <Meta title={tooltipTitle2}></Meta>
                          <p style={{ textAlign: "center", color: "red" }}>
                            No tienes acceso a este módulo
                          </p>
                        </div>
                      )}
                    </Tooltip>
                  </Badge.Ribbon>
                </Col>
              </Row>
            </Col>

            <Col md={6}>
              <div
                style={{
                  border: "1px solid #A4A4A4",
                  borderRadius: "5px",
                  minHeight: "100%",
                }}
              >
                <Divider>Pedidos</Divider>
                <Card>
                  <p>Pedidos actuales: {pedidos.length}</p>
                  <p>Pedidos pendientes: {pedidos.length - CantPedidosP}</p>
                  <p>Pedidos listos: {CantPedidosP}</p>
                </Card>
                <Divider>Pedidos</Divider>
                <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={pedidos}
                    rowKey="id_pedido"
                  />
                </div>
              </div>
            </Col>
          </>
        )}
        {currentPage != "homemesero" && (
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
        {currentPage === "pedidos" && (
          <>
            <Button
              variant="success"
              style={{
                right: "16px",
                bottom: "16px",
                zIndex: 1000,
              }}
              onClick={showModal}
            >
              Realizar pedido
            </Button>
            <Row>
              <Divider>Pedidos de mesas</Divider>
              <Col md={12}>
                <RealizarPedidoMesero />
              </Col>
            </Row>
          </>
        )}
        {currentPage === "facturas" && (
          <>
            <Row>
              <Divider>Gestión de facturación</Divider>
              <Col md={12}>
                <FacturasMesero />
              </Col>
            </Row>
          </>
        )}
        {currentPage === "reversion" && (
          <>
            <Row>
              <Divider>Gestión de facturación</Divider>
              <Col md={12}>
                <ReversionesFacturas />
              </Col>
            </Row>
          </>
        )}
        {currentPage === "validarfacturas" && (
          <>
            {/* Renderizar el componente ValidarFacturas solo si el usuario tiene permiso */}
            {hasPermission && (
              <Row>
                <Divider>Valida tus facturas</Divider>
                <Col md={12}>
                  <ValidarFacturas />
                </Col>
              </Row>
            )}
            {/* Mostrar un mensaje si no tiene permiso y se hizo clic en el módulo */}
            {permissionNotification.message && (
              <Row>
                <Col md={12}>
                  {showNotification(
                    permissionNotification.message,
                    permissionNotification.description
                  )}
                </Col>
              </Row>
            )}
          </>
        )}
      </Row>

      <RealizarPedidoLocal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default MenuM;
