import React, { useEffect, useState, useRef } from "react";
import { Row, Col, notification } from 'antd'; 
import API_URL from '../config.js';
import CarritoCliente from "./CarritoCliente .jsx";

const ProductosClientes = ({ selectedCategory, categoryid }) => {
    const [categorias, setCategorias] = useState([]);
    const [carrito, setCarrito] = useState(() => {
        const savedCarrito = localStorage.getItem("carrito");
        return savedCarrito ? JSON.parse(savedCarrito) : {};
    });
    const [visible, setVisible] = useState(false);

    const mostrarCarrito = () => {
        setVisible(true);
    };

    const cerrarCarrito = () => {
        setVisible(false);
    };

    const categoryRefs = useRef({});

    // Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    // Cargar las categorías
    useEffect(() => {
        fetch(API_URL + "/producto/listarproductosclientes/")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.mensaje)) {
                    setCategorias(data.mensaje);
                } else {
                    console.error("La respuesta de la API no contiene un array bajo la propiedad 'mensaje'", data);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Hacer scroll al `categoryid` si existe
    useEffect(() => {
        const currentCategoryId = selectedCategory ? selectedCategory.id_categoria : categoryid;

        if (currentCategoryId && categoryRefs.current[currentCategoryId]) {
            categoryRefs.current[currentCategoryId].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [selectedCategory, categoryid, categorias]);

    // Agregar producto al carrito
    const agregarAlCarrito = (producto) => {
        notification.destroy();
        const nuevoCarrito = { ...carrito };
        if (!nuevoCarrito[producto.id_producto]) {
            nuevoCarrito[producto.id_producto] = { ...producto, cantidad: 1 };
            setCarrito(nuevoCarrito);
            
            notification.success({
                message: "Producto agregado",
                boxShadow: '1px 4px 8px 1px rgba(0, 0, 0, 0.5)',
                borderRadius: '8px',
                description: (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundColor: 'white',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            height: '100%',
                        }}
                    >
                        <div
                            style={{
                                width: '50%',
                                padding: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {producto.imagenp ? (
                                <img
                                    src={`data:image/jpeg;base64,${producto.imagenp}`}
                                    alt={producto.nombre_producto}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                    }}
                                />
                            ) : (
                                <div>No Image Available</div>
                            )}
                        </div>
                        <div style={{ padding: '10px', width: '50%' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', height: '35px' }}>
                                {producto.nombre_producto}
                            </h4>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', height: "35px", paddingTop: '3px' }}>
                                Precio: ${producto.precio_unitario}
                            </p>
                            <button
                                onClick={() => {
                                    notification.destroy();
                                    mostrarCarrito();
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#A80000',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'black'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#A80000'}
                            >
                                VER CARRITO
                            </button>
                        </div>
                    </div>
                ),
            });
        }
    };

    // Actualizar cantidad de producto en el carrito
    const actualizarCantidad = (productoId, incremento) => {
        const nuevoCarrito = { ...carrito };
        if (nuevoCarrito[productoId]) {
            nuevoCarrito[productoId].cantidad += incremento;
            if (nuevoCarrito[productoId].cantidad <= 0) {
                delete nuevoCarrito[productoId]; // Elimina el producto si la cantidad es 0
            }
            setCarrito(nuevoCarrito);
        }
    };

    // Actualizar el carrito cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            const savedCarrito = localStorage.getItem("carrito");
            if (savedCarrito) {
                setCarrito(JSON.parse(savedCarrito));
            }
        }, 3000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: '25px', backgroundColor: "white", borderRadius: "1%" }}>
            {categorias.length === 0 ? (
                <div>Cargando productos...</div>
            ) : (
                categorias.map((categoria) => (
                    <div
                        key={categoria.id_categoria}
                        ref={(el) => (categoryRefs.current[categoria.id_categoria] = el)}
                        style={{ marginBottom: '30px' }}
                    >
                        <h2 style={{ textTransform: 'uppercase', fontSize: '24px', fontWeight: 'bold' }}>
                            {categoria.nombre_categoria}
                        </h2>
                        <Row gutter={[16, 16]}>
                            {categoria.productos.length > 0 ? (
                                categoria.productos.map((producto) => (
                                    <Col
                                        key={producto.id_producto}
                                        xs={24} sm={12} md={8} lg={6}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                boxShadow: '1px 4px 8px 1px rgba(0, 0, 0, 0.5)',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                height: '100%',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '50%',
                                                    padding: '10px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {producto.imagenp ? (
                                                    <img
                                                        src={`data:image/jpeg;base64,${producto.imagenp}`}
                                                        alt={producto.nombre_producto}
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                ) : (
                                                    <div>No Image Available</div>
                                                )}
                                            </div>
                                            <div style={{ padding: '10px', width: '50%' }}>
                                                <h4 style={{ fontSize: '16px', fontWeight: 'bold', height: '25px' }}>
                                                    {producto.nombre_producto}
                                                </h4>
                                                <p style={{ fontSize: '14px', color: '#555', height: '25px', paddingTop: '3px' }}>
                                                    {producto.descripcion_producto}
                                                </p>
                                                <p style={{ fontSize: '14px', fontWeight: 'bold', height: "25px", paddingTop: '3px' }}>
                                                    Precio: ${producto.precio_unitario}
                                                </p>
                                                {carrito[producto.id_producto] ? (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <button
                                                            onClick={() => actualizarCantidad(producto.id_producto, -1)}
                                                            style={{
                                                                padding: '5px 10px',
                                                                backgroundColor: '#f44336',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                marginRight: '5px',
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ fontWeight: 'bold', padding: '2px' }}>{carrito[producto.id_producto].cantidad}</span>
                                                        <button
                                                            onClick={() => actualizarCantidad(producto.id_producto, 1)}
                                                            style={{
                                                                padding: '5px 10px',
                                                                backgroundColor: '#4CAF50',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                marginLeft: '5px',
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => agregarAlCarrito(producto)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                                                    >
                                                        Agregar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <div>No hay productos disponibles para esta categoría.</div>
                            )}
                        </Row>
                    </div>
                ))
            )}
            <CarritoCliente
                carrito={carrito}
                setCarrito={setCarrito}
                visible={visible}
                onClose={cerrarCarrito}
            />
        </div>
    );
};

export default ProductosClientes;
