import React, { createContext, useState } from "react";

export const CartContext = createContext(null);

export const ShoppingCartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalPoints2, setTotalPoints] = useState(() => {
    const storedTotalPoints = localStorage.getItem("totalPoints");
    return storedTotalPoints ? parseInt(storedTotalPoints) : 0;
  });
  // Función para calcular y establecer los puntos totales
  const calcularTotalPoints = (puntosGanados) => {
    const newTotalPoints = totalPoints2 + puntosGanados;
    setTotalPoints(newTotalPoints);
    localStorage.setItem("totalPoints", newTotalPoints.toString()); // Actualiza el valor en el almacenamiento local
  };

  const restarTotalPoints = (puntos) => {
    const newTotalPoints = totalPoints2 - puntos; // Restamos los puntos
    setTotalPoints(newTotalPoints);
    localStorage.setItem("totalPoints", newTotalPoints.toString()); // Actualiza el valor en el almacenamiento local
  };
  
  return (
    <CartContext.Provider value={{ cart, setCart, totalPoints2,setTotalPoints ,calcularTotalPoints, restarTotalPoints }}>
      {children}
    </CartContext.Provider>
  );
};
