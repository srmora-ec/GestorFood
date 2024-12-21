import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Carrusel from "./carrusel";
import CatMenuClientes from "./catMenuClientes";
import NavBar from "./NavBar";
import fondo from './res/backgroungl.png';

const InicioCliente = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const navigate = useNavigate(); // Hook para redirigir

  const handleCategoryClick = (categoria) => {
    setSelectedCategory(categoria);
    // Redirigir a la vista de menú pasando el id de la categoría como parámetro
    navigate(`/menu/${categoria.id_categoria}`);
  };

  return (
    <div style={{ backgroundImage: `url(${fondo})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', width: '100vw', height: '100vh', overflow: 'auto' }}>
      <NavBar />
      <Carrusel />
      <h3
        style={{
          backgroundColor: "#A80000",
          padding: "10px",
          color: "white",
          textAlign: "center"
        }}
      >
        MENÚ
      </h3>
      <CatMenuClientes onCategoryClick={handleCategoryClick} />
    </div>
  );
};

export default InicioCliente;
