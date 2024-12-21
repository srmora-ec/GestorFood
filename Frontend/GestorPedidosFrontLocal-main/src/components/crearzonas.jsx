import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

const Crearsector = ({ sucursales, onLocationSelect, onSaveLocation, logo, selectedSucursal }) => {
    const [center, setCenter] = useState([-1.0241157747979186, -79.46108497663826]);
    const mapRef = useRef(null);

    const customIcon = new L.Icon({
        iconUrl: `data:image/png;base64,${logo}`,
        iconSize: [48, 48], // Ajusta el tamaño según tus necesidades
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
    const handleMarkerClick = (sucursal) => {
        const { latitud, longitud } = sucursal.id_ubicacion;
        mapRef.current.flyTo([latitud, longitud], 15);
    };

    const SearchControlHandler = () => {
        const map = useMap();

        const searchControl = new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            style: 'bar',
            showMarker: false,
            showPopup: false,
            maxMarkers: 1,
            retainZoomLevel: false,
            animateZoom: true,
            autoClose: true,
            searchLabel: 'Buscar ubicación',
            keepResult: true,
        });

        useEffect(() => {
            map.addControl(searchControl);
            return () => {
                map.removeControl(searchControl);
            };
        }, [map, searchControl]);

        return null;
    };

    // Utilizar useEffect para ajustar el zoom para que todos los marcadores sean visibles
    useEffect(() => {
        if (mapRef.current && sucursales.length > 0) {
            const bounds = L.latLngBounds(sucursales.map((sucursal) => [sucursal.id_ubicacion.latitud, sucursal.id_ubicacion.longitud]));
            mapRef.current.fitBounds(bounds, { padding: [100, 100] });
        }
        if (selectedSucursal) {
            const { latitud, longitud } = selectedSucursal.id_ubicacion;
            mapRef.current.flyTo([latitud, longitud], 15);
        }
    }, [sucursales, selectedSucursal]);



    return (
        <div>
            <MapContainer
                center={center}
                zoom={13}
                style={{ width: '100%', height: '650px' }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {sucursales && (
                    <>
                        {sucursales.map((sucursal) => (
                            <Marker
                                key={sucursal.id_sucursal}
                                position={[sucursal.id_ubicacion.latitud, sucursal.id_ubicacion.longitud]}
                                icon={customIcon}
                                eventHandlers={{ click: () => handleMarkerClick(sucursal) }}

                            >
                                <Popup>
                                    <>
                                        <spam style={{ fontWeight: 'bold', color: 'black', display: 'block' }}>
                                            {sucursal.snombre}
                                        </spam>
                                        <spam>{sucursal.sdireccion}</spam>
                                        <span style={{ color: sucursal.estadoApertura === 'Abierto ahora' ? 'green' : 'red', display: 'block' }}>
                                            {sucursal.estadoApertura}
                                        </span>
                                    </>
                                </Popup>
                            </Marker>
                        ))}
                    </>
                )}
            </MapContainer>
        </div>
    );
};

export default Crearsector;
