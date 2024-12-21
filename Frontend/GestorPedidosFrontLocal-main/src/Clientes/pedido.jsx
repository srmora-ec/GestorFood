import React, { useContext, useState, useEffect } from "react";
import Lottie from 'react-lottie';
import dayjs from 'dayjs';
import {
  Form, Modal, Button, Row, ButtonGroup,
  Col, Container, Nav
} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from "../context/CarritoContext";
import { RecompensaContext } from "../context/RecompensaContext"

import { TimePicker, InputNumber, Divider, 
  Space,Card,Input
  , Upload, message, Segmented, 
  Badge, notification, Alert, Tooltip, 
  Pagination, Spin } from 'antd';
  const { TextArea } = Input;

import ImgCrop from 'antd-img-crop';
import PayPal from "./Paypal";
import PayPal2 from "./Paypal2";
import Map3 from "./Map3";
import imgentrega from "./res/entrega.png";
import imglocal from "./res/local.png";
import imghogar from "./res/hogar.png";
import imgtrabajao from "./res/localizacion.png";
import imgotro from "./res/ubicacion.png";
import imgtransfer from "./res/pagmovil.png";
import imgefectivo from "./res/pagefectivo.png";
import imgdividir from "./res/dividirpagos.png";
import imgpaypal from "./res/paypal.png";
import API_URL from '../config';
const Pedidos = ({ regresar }) => {
  const { cart, setCart, totalPoints2, calcularTotalPoints } = useContext(CartContext);
  const [recompensa, setrecompensa] = useContext(RecompensaContext);

  const [mostrarPedido, setMostrarPedido] = useState(false);
  const [MostrarModal, setMostrarModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const format = 'HH:mm';
  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [modoPago, setModoPago] = useState('E');
  const [fraccionadoValue, setFraccionadoValue] = useState(1);
  const [mostrarComponente, setMostrarComponente] = useState(false);
  const [modoPedido, setModoPedido] = useState(null);
  const [showElegirUbicacion, setShowElegirUbicacion] = useState(false);
  const [sucursalesData, setSucursalesData] = useState([]);
  const [sucursal, setSucursal] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(1);
  const [currentHour, setCurrentHour] = useState(dayjs().hour());
  const [HoraEntrega, setHoraEntrega] = useState(null);
  const [Permitido, setPermitido] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 2;
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL + '/empleado/obtener_datosB/');
      const result = await response.json();

      setData(result.Cuentas);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const cambiarhora = (hora) => {
    setHoraEntrega(hora);
    console.log('La hora llega:');
    console.log(hora);
    console.log(sucursalesData);

    const now = new Date();
    const dayOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][now.getDay()];
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const sucursalDeseada = sucursalesData.find((sucursalsele) => sucursalsele.id_sucursal === sucursal);
    console.log(sucursalDeseada);
    if (sucursalDeseada) {
      const horarioAbierto = sucursalDeseada.horario && sucursalDeseada.horario.detalles
        ? sucursalDeseada.horario.detalles.find((detalle) => {
          const fechaInicio = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horainicio}`);
          const fechaFin = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horafin}`);
          const horaSeleccionada = new Date(hora.$y, hora.$M, hora.$D, hora.$H, hora.$m, hora.$s);
          console.log("fechaInicio: " + fechaInicio);
          console.log("fecha enviada: " + horaSeleccionada);
          console.log("Fecha fin " + fechaFin);
          return detalle.dia === dayOfWeek &&
            fechaInicio <= horaSeleccionada &&
            fechaFin >= horaSeleccionada;
        })
        : null;

      if (horarioAbierto) {
        console.log('La sucursal estaría abierta en la hora seleccionada.');
        notification.success({
          message: 'La sucursal está disponible en la hora seleccionada'
        });
        setPermitido(false);
      } else {
        console.log('La sucursal estaría cerrada en la hora seleccionada.');
        notification.error({
          message: 'La sucursal estaría cerrada en la hora seleccionada.'
        });
        setPermitido(true);
      }
    } else {
      console.log('No se encontró la sucursal con el ID proporcionado.');
      notification.error({
        message: 'No se encuentra ninguna sucursal.'
      });
      setPermitido(true);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };
  const listarsucursales = () => {
    fetch(API_URL + '/sucursal/sucusarleslist/')
      .then((response) => response.json())
      .then((data) => {
        console.log(data.sucursales);
        const sucursalesConEstado = obtenerhorarios(data.sucursales);
        setSucursalesData(sucursalesConEstado);
        console.log(sucursalesConEstado);
      })
      .catch((error) => {
        console.error('Error al obtener los datos de sucursales:', error);
      });
  };

  const verificarUbicacion = (newLocationData) => {
    if (id_cuenta) {
      const formData = new FormData();
      formData.append('latitud', newLocationData.latitud);
      formData.append('longitud', newLocationData.longitud);

      // Realiza la solicitud POST al backend
      fetch(API_URL + '/sucursal/secSucursal/', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.sucursal) {
            const sucursalesConEstado = obtenerhorarios(responseData.sucursal);
            if (sucursalesConEstado[0].estadoApertura === 'Abierto ahora') {
              notification.success({
                message: 'Sucursal disponible'
              });
              setSucursal(sucursalesConEstado[0].id_sucursal);
              setPermitido(false);
            }
            else {
              console.log("Ubicacion:");
              console.log(sucursalesConEstado);
              notification.error({
                message: 'No hay sucursales abiertas en su ubicación actualmente',
                description: 'Prueba más tarde o revisa otras sucursales',
              });
              setPermitido(true);
              setSucursal(sucursalesConEstado[0].id_sucursal);
            }
          } else {
            notification.error({
              message: '¡Algo salió mal!',
              description: 'No hay sucursales disponibles actualmente',
            });
            setPermitido(true);
            setSucursal(null);
          }
        })
        .catch(error => {
          notification.error({
            message: '¡Algo salió mal!',
            description: '¡No se pudo buscar la sucursal!',
          });
          setPermitido(true);
          console.error('Error en la solicitud:', error);
        })
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
      setPermitido(true);
    }


  };
  const obtenerhorarios = (listSucursales) => {
    try {
      const now = new Date();
      const dayOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][now.getDay()];
      const month = now.getMonth() + 1; // Los meses en JavaScript son de 0 a 11, así que sumamos 1
      const day = now.getDate();
      console.log('Día de la semana actual:', dayOfWeek);
      const sucursalesConEstado = listSucursales.map((sucursal) => {
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
      return sucursalesConEstado;
    } catch (error) {
      console.error('Error al trabajar con fechas:', error);
    }
  }
  const [locationData, setLocationData] = useState({
    latitud: undefined,
    longitud: undefined
  });


  const id_cuenta = localStorage.getItem('id_cuenta');
  useEffect(() => {
    console.log('aqui se llega rapido?');
    if (id_cuenta) {
      fetch(API_URL + `/Login/obtener_usuario/${id_cuenta}/`)
        .then(response => response.json())
        .then(data => {
          console.log('aqui se llega rapido?2');
          setUserData(data.usuario);
          
          setLocationData({
            latitud1: data.usuario?.ubicacion1?.latitud || undefined,
            longitud1: data.usuario?.ubicacion1?.longitud || undefined,
            latitud2: data.usuario?.ubicacion2?.latitud || undefined,
            longitud2: data.usuario?.ubicacion2?.longitud || undefined,
            latitud3: data.usuario?.ubicacion3?.latitud || undefined,
            longitud3: data.usuario?.ubicacion3?.longitud || undefined,
          });
          listarsucursales();
        })
        .catch(error => console.error('Error al obtener datos del usuario:', error))
        .finally(()=>setLoading(false));
    } else {
      console.error('Nombre de usuario no encontrado en localStorage');
    }
  }, []);

  const handleModoPagoChange = (value) => {
    setModoPago(value);
  };
  const handleFraccionadoInputChange = (value) => {
    setFraccionadoValue(value);
  };
  const handleModoPedidoChange = (value) => {
    setPermitido(true);
    setModoPedido(value);
    setSucursal(null);

  };
  const handleLocationChange = (value) => {
    setHoraEntrega(null);
    setSelectedLocation(value);
    if (value === 'Otro') {
      setShowElegirUbicacion(true);
    }
    else {
      let newLocationData = {};
      console.log(`Cambiando a la ubicación: ${location}`);
      const tpicker = document.getElementById('time-envy');
      tpicker.value = '';
      switch (value) {
        case 'Casa':
          newLocationData = {
            latitud: locationData.latitud1,
            longitud: locationData.longitud1,
          };
          break;
        case 'Trabajo':
          newLocationData = {
            latitud: locationData.latitud2,
            longitud: locationData.longitud2,
          };
          break;
      }
      console.log('Nuevos datos de ubicación:', newLocationData);
      setLocationData((prevLocationData) => ({ ...prevLocationData, ...newLocationData }));
      verificarUbicacion(newLocationData);
    }
  };

  const HacerClick = () => {
    regresar();
  };

  const ivaPrecio = () => {
    let iva = 0;
    for (let i = 0; i < cart.length; i++) {
      const currentItem = cart[i];
      if (currentItem.iva == 1) {
        iva += currentItem.quantity * currentItem.price * 0.12;
      }
    }
    return iva;
  }


  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.price,
    0
  );
  const totalPoints = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.puntos,
    0
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(dayjs().hour());
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(intervalId);
  }, []);
  const PagarPorEfectivo = () => {



    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));


      const formData = new FormData();

      formData.append('precio', (Number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2));
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'T');
      formData.append('puntos', 0);
      formData.append('estado_del_pedido', 'O');
      formData.append('impuesto', 0);
      formData.append('estado_pago', 'En revisión');
      formData.append('imagen', fileList[0]?.originFileObj || null);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      formData.append('id_sucursal', sucursal);
      formData.append('cpuntos', totalPoints);
      if (locationData) {
        console.log('Latitud' + locationData.latitud);
        formData.append('latitud', locationData.latitud);
        formData.append('longitud', locationData.longitud);
      }

      if (HoraEntrega) {
        formData.append('fecha_hora', HoraEntrega.hour());
        formData.append('fecha_minutos', HoraEntrega.minute());// Ajusta el formato según tus necesidades
      }
      // Realiza la solicitud POST al backend
      fetch(API_URL + `/cliente/realizar_pedido/${id_cuenta}/`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          // Maneja la respuesta del backend según sea necesario
          if (responseData.success) {
            console.log('Respuesta del servidor:', responseData);
            console.log('Pedido realizado con éxito.');
            console.log('se pide a la sucursal:' + sucursal);
            notification.success({
              message: 'Pedido Exitoso',
              description: '¡El pedido se ha completado con éxito!',
            });
            setCart([]);
            regresar();
            setPermitido(true);
          } else {
            notification.error({
              message: 'Fallo en el pedido',
              description: '¡Algo salió mal!',
            });
            console.log('Valor de totalPoints:', totalPoints);
            console.error('Error al realizar el pedido:', responseData.message);
            setPermitido(true);
          }
        })
        .catch(error => {
          notification.error({
            message: 'Fallo en el pedido',
            description: '¡Algo salió mal!',
          });
          console.error('Error en la solicitud:', error);
          setPermitido(true);
        })
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
      setPermitido(true);
    }


  };
  const PagarPorEfectivo2 = () => {
    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));


      const formData = new FormData();
      let valor = (Number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2);
      console.log('Total: ' + valor);
      formData.append('precio', valor);
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'E');

      formData.append('estado_del_pedido', 'O');
      formData.append('impuesto', 0);
      formData.append('estado_pago', 'En revisión');
      formData.append('id_sucursal', sucursal);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      console.log('Valor de totalPoints antes de FormData:', totalPoints);

      formData.append('cpuntos', totalPoints);
      if (HoraEntrega) {
        formData.append('fecha_hora', HoraEntrega.hour());
        formData.append('fecha_minutos', HoraEntrega.minute());// Ajusta el formato según tus necesidades
      }
      // Realiza la solicitud POST al backend
      fetch(API_URL + `/cliente/realizar_pedido/${id_cuenta}/`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          // Maneja la respuesta del backend según sea necesario
          if (responseData.success) {
            console.log('Respuesta del servidor:', responseData);
            console.log('Pedido realizado con éxito.');
            console.log('se pide a la sucursal:' + sucursal);
            notification.success({
              message: 'Pedido Exitoso',
              description: '¡El pedido se ha completado con éxito!',
            });
            // Calcula los puntos ganados en el pedido actual
            const puntosGanados = cart.reduce((acc, curr) => acc + curr.quantity * curr.puntos, 0);

            calcularTotalPoints(puntosGanados);
            setCart([]);
            setrecompensa([]);
            regresar();
          } else {
            notification.error({
              message: 'Fallo en el pedido',
              description: '¡Algo salió mal!',
            });
            console.error('Error al realizar el pedido:', responseData.message);
          }
        })
        .catch(error => {
          notification.error({
            message: 'Fallo en el pedido',
            description: '¡Algo salió mal!',
          });
          console.error('Error en la solicitud:', error);
        })
    } else {

      console.error('ID de cuenta no encontrado en localStorage');
    }


  };




  const CerrarModalDespuesDePago = () => {
    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));


      // Construye el cuerpo de la solicitud con los datos necesarios
      const formData = new FormData();

      formData.append('precio', (number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2));
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'P'); // Asumo que 'E' es el método de pago en efectivo
      formData.append('puntos', 0); // Ajusta según sea necesario
      formData.append('estado_del_pedido', 'O'); // Ajusta según sea necesario
      formData.append('impuesto', 0);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      if (locationData) {
        console.log('Latitud' + locationData.latitud);
        formData.append('latitud', locationData.latitud);
        formData.append('longitud', locationData.longitud);
      }
      // Realiza la solicitud POST al backend
      fetch(API_URL + `/cliente/realizar_pedido/${id_cuenta}/`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          // Maneja la respuesta del backend según sea necesario
          if (responseData.success) {
            console.log('Respuesta del servidor:', responseData);
            console.log('Pedido realizado con éxito.');
            console.log('se pide a la sucursal:' + sucursal);
            notification.success({
              message: 'Pedido Exitoso',
              description: '¡El pedido se ha completado con éxito!',
            });
            setCart([]);
            regresar();
            setPermitido(true);
          } else {
            console.error('Error al realizar el pedido:', responseData.message);
            setPermitido(true);
          }
        })
        .catch(error => {
          console.error('Error en la solicitud:', error);
          setPermitido(true);
        })
        .finally(() => {
          setPermitido(true);
          setCart([]);
          regresar();
        });
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
    }
  }
  const CerrarModalDespuesDePago2 = () => {
    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));


      // Construye el cuerpo de la solicitud con los datos necesarios
      const formData = new FormData();

      formData.append('precio', (Number(totalPrice) + Number(ivaPrecio().toFixed(2)).toFixed(2)));
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'X'); // Asumo que 'E' es el método de pago en efectivo
      formData.append('puntos', 0); // Ajusta según sea necesario
      formData.append('estado_del_pedido', 'O'); // Ajusta según sea necesario
      formData.append('impuesto', 0);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      formData.append('estado_pago', 'Pagado');
      formData.append('id_sucursal', sucursal);
      if (locationData) {
        formData.append('latitud', locationData.latitud);
        formData.append('longitud', locationData.longitud);
      }
      // Realiza la solicitud POST al backend
      fetch(API_URL + `/cliente/realizar_pedido/${id_cuenta}/`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          // Maneja la respuesta del backend según sea necesario
          if (responseData.success) {
            console.log('Respuesta del servidor:', responseData);
            console.log('Pedido realizado con éxito.');
            console.log('se pide a la sucursal:' + sucursal);
            notification.success({
              message: 'Pedido Exitoso',
              description: '¡El pedido se ha completado con éxito!',
            });
            setPermitido(true);
          } else {
            console.error('Error al realizar el pedido:', responseData.message);
            setPermitido(true);
          }
        })
        .catch(error => {
          console.error('Error en la solicitud:', error);
          setPermitido(true);
        })
        .finally(() => {
          setCart([]);
          regresar();
        });
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
      setPermitido(true);
    }
  }
  const PagarPorFraccionado = () => {
    setMostrarComponente(!mostrarComponente);
    console.log('Pagar por fraccionado con valor:', fraccionadoValue);
  };
  const handleLocationSelect = (location) => {
    setLocationData((prevLocationData) => ({
      ...prevLocationData,
      [`latitud${currentLocation}`]: location.latitud,
      [`longitud${currentLocation}`]: location.longitud,
    }));
    setMostrarModal(false);
  };


  const handleSaveLocation = (marker) => {
    let newLocationData = {};
    newLocationData = {
      latitud: marker.latitude,
      longitud: marker.longitude,
    };
    setLocationData(prevLocationData => ({
      ...prevLocationData, // Mantén los datos existentes
      latitud3: marker.latitude,
      longitud3: marker.longitude,
    }));
    verificarUbicacion(newLocationData);
    setShowElegirUbicacion(false);
    
  };
  const handleSucursalSelect = (selectedSucursal) => {
    notification.success({
      message: 'Se cambio la sucursal a retirar'

    });
    setSucursal(selectedSucursal);
    setPermitido(false);
  };
  const isImage = file => {
    const imageTypes = ['image/jpeg', 'image/png'];
    return imageTypes.includes(file.type);
  };
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const beforeUpload = file => {
    if (!isImage(file)) {
      message.error('Solo puedes subir imágenes!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };
  return (
    <Row style={{ marginLeft: '30px', marginRight: '50px' }}>
      <Button
        onClick={HacerClick}
        size="lg"
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          backgroundColor: "#131212",
          borderRadius: "8px",
          padding: "15px 30px",
          fontSize: "16px",
          color: "#fff",
          border: "1px solid #131212",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "#333")
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = "#000")
        }
      >
        Cancelar
      </Button>
      <Row>
        <Col md={6} style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid #131212', borderRadius: '10px' }}>
          <Spin spinning={loading} tip="Cargando tus ubicaciones..." style={{ height: '500px' }}>
            <Alert
              message="Hola ✌🏻"
              description="Revisa tu dirección y forma de pago antes de comprar."
              type="success"
              showIcon
              closable
            />
            <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione como quiere recibir/retirar su pedido:</div>
            {/* Primera sección */}
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>

              <Col md={5} className="d-flex justify-content-center align-items-center">

                <Row style={{ padding: '15px' }}>
                  <Col md={12}>
                    <Segmented
                      value={modoPedido}
                      onChange={handleModoPedidoChange}
                      options={[
                        {
                          label: (
                            <div
                              style={{
                                padding: 4,
                              }}
                            >
                              <img src={imgentrega} style={{ width: "50%" }} />
                              <div>Domicilio</div>
                            </div>
                          ),
                          value: 'D',
                        },
                        {
                          label: (
                            <div
                              style={{
                                padding: 4,
                              }}
                            >
                              <img src={imglocal} style={{ width: "50%" }} />
                              <div>Retirar</div>
                            </div>
                          ),
                          value: 'R',
                        }
                      ]}
                    />
                  </Col>

                </Row>

              </Col>
            </Row>

            {/* Segunda sección (solo se muestra si modoPedido es 'D') */}
            {modoPedido === 'D' && (
              <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <Col md={5} className="d-flex justify-content-center align-items-center">
                  <Segmented
                    onChange={handleLocationChange}
                    options={[
                      {
                        value: 'any',
                      },
                      {
                        label: (
                          <div
                            style={{
                              padding: 4,
                            }}
                          >
                            <img src={imghogar} style={{ width: "50%" }} />
                            <div>Casa</div>
                          </div>
                        ),
                        value: 'Casa',
                      },
                      {
                        label: (
                          <div
                            style={{
                              padding: 4,
                            }}
                          >
                            <img src={imgtrabajao} style={{ width: "50%" }} />
                            <div>Trabajo</div>
                          </div>
                        ),
                        value: 'Trabajo',
                      },
                      {
                        label: (
                          <div
                            style={{
                              padding: 4,
                            }}
                          >
                            <img src={imgotro} style={{ width: "50%" }} />
                            <div>Otro</div>
                          </div>
                        ),
                        value: 'Otro',
                      }
                    ]}
                  />
                </Col>
              </Row>
            )}

            {/* Tercera sección */}
            {modoPedido === 'D' && (
              <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <Col md={5} className="d-flex justify-content-center align-items-center">
                  {locationData && locationData.latitud !== undefined && locationData.longitud !== undefined ? (
                    <Badge count={"Se entregará el pedido en  " + selectedLocation} showZero color='#52C41A' />
                  ) : (
                    'No tienes una ubicación agregada'
                  )}
                </Col>
              </Row>
            )}





            {modoPedido === 'R' && (
              sucursalesData.map((sucursal) => {
                if (sucursal.estadoApertura === 'Abierto ahora') {

                  return (
                    <Card
                      key={sucursal.id_sucursal}
                      hoverable
                      title={sucursal.snombre}
                      style={{
                        width: "auto",
                        margin: "10px",
                        border: sucursal.id_sucursal === sucursal ? "2px solid green" : "1px solid #A4A4A4",
                      }}
                      cover={
                        <img
                          alt="Descarga la aplicación móvil"
                          src={`data:image/png;base64,${sucursal.imagensucursal}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      }
                      className="text-center"
                      onClick={() => handleSucursalSelect(sucursal.id_sucursal)}  // Agrega este evento onClick
                    >
                      <span style={{ fontWeight: 'bold', color: 'black', display: 'block' }}>{sucursal.sdireccion}</span>
                      <span style={{ color: 'green' }}>
                        {sucursal.estadoApertura}
                      </span>
                    </Card>
                  );
                }
                return (null)
              })

            )}
            {modoPedido === 'R' && (
              <div>No hay más sucursales disponibles ahora mismo</div>
            )}
            <Container style={{ backgroundColor: '#ffffff' }}>
              <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione modo de pago:</div>
              <Col md={5} className="mx-auto text-center mb-3" style={{ maxWidth: "100%" }}>
                <Segmented
                  onChange={handleModoPagoChange}
                  options={[
                    {
                      label: (
                        <Tooltip placement="top" title="Pagar en efectivo">
                          <div style={{ padding: 4 }}>
                            <img src={imgefectivo} style={{ width: "100%" }} alt="Efectivo" />
                          </div>
                        </Tooltip>
                      ),
                      value: 'E',
                    },
                    {
                      label: (
                        <Tooltip placement="top" title="Pagar por transferencia">
                          <div style={{ padding: 4 }}>
                            <img src={imgtransfer} style={{ width: "100%" }} alt="Transferencia" />
                          </div>
                        </Tooltip>
                      ),
                      value: 'T',
                    },
                    {
                      label: (
                        <Tooltip placement="top" title="Dividir los pagos">
                          <div style={{ padding: 4 }}>
                            <img src={imgdividir} style={{ width: "100%" }} alt="Dividir pagos" />
                          </div>
                        </Tooltip>
                      ),
                      value: 'F',
                    }
                  ]}
                />
              </Col>
              <br />
              ¿No hay prisa? Selecciona la hora que deseas que se realice tu pedido:
              <TimePicker
                defaultValue={dayjs('00:00', format)}
                value={HoraEntrega}
                format={format}
                id="time-envy"
                onChange={(hora) => cambiarhora(hora)}
                disabledHours={() => Array.from({ length: currentHour }, (_, i) => i)}
                disabledMinutes={(selectedHour) =>
                  selectedHour === currentHour
                    ? Array.from({ length: dayjs().minute() }, (_, i) => i)
                    : []
                }
              />
              {modoPago === 'T' && (
                <Row gutter={[16, 16]}>
                  <Col >
                    <div>
                      <style>
                        {`
                  @media only screen and (max-width: 600px) {
                    .ant-divider-inner-text {
                      font-size: 10px;
                    }
                  }
                `}
                      </style>
                    </div>
                    <Divider>Realize la transfrencia a la siguiente cuenta:</Divider>
                    <Row
                      gutter={[16, 16]}
                      justify="center"
                      style={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '100px'
                      }}
                    >
                      {getPaginatedData().map((cuenta, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                          <Card
                            className="responsive-card"
                            style={{
                              width: 300,
                              overflow: 'hidden',

                            }}
                          >
                            <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              Banco: {cuenta.nombre_banco}
                            </p>
                            <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              Tipo de cuenta: {cuenta.tipo_cuenta}
                            </p>
                            <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              Número de cuenta: {cuenta.num_cuenta}
                            </p>
                            <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              Nombre: {cuenta.nombreapellidos}
                            </p>
                            <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              Cedula: {cuenta.identificacion}
                            </p>
                            <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              Email: {cuenta.correoelectronico}
                            </p>
                          </Card>
                          <style>
                            {`
                      @media only screen and (max-width: 600px) {
                        .responsive-card {
                          width: 100%;  // Puedes ajustar según sea necesario
                          /* Otros estilos específicos */
                        }
                      }
                    `}
                          </style>
                        </Col>
                      ))}

                    </Row>
                    <Pagination
                      current={currentPage}
                      total={data.length}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      style={{ marginTop: '16px', textAlign: 'center' }}
                    />
                  </Col>
                  <Col style={{ textAlign: 'center' }}>
                    <style>
                      {`
                  @media only screen and (max-width: 600px) {
                    .ant-divider-inner-text {
                      font-size: 10px;
                    }
                  }
                `}
                    </style>
                    <Divider orientation="left">Comprobante de pago (foto, escaneo ó captura de pantalla)</Divider>
                    <div rotationSlider style={{
                      display: 'flex', alignItems: 'center'
                      , justifyContent: 'center'
                    }}>
                      <ImgCrop >
                        <Upload
                          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                          listType="picture-card"
                          fileList={fileList}
                          onChange={onChange}
                          onPreview={onPreview}
                          beforeUpload={beforeUpload}

                        >
                          {fileList.length < 1 && '+ Subir comprobante'}
                        </Upload>
                      </ImgCrop>
                    </div>
                    <div className="d-grid gap-2">
                      <Button
                        disabled={fileList.length === 0 || modoPedido === null || Permitido}
                        onClick={PagarPorEfectivo}
                      >
                        Pagar: ${(Number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2)}
                      </Button>
                    </div>
                    <Divider>O pague con paypal </Divider>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }} >
                      {!Permitido && (
                        <PayPal onSuccess={CerrarModalDespuesDePago2} amount={Number(totalPrice) + Number(ivaPrecio().toFixed(2))} disabled={false} />
                      ) || (<Button style={{ width: '100%', background: '#FFC439', borderColor: '#FFC439' }} disabled={true}><img src={imgpaypal} style={{ width: '30%' }} /></Button>)}
                    </div>
                  </Col>
                </Row>
              )}
              {modoPago === 'E' && (
                <>
                 <TextArea rows={4} style={{ marginTop: '10px' }} />
                <div className="d-grid gap-2">
                  <Button style={{ marginTop: '10px', marginBottom: '10px' }}
                    disabled={modoPago !== 'E' || Permitido}
                    onClick={PagarPorEfectivo2}
                  >
                    {modoPedido === 'R' ? 'Pagar en el local: ' : modoPedido === 'D' ? 'Pagar al recibir: ' : 'Realizar pedido: '} ${(Number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2)}
                  </Button>
                  <p>puntos totales: {totalPoints}</p>
                </div>
                </>
              )}
              <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                {modoPago === 'F' && (
                  <Space align="center">
                    <InputNumber
                      min={0}
                      value={fraccionadoValue}
                      onChange={handleFraccionadoInputChange}
                      style={{ marginLeft: '10px' }}
                    />
                    <Button onClick={PagarPorFraccionado} disabled={Permitido}>
                      Pagar: ${fraccionadoValue.toFixed(2)}
                    </Button>
                  </Space>
                )}
                {mostrarComponente && modoPago === 'F' && (
                  <div>
                    <Divider orientation="left">Comprobante de pago (foto, escaneo ó captura de pantalla)</Divider>
                    <div rotationSlider style={{
                      display: 'flex', alignItems: 'center'
                      , justifyContent: 'center'
                    }}>
                      <ImgCrop >
                        <Upload
                          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                          listType="picture-card"
                          fileList={fileList}
                          onChange={onChange}
                          onPreview={onPreview}
                          beforeUpload={beforeUpload}

                        >
                          {fileList.length < 1 && '+ Subir comprobante'}
                        </Upload>
                      </ImgCrop>
                    </div>

                    <Button style={{ marginTop: '10px', width: '400px' }}
                      disabled={fileList.length === 0 || modoPedido === null || Permitido}
                      onClick={PagarPorEfectivo}
                    >
                      Pagar: ${(Number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2)}
                    </Button>

                    <Divider>O pague con paypal </Divider>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }} >
                      {!Permitido && (
                        <PayPal2 onSuccess={CerrarModalDespuesDePago2} amount={(Number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2)} disabled={false} />
                      ) || (<Button style={{ width: '100%', background: '#FFC439', borderColor: '#FFC439' }} disabled={true}><img src={imgpaypal} style={{ width: '30%' }} /></Button>)}
                    </div>
                  </div>
                )}

              </div>
            </Container>
          </Spin>
        </Col>
        <Col md={6} >
          <Container style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid #131212', borderRadius: '10px' }}>
            <strong style={{
              fontSize: "18px",
              marginTop: "10px",
            }}>TU ORDEN
            </strong>
            <Alert
              description={`Un pedido${modoPedido === 'D' ? ' a domicilio ' : modoPedido === 'R' ? ' a retirar ' : ','} ${modoPago === 'E' ? 'y en efectivo'
                : modoPago === 'T' ? 'y por transferencia' : ''}.${modoPedido === 'D' && selectedLocation !== '' && sucursal != null
                  ? ' Se entregará en ' + selectedLocation
                  : modoPedido === 'R' && sucursal != null
                    ? ' Se debe retirar en ' + sucursalesData.find(s => s.id_sucursal === sucursal)?.snombre
                    : ''}`}
              type="info"
              showIcon
            />
            <Divider>Tus productos</Divider>
            <div style={{
              height: "300px",/* Ajusta según sea necesario */
              overflow: "auto", /* Agrega una barra de desplazamiento vertical cuando sea necesario */
              border: "1px solid #ddd", /* Bordes para visualización */
              padding: "10px"
            }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    fontSize: "18px",
                    marginTop: "10px",
                    borderBottom: '1px solid #9b9b9b'
                  }}
                >

                  <table>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: '25%'
                          }}
                        >
                          <img style={{
                            maxHeight: "auto",
                            border: '1px solid #9b9b9b',
                            borderRadius: '10%',
                            verticalAlign: 'top',
                            width: '100%'
                          }}
                            src={`data:image/png;base64,${item.image}`} alt="User" />
                        </td>
                        <td>
                          <div style={{ display: 'inline-block', padding: '10px', verticalAlign: 'top' }}>
                            <strong>{item.Name}</strong>
                            <br />
                            <span>{`Cantidad: ${item.quantity} - Precio: $${item.price} - Puntos: ${item.puntos}`}</span>
                           
                          </div>
             
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              ))}
           </div>
            <Container style={{ marginTop: '10px' }}>
              <Col style={{
                backgroundColor: 'rgb(255, 255, 255)', borderRadius: '5px'
                , marginLeft: '10px', border: "1px solid #131212", padding: "20px"
              }}>
                <Row>
                  <Col md={6} style={{ textAlign: "left" }}>
                    <div style={{ marginTop: "10px", fontSize: "18px" }}>
                      SubTotal:
                    </div>
                    <div style={{ marginTop: "10px", fontSize: "18px" }}>
                      Impuestos:
                    </div>
                  </Col>
                  <Col md={6} style={{ textAlign: "right" }}>
                    <div style={{ marginTop: "10px", fontSize: "18px" }}>
                      ${totalPrice}
                    </div>
                    <div style={{ marginTop: "10px", fontSize: "18px" }}>
                      ${ivaPrecio().toFixed(2)}
                    </div>
                  </Col>
                </Row>
                <hr style={{ marginTop: "5px", marginBottom: "5px" }} />
                <div style={{ marginTop: "10px", fontSize: "25px" }}>
                  Total: ${(Number(totalPrice) + Number(ivaPrecio().toFixed(2))).toFixed(2)}
                </div>
              </Col>
            </Container>
          </Container>
        </Col>
        <Modal show={showElegirUbicacion} onHide={() => setShowElegirUbicacion(false)} size="mg">
          <Modal.Header closeButton style={{ borderBottom: 'none' }} />
          <Modal.Body>
            hola
            <Map3
              onLocationSelect={handleLocationSelect}
              onSaveLocation={handleSaveLocation}
            />
          </Modal.Body>
        </Modal>
        <Col>

        </Col>
      </Row>
    </Row>
  )
}
export default Pedidos;
