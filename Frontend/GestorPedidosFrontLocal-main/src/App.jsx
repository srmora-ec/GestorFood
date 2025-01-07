const { Header, Content, Footer } = Layout;
import {
  Layout,
  Menu,
  Row,
  Col,
  Image,
  Dropdown,
  Button,
  Badge,
  theme,
  Breadcrumb,
  Tooltip,
} from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MapComponent from "./components/MapaUbicacion";
//import Carrusel from "./components/pruebaCarrusel";
//import MenuNavBar from "./components/MenuNavBar";
//import ProfileEditor from "./components/EditarUser";
import LoginForm from "./components/login";
import RegisterForm from "./components/registro";
import AdminMenu from './components/adminmenu';
import MenuCocina from "./components/menucocina";
import React, { useState } from 'react';
import MenuMesero from "./components/Mesero/meseromenu";
import ValidarPedido from "./Clientes/Validarpedido";
import { ShoppingCartProvider } from './context/CarritoContext';
import { RecompensasProvider } from './context/RecompensaContext';
import MostrarMesas from "./Clientes/Reserva";
import MenuComandas from "./components/menucomandas";
import MapaUbicacion from "./components/MapaUbicacion";
import LocationCard from "./components/cards";
import Sucursalescliente from "./Clientes/sucursales";
import Sucursales from "./Clientes/sucursal";
import InicioCliente from "./Clientes/inicio";
import CatMenuClientes from "./Clientes/catMenuClientes";
import MenuCliente from "./Clientes/menuClientes";
import MenuMotorizado from "./components/Motorizado/menumotorizado";
function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const renderContent = () => {
    const storedToken = localStorage.getItem("token");
    if (user || storedToken) {
      return <AdminMenu />;
    }
    return <LoginForm onLogin={handleLogin} />;
  };

  return (
    <Router>
  
        <Content>
          <div>
          <ShoppingCartProvider>
            <RecompensasProvider>
            <Routes>
              {/* Ruta principal para mostrar Carrusel */}
              <Route path="/" element={<InicioCliente/> } />

              {/* Rutas para otras secciones */}
              <Route path="/Menu/:categoryId" element={<MenuCliente/>} />  
              <Route path="/home" element={<AdminMenu />} />
              <Route path="/homemesero" element={<MenuMesero />} />
              <Route path="/homemotorizado" element={<MenuMotorizado />} />
              <Route path="/cocina" element={<MenuCocina/>} />
              <Route path="/S" element={<LocationCard/>} />
              {/* Rutas para autenticación */}
              <Route path="/Registro" element={<RegisterForm/>} />
              <Route path="/Comandas" element={<MenuComandas/>} />
              <Route path="/Sucursales" element={<Sucursalescliente/>} />
              <Route path="/sucursal" element={<Sucursales />} />
            </Routes>
              </RecompensasProvider>
            </ShoppingCartProvider>
          </div>
        </Content>
      
    </Router>
  );
}

export default App;