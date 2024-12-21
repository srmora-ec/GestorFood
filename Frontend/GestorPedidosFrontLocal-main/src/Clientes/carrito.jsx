import React  , { useEffect }from 'react';

const Carrito = () => {
    const { carrito } = useCarritoContext();
    return (
      <div>
        <h2>Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul>
            {carrito.map((producto, index) => (
              <li key={index}>
                <strong>{producto.nombre}</strong> - ${producto.precio}
              </li>
            ))}
          </ul>
        )}
      </div>
  );
};

export default Carrito;
