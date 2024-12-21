import React, { useContext } from "react";

import { CartContext } from "../context/CarritoContext";

const Item = ({ nombreproducto, preciounitario, id_producto, imagenp }) => {
  const [cart, setCart] = useContext(CartContext);

  const addToCart = () => {
    setCart((currItems) => {
      const isItemsFound = currItems.find((item) => item.id === id_producto);
      if (isItemsFound) {
        return currItems.map((item) => {
          if (item.id === id_producto) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      } else {
        return [...currItems, { id: id_producto, quantity: 1, price: parseFloat(preciounitario) }];
      }
    });
  };

  const removeItem = () => {
    setCart((currItems) => {
      if (currItems.find((item) => item.id === id_producto)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id_producto);
      } else {
        return currItems.map((item) => {
          if (item.id === id_producto) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const getQuantityById = () => {
    return cart.find((item) => item.id === id_producto)?.quantity || 0;
  };

  const quantityPerItem = getQuantityById();

  return (
    <div className="item-box">
      {quantityPerItem > 0 && (
        <div className="item-quantity">{quantityPerItem}</div>
      )}

      <div>{nombreproducto}</div>
      <img src={`data:image/png;base64,${imagenp}`} alt={nombreproducto} width="80" height="55" />
      <div className="item-price">${preciounitario}</div>

      {quantityPerItem === 0 ? (
        <button className="item-add-button" onClick={() => addToCart()}>
          + Add to cart
        </button>
      ) : (
        <button className="item-plus-button" onClick={() => addToCart()}>
          + add more
        </button>
      )}

      {quantityPerItem > 0 && (
        <button className="item-minus-button" onClick={() => removeItem()}>
          subtract item
        </button>
      )}
    </div>
  );
};

export default Item;
