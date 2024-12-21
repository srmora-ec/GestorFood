import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col } from 'antd';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import API_URL from '../config';
import imgsucur from './res/logoempresa.png';
import fondo from './res/backgroungl.png';
import { Link } from 'react-router-dom'; // Asegúrate de tener instalado react-router-dom

const Sucursales = () => {
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await fetch(`${API_URL}/sucursal/sucusarleslist/`);
                const data = await response.json();
                setSucursales(data.sucursales);
            } catch (error) {
                console.error('Error al obtener las sucursales', error);
            }
        };
        fetchSucursales();
    }, []);

    useEffect(() => {
        if (selectedSucursal && mapRef.current) {
            mapRef.current.flyTo([selectedSucursal.latitud, selectedSucursal.longitud], 13, {
                duration: 1
            });
        }
    }, [selectedSucursal]);

    const handleVerUbicacion = (latitud, longitud) => {
        setSelectedSucursal({ latitud, longitud });
    };

    return (
        <div style={{ backgroundImage: `url(${fondo})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', width: '100vw', height: '100vh', overflow: 'auto' }}>
            <div style={{ backgroundColor: '#BF0000', padding: '15px', display: 'flex', alignItems: 'center' }}>
                <img src={imgsucur} alt="Logo de la empresa" style={{ height: '50px', marginRight: '10px' }} />
                <h3 style={{ color: 'white', margin: 0, fontSize: '22px' }}>Hamburguesas al carbón</h3>
                <Link to="http://localhost:5173" style={{ color: 'white', marginLeft: '1080px' }}>Inicio</Link>
            </div>
            <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'black', fontSize: '23px' }}>Nuestras Sucursales</h2>
                <Row gutter={[16, 16]}>
                    {sucursales.map((sucursal) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={sucursal.id_sucursal}>
                            <Card
                                title={sucursal.snombre}
                                style={{ height: '100%' }}
                                cover={
                                    sucursal.imagensucursal && (
                                        <img
                                            alt={sucursal.snombre}
                                            src={`data:image/png;base64, ${sucursal.imagensucursal}`}
                                            style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                                        />
                                    )
                                }
                            >
                                <p>Dirección: {sucursal.sdireccion}</p>
                                <button onClick={() => handleVerUbicacion(sucursal.id_ubicacion.latitud, sucursal.id_ubicacion.longitud)}>Ver Ubicación</button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            {selectedSucursal && (
                <MapContainer ref={mapRef} center={[selectedSucursal.latitud, selectedSucursal.longitud]} zoom={13} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[selectedSucursal.latitud, selectedSucursal.longitud]} />
                </MapContainer>
            )}
        </div>
    );
};

export default Sucursales;
