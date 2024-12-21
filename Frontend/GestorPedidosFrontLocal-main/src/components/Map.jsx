import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({setUbicacion }) => {
  const [center, setCenter] = useState([-1.0241157747979186, -79.46108497663826]);
  const [marker, setMarker] = useState(null);
  const handleSaveLocation = () => {
    if (marker) {
      const { latitude, longitude } = marker;
      // Actualiza el estado de ubicacion usando setUbicacion
      setUbicacion(`${latitude}, ${longitude}`);
    }
  };
  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        setMarker({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };

  const handleCancel = () => {
    setMarker(null);
  };

  const MapClickHandler = () => {
    useMapEvent('click', (event) => {
    
        const { lat, lng } = event.latlng;
        console.log('Latitud:', lat, 'Longitud:', lng);
        setMarker({ latitude: lat, longitude: lng });
      
    });

    return null;
  };

  return (
    <div className="flex flex-col mt-4">
    
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '300px', width: '100%', maxWidth: '800px', margin: '0 auto' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapClickHandler />

        {marker && (
          <Marker position={[marker.latitude, marker.longitude]}>
            <Popup>{`Latitud: ${marker.latitude.toFixed(4)}, Longitud: ${marker.longitude.toFixed(4)}`}</Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="flex justify-center mt-4 space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleGetCurrentLocation}>
          Obtener Ubicación Actual
        </button>
        <button onClick={handleSaveLocation}>
          Guardar
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Map;
