import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import "./res/editar.css";
import imghogar from "./res/hogar.png"
import imgtrabajo from "./res/localizacion.png"
import imgubicacion from "./res/ubicacion.png"

import Map3 from "./Map3";
import Mapafijo from "../components/mapafijo";
import API_URL from '../config';

const EditarUser = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [MostrarModal, setMostrarModal] = useState(false);
  const [MostrarModal2, setMostrarModal2] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(1); 
  const [selectedlat, setSelectedlat] = useState(null);
  const [selectedlog, setSelectedlog] = useState(null);

  const [locationData, setLocationData] = useState({
    latitud1: null,
    longitud1: null,
    latitud2: null,
    longitud2: null,
    latitud3: null,
    longitud3: null,
  });

  const handleLocationSelect = (location) => {
    setLocationData((prevLocationData) => ({
      ...prevLocationData,
      [`latitud${currentLocation}`]: location.latitud,
      [`longitud${currentLocation}`]: location.longitud,
    }));
    setMostrarModal(false);
  };

  const handleSaveLocation = (marker) => {
    if (marker) { 
      setLocationData((prevLocationData) => ({
        ...prevLocationData,
        [`latitud${currentLocation}`]: marker.latitude,
        [`longitud${currentLocation}`]: marker.longitude,
      }));
      setCurrentLocation((prevLocation) => (prevLocation % 3) + 1); // Cambiar a la siguiente ubicación (1, 2, 3)
    }
  };

  const vermapa = (lat,log) => {
    setMostrarModal2(true);
    setSelectedlat(lat);
    setSelectedlog(log);
  }

  const HacerClick = (location) => {
    setCurrentLocation(location);
    setMostrarModal(true);
  };

  const CerrarModal = () => {
    setMostrarModal(false);
  };
  const CerrarModal2 = () => {
    setMostrarModal2(false);
  };

  const [userData, setUserData] = useState(null);
  const id_cuenta = localStorage.getItem("id_cuenta");

  const ObtenerUsuario = async () => {
    if (id_cuenta) {
      fetch(API_URL +`/Login/obtener_usuario/${id_cuenta}/`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.usuario);

          setLocationData({
            latitud1: data.usuario?.ubicacion1?.latitud || 0,
            longitud1: data.usuario?.ubicacion1?.longitud || 0,
            latitud2: data.usuario?.ubicacion2?.latitud || 0,
            longitud2: data.usuario?.ubicacion2?.longitud || 0,
            latitud3: data.usuario?.ubicacion3?.latitud || 0,
            longitud3: data.usuario?.ubicacion3?.longitud || 0,
          });
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

  const handleSaveClick = async (values) => {
    try {
      if (!values) {
        console.error("Error: No se han proporcionado valores para la edición.");
        return;
      }
  
      const { telefono, snombre, capellido, ruc_cedula, razon_social } = values;
  
      console.log(locationData.latitud2);
      console.log(locationData.longitud2);
      
      const formData = new FormData();
      formData.append("ctelefono", telefono);
      formData.append("snombre", snombre);
      formData.append("capellido", capellido);
      formData.append("ruc_cedula", ruc_cedula);
      formData.append("crazon_social", razon_social);
     
      
      if (locationData.latitud1 !== 0 && locationData.longitud1 !== 0) {
        formData.append('latitud1', locationData.latitud1);
        formData.append('longitud1', locationData.longitud1);
      }
      if (locationData.latitud2 !== 0 && locationData.longitud2 !== 0) {
        formData.append('latitud2', locationData.latitud2);
        formData.append('longitud2', locationData.longitud2);
      }
      if (locationData.latitud3 !== 0 && locationData.longitud3 !== 0) {
        formData.append('latitud3', locationData.latitud3);
        formData.append('longitud3', locationData.longitud3);
      }
 
      const response = await fetch(
        API_URL +`/Login/editar_usuario/${id_cuenta}/`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        message.success("Usuario editado con éxito");
        ObtenerUsuario();
      } else {
        message.error(`Error al editar aviso: ${data.error}`);
      }
    } catch (error) {
      console.error("Error en la solicitud de edición de aviso", error);
      message.error("Error en la solicitud de edición de aviso");
    }
  };
  


  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
        console.log("Imagen seleccionada:", file);
        console.log("Imagen seleccionada:", selectedImage);
      }
    },
  });

  return (
    <>
      <Container>
        <Row>

          <Col md={4} className="formularioContainer">
            <div style={{ height: '8%' }}>
            </div>
            <div
              style={{
                overflow: "hidden",
                borderRadius: "50%",
                width: "200px",
                height: "200px",
                margin: "0 auto",
                position: "relative",
              }}
              {...getRootProps()}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: "50%",
                    transition: "transform 0.3s ease",
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    borderRadius: "50%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size="5x"
                    style={{ color: 'white' }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
              )}




            </div>
       

       <div style={{ textAlign: "center" }}>
              <span style={{ color: "white" }}> {userData?.nombre_usuario || ""}</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <Button
                variant="secondary"
                type="button"
                style={{
                  width: "150px",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                Editar contraseña
              </Button>
            </div>
            <Col
              md={1100}
              style={{ ...styles.centerContainer, marginTop: "20px" }}
            >
              <div style={{ marginTop: "60px" }}></div>
            </Col>
          </Col>
          <Col md={8}>
            <Row>
              <Col
                md={6}
                style={{
                  justifyContent: "center",
                  marginTop: "30px",

                  padding: "20px",
                }}
              >
                <h5
                  style={{
                    textAlign: "center",
                    borderRadius: "10px",
                    backgroundColor: "black", // Agregar color de fondo gris
                    color: "white",
                    padding: "10px", // Añadir relleno para mejorar la apariencia
                  }}
                >
                  Datos de cuenta
                </h5>

                <Form>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label>Nombres:</Form.Label>
                        <Form.Control
                          value={userData?.snombre || ""}
                          readOnly={!isEditing}
                          onChange={(e) =>
                            isEditing &&
                            setUserData({
                              ...userData,
                              snombre: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Label>Apellidos:</Form.Label>
                        <Form.Control
                          value={userData?.capellido || ""}
                          readOnly={!isEditing}
                          onChange={(e) =>
                            isEditing &&
                            setUserData({
                              ...userData,
                              capellido: e.target.value,
                            })
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label>Telefono:</Form.Label>
                        <Form.Control
                          value={userData?.telefono || ""}
                          readOnly={!isEditing}
                          onChange={(e) =>
                            isEditing &&
                            setUserData({
                              ...userData,
                              telefono: e.target.value,
                            })
                          }
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label>Razon social:</Form.Label>
                        <Form.Control
                          value={userData?.razon_social || ""}
                          readOnly={!isEditing}
                          onChange={(e) =>
                            isEditing &&
                            setUserData({
                              ...userData,
                              razon_social: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Label>Identificacion:</Form.Label>
                        <Form.Control
                          value={userData?.ruc_cedula || ""}
                          readOnly={!isEditing}
                          onChange={(e) =>
                            isEditing &&
                            setUserData({
                              ...userData,
                              ruc_cedula: e.target.value,
                            })
                          }
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  {isEditing && (
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevenir la recarga de la página
                          handleSaveClick({
                            telefono: userData.telefono,
                            snombre: userData.snombre,
                            capellido: userData.capellido,
                            ruc_cedula: userData.ruc_cedula,
                            razon_social: userData.razon_social,
                          });

                        }}
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  )}
                </Form>
              </Col>
              {/* Columna de Datos Generales 2 */}
              <Col md={6} style={{ marginTop: "30px", padding: "20px" }}>
                <h5
                  style={{
                    textAlign: "center",
                    borderRadius: "10px",
                    backgroundColor: "black", // Agregar color de fondo gris
                    color: "white",
                    padding: "10px", // Añadir relleno para mejorar la apariencia
                  }}
                >
                  Mis ubicaciones
                </h5>
                <Form>
                  <Form.Group>
                    <Form.Group>
                      <div style={{
                        border: "1px solid ",
                        backgroundColor: 'white', // Ajusta el color de fondo según tu preferencia
                        borderRadius: '10px', // Ajusta el radio de borde según tu preferencia
                        overflow: 'hidden',
                        // Para asegurarte de que las esquinas redondeadas se apliquen correctamente
                      }}>
                        <Row>
                          <Col md={3} style={{ borderRight: "1px solid " }}>
                            <img src={imghogar} style={{ height: 'auto', width: '75%', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}></img>
                          </Col>
                          <Col md={8}>
                            {locationData.latitud1 && (
                              <Row>
                                <Col md={6}>
                                  <Button
                                    variant="primary"
                                    style={{ height: 'auto', marginTop: '20px', marginBottom: '20px', width: "100%" }}
                                    onClick={() => vermapa(locationData.latitud1,locationData.longitud1)}
                                  >
                                    Ver Ubicación
                                  </Button>
                                </Col>
                                <Col md={6}>
                                  <Button
                                    variant="primary"
                                    style={{ height: 'auto', marginTop: '20px', marginBottom: '20px', width: "100%" }}
                                    onClick={() => HacerClick(1)}
                                  >
                                    Cambiar Ubicación
                                  </Button>
                                </Col>
                              </Row>
                            ) ||
                              !locationData.latitud1 && (
                                <>
                                  <Button
                                    variant="primary"
                                    style={{ height: 'auto', width: '75%', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}
                                    onClick={() => HacerClick(1)}
                                  >
                                    Escoger ubicación
                                  </Button>
                                </>
                              )}
                          </Col>
                        </Row>
                      </div>

                      
                      <div style={{
                        border: "1px solid ",
                        backgroundColor: 'white', // Ajusta el color de fondo según tu preferencia
                        borderRadius: '10px', // Ajusta el radio de borde según tu preferencia
                        overflow: 'hidden',
                        // Para asegurarte de que las esquinas redondeadas se apliquen correctamente
                      }}>
                        <Row>
                          <Col md={3} style={{ borderRight: "1px solid " }}>
                            <img src={imgtrabajo} style={{ height: 'auto', width: '75%', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}></img>
                          </Col>
                          <Col md={8}>
                            {locationData.latitud2 && (
                              <Row>
                                <Col md={6}>
                                  <Button
                                    variant="primary"
                                    style={{ height: 'auto', marginTop: '20px', marginBottom: '20px', width: "100%" }}
                                    onClick={() => vermapa(locationData.latitud2,locationData.longitud2)}
                                  >
                                    Ver Ubicación
                                  </Button>
                                </Col>
                                <Col md={6}>
                                  <Button
                                    variant="primary"
                                    style={{ height: 'auto', marginTop: '20px', marginBottom: '20px', width: "100%" }}
                                    onClick={() => HacerClick(2)}
                                  >
                                    Cambiar Ubicación
                                  </Button>
                                </Col>
                              </Row>
                            ) ||
                              !locationData.latitud2 && (
                                <>
                                  <Button
                                    variant="primary"
                                    style={{ height: 'auto', width: '75%', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}
                                    onClick={() => HacerClick(2)}
                                  >
                                    Escoger ubicación
                                  </Button>
                                </>
                              )}
                          </Col>
                        </Row>
                      </div>
                    </Form.Group>
                  </Form.Group>
                  <Form.Group>
                    
                  </Form.Group>
                </Form>
              </Col>
              <Col style={{ marginTop: "30px", padding: "20px" }}>
                
                <Form>
                  <Form.Group>
                    <Row>
                      <Form.Label></Form.Label>
                      <Col lg={11}>
                        <Form.Control />
                      </Col>
                      <Col>
                        <FontAwesomeIcon
                          onClick={HacerClick}
                          icon={faMapMarkerAlt}
                          size="2x"
                        />
                      </Col>
                    </Row>
                </Form.Group>

                </Form>
                </Col>*
            </Row>
          </Col>
        </Row>
      </Container>
      <Modal show={MostrarModal2} onHide={CerrarModal2} size="lg">
        <Modal.Header
          closeButton
          style={{ borderBottom: "none" }}
        ></Modal.Header>
        <Modal.Body>
          <Mapafijo latitud={selectedlat} longitud= {selectedlog} idm={1} ></Mapafijo>
        </Modal.Body>
      </Modal>
      {isEditing && (
        <Modal show={MostrarModal} onHide={CerrarModal} size="lg">
          <Modal.Header
            closeButton
            style={{ borderBottom: "none" }}
          ></Modal.Header>
          <Modal.Body>
            <Map3
              onLocationSelect={handleLocationSelect}
              onSaveLocation={handleSaveLocation}
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

const styles = {
  centerContainer: {},
  heading: {
    textAlign: "center",
  },
};

export default EditarUser;
