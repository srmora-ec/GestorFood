import React, { useEffect } from 'react';
import { Drawer, Button, Row, Col, notification } from 'antd';
import API_URL from '../config';

const CarritoCliente = ({ carrito, setCarrito, visible, onClose }) => {
    const total = Object.values(carrito).reduce((acc, producto) => {
        return acc + (producto.precio_unitario ) * producto.cantidad;
    }, 0);

    const subtotal = Object.values(carrito).reduce((acc, producto) => {
        const impuestoTotal = (
            parseFloat(producto.impuesto?.total_impuestos || 0)
        );
        return acc + (impuestoTotal) * producto.cantidad;
    }, 0);

    const actualizarCantidad = (productoId, incremento) => {
        const nuevoCarrito = { ...carrito };
        if (nuevoCarrito[productoId]) {
            nuevoCarrito[productoId].cantidad += incremento;
            if (nuevoCarrito[productoId].cantidad <= 0) {
                delete nuevoCarrito[productoId];
            }
            setCarrito(nuevoCarrito);
        }
    };

    const eliminarProducto = (productoId) => {
        const nuevoCarrito = { ...carrito };
        delete nuevoCarrito[productoId];
        setCarrito(nuevoCarrito);
        notification.success({
            message: 'Producto eliminado',
            description: 'El producto ha sido eliminado del carrito',
        });
    };

    const vaciarCarrito = () => {
        setCarrito({});
        notification.success({
            message: 'Carrito vacío',
            description: 'El carrito ha sido vaciado correctamente',
        });
    };

    const procederPago = () => {
        console.log(carrito);
        notification.success({
            message: 'Pago',
            description: 'Redirigiendo al sistema de pago...',
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const carritoDesdeStorage = localStorage.getItem('carrito');
            if (carritoDesdeStorage) {
                const carritoActualizado = JSON.parse(carritoDesdeStorage);
                setCarrito(carritoActualizado);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [setCarrito]);

    return (
        <Drawer
            title={<span style={{ fontWeight: 'bold' }}>CARRITO</span>}
            placement="right"
            visible={visible}
            onClose={onClose}
            width={400}
            bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%',paddingRight:'3px',marginRight:'0' }}
            footer={
                <div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>Subtotal:</strong> ${(total).toFixed(2)}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>Impuestos:</strong> ${(subtotal).toFixed(2)}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <strong>Total:</strong>
                    </div>
                    <h4>${total.toFixed(2)}</h4>
                    <Button
                        style={{
                            width: '100%',
                            backgroundColor: '#A80000',
                            color: 'white',
                            border: 'none',
                            marginBottom: '8px',
                        }}
                        onClick={procederPago}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'black')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#A80000')}
                    >
                        Ir a pagar
                    </Button>
                    <Button
                        style={{
                            width: '100%',
                            backgroundColor: '#ADACAB',
                            color: 'white',
                            border: 'none',
                        }}
                        onClick={vaciarCarrito}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'black')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#ADACAB')}
                    >
                        Vaciar carrito
                    </Button>
                </div>
            }
            footerStyle={{ backgroundColor: 'white', boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)' }}
        >
            {Object.values(carrito).length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                    <Row gutter={[16, 16]}>
                        {Object.values(carrito).map((producto) => (
                            <Col key={producto.id_producto} span={24}>
                                <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'center' }}>
                                    <img
                                        src={`data:image/jpeg;base64,${producto.imagenp}`}
                                        alt={producto.nombre_producto}
                                        style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h5>{producto.nombre_producto}</h5>
                                        <p style={{ fontWeight: 'bold' }}>
                                            $
                                            {(producto.precio_unitario).toFixed(2)}
                                        </p>
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
                                            <span style={{ fontWeight: 'bold', padding: '2px' }}>{producto.cantidad}</span>
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
                                    </div>
                                    <button
                                        onClick={() => eliminarProducto(producto.id_producto)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: 'white',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginLeft: '10px',
                                        }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#ADACAB')}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </Drawer>


    );
};

export default CarritoCliente;
