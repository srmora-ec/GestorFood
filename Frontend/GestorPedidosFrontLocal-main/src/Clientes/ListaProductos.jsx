import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Card as AntCard, Input, notification, Spin } from "antd";
import { CartContext } from "../context/CarritoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faStar } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from 'react-bootstrap';
import API_URL from '../config';
const { Meta } = AntCard;
const { TextArea } = Input;

const ListProductos = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cart, setCart, totalPoints2, calcularTotalPoints } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL + "/producto/listar/")
      .then((response) => response.json())
      .then((data) => setProducts(data.productos))
      .catch((error) => console.error("Error fetching products:", error))
      .finally(()=>setLoading(false));
  }, []);

  const handleCardClick = (product) => {
    console.log(products);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
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

  const getQuantityById = (productId) => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  return (
    <>
      <Spin spinning={loading} tip="Cargando..." style={{height:'500px'}}>
        <div style={{ marginTop: "30px", marginLeft: "5px", display: "flex" }}>
          <Row>
            {products.map((product, index) => (
              <Col >
                <AntCard
                  hoverable
                  key={product.id}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    marginRight: index < products.length - 1 ? "20px" : "0",
                  }}
                  onClick={() => handleCardClick(product)}
                  cover={
                    <img
                      alt={`Imagen de ${product.nombreproducto}`}
                      src={`data:image/png;base64,${product.imagenp}`}
                      style={{ width: "100%", height: "270px" }}
                    />
                  }
                >
                  <Meta title={product.nombreproducto} description={product.descripcionproducto} />
                  <div style={{ display: 'flex' }}>
                    <p
                      style={{
                        marginTop: '10px',
                        width: '50px',
                        backgroundColor: "#0a2e02",
                        marginRight: '10px',
                        color: "#fff",
                        borderRadius: "10px",
                        textAlign: 'center',
                      }}
                    >{`$${product.preciounitario}`}</p>
                    <p
                      style={{
                        marginTop: '10px',
                        width: '50px',
                        backgroundColor: "#5a0a03",
                        color: "#fff",
                        borderRadius: "10px",
                        textAlign: 'center',
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        style={{
                          color: "#FFD700",
                          marginRight: '1px',
                        }}
                      />
                      {`${product.puntosp}`}</p>
                  </div>
                </AntCard>
              </Col>
            ))}
          </Row>

        </div>
      </Spin>

      <Modal visible={showModal} onCancel={handleCloseModal}
        footer={null}
        width={800}  // Ajusta el ancho del modal según tus necesidades
      >
        <div>
          {selectedProduct && (
            <>
              <h5 style={{ textAlign: 'center' }}>{selectedProduct.nombreproducto}</h5>
              <Row style={{ marginBottom: '10px' }}>
                <Col style={{ paddingRight: '10px', marginRight: '100px' }}>
                  <img
                    src={`data:image/png;base64,${selectedProduct.imagenp}`}
                    alt={`Imagen de ${selectedProduct.nombreproducto}`}
                    style={{ width: '360px', height: '440px' }}
                  />
                </Col>
                <Col>
                  <h5 style={{ borderBottom: '1px solid #9b9b9b', paddingBottom: '10px', }}>
                    Descripción
                  </h5>
                  <p>{selectedProduct.descripcionproducto}</p>
                  <h5 style={{ borderBottom: '1px solid #9b9b9b', paddingBottom: '10px', }}>
                    Precio Unitario
                  </h5>
                  <p
                    style={{
                      backgroundColor: "#0a2e02",
                      width: '70px',
                      color: "#fff",
                      borderRadius: "10px",
                      textAlign: 'center',
                    }}
                  >{`$${selectedProduct.preciounitario}`}</p>
                  <h5 style={{ borderBottom: '1px solid #9b9b9b', paddingBottom: '10px', }}>
                    Puntos
                  </h5>
                  <p
                    style={{
                      backgroundColor: "#5a0a03",
                      width: '40px',
                      color: "#fff",
                      borderRadius: "10px",
                      textAlign: 'center',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{
                        color: "#FFD700",
                        marginRight: '1px',
                      }}
                    />
                    {selectedProduct.puntosp}</p>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                    {selectedProduct && (
                      <>
                        {getQuantityById(selectedProduct.id_producto) === 0 ? (
                          <Button style={{
                            backgroundColor: "#000000",
                            color: "#fff",
                            border: 'none',
                          }}
                            icon={<FontAwesomeIcon icon={faShoppingCart} />}
                            onClick={() => addToCart(selectedProduct.id_producto)}>
                            Añadir al carrito
                          </Button>
                        ) : (
                          <Button
                            style={{
                              marginLeft: "1px",
                              backgroundColor: "#050138",
                              color: "#fff",
                              border: 'none'
                            }}
                            onClick={() => addToCart(selectedProduct.id_producto)}
                          >
                            +
                          </Button>
                        )}
                        {getQuantityById(selectedProduct.id_producto) > 0 && (
                          <div
                            style={{
                              padding: "5px",
                              width: '57px',
                              marginLeft: "10px",
                              backgroundColor: "#000000",
                              color: "#fff",
                              borderRadius: "10px",
                              textAlign: 'center'
                            }}
                          >
                            {getQuantityById(selectedProduct.id_producto)}
                          </div>
                        )}
                        {getQuantityById(selectedProduct.id_producto) > 0 && (
                          <Button
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#A80000",
                              color: "#fff",
                              border: 'none'
                            }}
                            onClick={() => removeItem(selectedProduct.id_producto)}
                          >
                            -
                          </Button>
                        )}
                      </>

                    )}

                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ListProductos;

