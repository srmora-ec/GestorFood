import React, { useState } from "react"; 
import NavBar from "./NavBar";
import fondo from './res/backgroungl.png';
import CatMenuClientes from "./catMenuClientes";
import { Col, Row } from "antd";
import ProductosClientes from "./ProductosCliente";
import { useParams } from "react-router-dom";


const MenuCliente = () => {
  const { categoryId } = useParams(); 
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para la categoría seleccionada

  // Función para actualizar la categoría seleccionada
  const handleCategoryClick = (categoria) => {
    console.log(categoria);
    setSelectedCategory(categoria);
  };

  return (
    <div style={{ 
      backgroundImage: `url(${fondo})`, 
      backgroundSize: 'auto 100%', 
      backgroundRepeat: 'repeat-x', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'auto' 
    }}>
      <NavBar />
      <h3
        style={{
          padding: "10px",
          color: "Black",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        MENÚ
      </h3>
      <Row gutter={[16, 16]}>
        {/* Columna para la categoría: en pantallas pequeñas se oculta */}
        <Col xs={0} sm={4} style={{ height: '100vh', overflowY: 'auto' }}>
          <CatMenuClientes onCategoryClick={handleCategoryClick} />
        </Col>
        {/* Columna para los productos: ocupa todo el ancho en pantallas pequeñas */}
        <Col xs={24} sm={20} style={{ height: '100vh', overflowY: 'auto' }}>
          <div style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
            {/* Pasamos la categoría seleccionada a ProductosClientes */}
            <ProductosClientes selectedCategory={selectedCategory} categoryid={categoryId}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MenuCliente;
