import React, { useContext, useState, useEffect } from "react";
import Lottie from "react-lottie";
import {
  Form,
  Modal,
  Button,
  Row,
  ButtonGroup,
  Container,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../context/CarritoContext";
import { RecompensaContext } from "../context/RecompensaContext";
import { Radio, InputNumber } from "antd";
import { Avatar, Card, Skeleton, Badge } from 'antd';
const { Meta } = Card;
import { notification } from "antd";
import animationData from "../assets/lottis/B.json"; // Importa el archivo JSON de tu animación
import Pedidos from "./pedido";
import API_URL from '../config';

const ShoppingCart = () => {
  const { cart, setCart, totalPoints2, calcularTotalPoints,  restarTotalPoints  } = useContext(CartContext);
  const [recompensa, setRecompensa] = useContext(RecompensaContext);
  const [mostrarPedido, setMostrarPedido] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const lottieOptions = {
    loop: true,
    autoplay: !isAnimationPaused,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const toggleAnimation = () => {
    setIsAnimationPaused(!isAnimationPaused);
  };
  const estiloTexto = {
    marginTop: "200px",
    fontSize: "24px", // Ajusta el tamaño del texto
    textAlign: "center",
    fontFamily: "Circular, sans-serif", // Cambia el estilo de letra
    color: "Black", // Cambia el color del texto
    marginBottom: "270px",
  };



  const id_cuenta = localStorage.getItem("id_cuenta");
  useEffect(() => {
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
  }, []);

  const ivaPrecio = () => {
    let iva = 0;
    for (let i = 0; i < cart.length; i++) {
      const currentItem = cart[i];
      if (currentItem.iva == 1) {
        iva += currentItem.quantity * currentItem.price * 0.12;
      }
    }
    return iva;
  };

 
 
  const addToCart = (productId) => {
    setCart((currItems) => {
      const isItemFound = currItems.find((item) => item.id === productId);
      if (isItemFound) {
        return currItems.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      } else {
        notification.success({
          message: 'Se agregó el producto al carrito',
          placement: 'topLeft'
        });
        return [
          ...currItems,
          {
            id: productId,
            type: 'producto',
            quantity: 1,
            Name: selectedProduct.nombreproducto,
            image: selectedProduct.imagenp,
            puntos: selectedProduct.puntosp,
            price: parseFloat(selectedProduct.preciounitario),
            iva: selectedProduct.iva,
          },
        ];
      }
    });
  };


  const addToCart2 = (productId, productName, productImage, productPoints) => {
    console.log('userData:', totalPoints2);
    console.log('productPoints:', productPoints);
    const userPoints = parseInt(totalPoints2);
    const pointsNeeded = parseInt(productPoints);
    

    if (!isNaN(userPoints) && !isNaN(pointsNeeded) && userPoints >= pointsNeeded) {
      calcularTotalPoints(-pointsNeeded);
      setRecompensa((currItems) => {
        const isItemFound = currItems.find((item) => item.id === productId);
        if (isItemFound) {
          console.log('Item encontrado en el carrito. Actualizando cantidad...');
          return currItems.map((item) => {
            if (item.id === productId) {
              return { ...item, quantity: item.quantity + 1  };
            } else {
              return item;
            }
          });
        } else {
          console.log('Añadiendo nueva recompensa al carrito...');
          return [
            ...currItems,
            {
              id: productId,
              type: 'recompensa',
              quantity: 1,
              Name: productName,
              image: productImage,
              price: 0,
              puntos: productPoints,
            },
          ];
          
        }
      });
    } else {
      console.log('No tienes suficientes puntos para reclamar esta recompensa.');
      notification.error({
        message: 'Puntos insuficientes',
        description: 'No tienes suficientes puntos para reclamar esta recompensa.',
      });
    }
  };
  const HacerClick = () => {
    const combinedItems = [...cart, ...recompensa];
  
    if (combinedItems.length > 0) {
      setMostrarPedido(true);
    }
  };
  
  const regresar = () => {
    setMostrarPedido(false);
  };
  const removeItem = (productId) => {
    setCart((currItems) => {
      const updatedCart = currItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(item.quantity - 1, 0) };
        } else {
          return item;
        }
      });

      return updatedCart.filter((item) => item.quantity > 0);
    });
  };
  const reclamarPuntos = async (item) => {
    try {
      const formData = new FormData();
      formData.append('puntos_recompensa_producto', item.puntos);
      formData.append('id_recompensa_producto',item.id );
      console.log('puntos restados')
      // Realiza la solicitud POST a la API
      const response = await fetch(API_URL +`/Recompensas/Sumar_puntos/${id_cuenta}/`, {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      // Devuelve true si todo fue exitoso
      return true;
    } catch (error) {
      console.error(error.message);
      
      // Devuelve false si hubo un error
      return false;
    }
  };
  




  const removeItem2 = (productId) => {
    setRecompensa((currItems) => {
      const updatedCart = currItems.map((item) => {
        if (item.id === productId) {
          console.log('puntos del item:', item.puntos)
          const userPoints = parseInt(item.puntos);
          calcularTotalPoints(userPoints);
          
          return { ...item, quantity: Math.max(item.quantity - 1, 0)};
         
        } else {
          return item;
        }
      });

      return updatedCart.filter((item) => item.quantity > 0);
    });
  };
  
  const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0) + recompensa.reduce((acc, curr) => acc + curr.quantity, 0);


  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.price,
    0
  );

  const combinedItems = [...cart, ...recompensa];

  return (
    <>
       <div>
        {mostrarPedido ? (
          <Pedidos regresar={regresar} />
        ) : (
          <div style={{ marginTop: '5px' }}>
            {cart.length > 0 && (
              <Container>
                <Badge count={"Productos en el carrito: " + totalQuantity} showZero color='#faad14' />
                <ul>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        fontSize: "18px",
                        marginTop: "10px",
                      }}
                    >
                      <Row>
                        <Col md={2}>
                          <img style={{
                            width: "90px",
                            height: "90px",
                            border: '1px solid #9b9b9b',
                          }}
                            src={`data:image/png;base64,${item.image}`} alt="User" />
                        </Col>
                        <Col md={5}>
                          <strong>{item.Name}</strong>
                          <br />
                          <span>{`Cantidad: ${item.quantity} - Precio: $${item.price} - Puntos: ${item.puntos}`}</span>
                         
                        </Col>
                        <Col md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Button
                              onClick={() => removeItem(item.id)}
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
                                  marginRight: '10px' // Ajusta el margen derecho
                              }}
                              onMouseOver={(e) =>
                                  (e.target.style.backgroundColor = "#333")
                              }
                              onMouseOut={(e) =>
                                  (e.target.style.backgroundColor = "#000")
                              }
                          >
                              -
                          </Button>
                          <Button
                              onClick={() => addToCart(item.id)}
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
                                  marginRight: '10px' // Ajusta el margen derecho
                              }}
                              onMouseOver={(e) =>
                                  (e.target.style.backgroundColor = "#333")
                              }
                              onMouseOut={(e) =>
                                  (e.target.style.backgroundColor = "#000")
                              }
                          >
                              +
                          </Button>
                      </Col>
                      </Row>
                    </div>
                  ))}
                </ul>
              </Container>
            )}

            {recompensa.length > 0 && (
              <Container>
                <h2>Productos de Recompensas</h2>
                <ul>
                  {recompensa.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        fontSize: "18px",
                        marginTop: "10px",
                      }}
                    >
                      <Row>
                        <Col md={2}>
                          <img style={{
                            width: "90px",
                            height: "90px",
                            border: '1px solid #9b9b9b',
                          }}
                            src={`data:image/png;base64,${item.image}`} alt="User" />
                        </Col>
                        <Col md={5}>
                          <strong>{item.Name}</strong>
                          <br />
                          <span>{`Cantidad: ${item.quantity} - Precio: $${item.price}`}</span>
                        </Col>
                        <Col md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Button
                              onClick={() => {removeItem2(item.id);
                                reclamarPuntos(item);
                              }}
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
                                  marginRight: '10px' // Ajusta el margen derecho
                              }}
                              onMouseOver={(e) =>
                                  (e.target.style.backgroundColor = "#333")
                              }
                              onMouseOut={(e) =>
                                  (e.target.style.backgroundColor = "#000")
                              }
                          >
                              -
                          </Button>
                          <Button
                              onClick={() => addToCart2(item.id,item.Name,item.image,item.puntos  )}
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
                                  marginRight: '10px' // Ajusta el margen derecho
                              }}
                              onMouseOver={(e) =>
                                  (e.target.style.backgroundColor = "#333")
                              }
                              onMouseOut={(e) =>
                                  (e.target.style.backgroundColor = "#000")
                              }
                          >
                              +
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </ul>
              </Container>
            )}

            {(cart.length === 0 && recompensa.length === 0) && (
              <div style={estiloTexto}>
                No hay productos en el carrito.
                <br />
                <div onClick={toggleAnimation}>
                  <Lottie options={lottieOptions} height={100} width={100} />
                </div>
              </div>
            )}

            {combinedItems.length > 0 && (
              <Container>
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
                  <Row>
                    <Col>
                      <div className="d-grid gap-2">
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
                          
                          Realizar pedido
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Container>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
