import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';


const Map3 = ({ onLocationSelect, onSaveLocation  }) => {
  const [center, setCenter] = useState([-1.0241157747979186, -79.46108497663826]);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  const handleSaveLocation = () => {
    console.log('Hola por favorw');
    if (marker) {
      console.log('Hola por favor');
      onSaveLocation(marker);
    }
  };
  const MapClickHandler = () => {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      console.log('Latitud:', lat, 'Longitud:', lng);
      setMarker({ latitude: lat, longitude: lng });

    });

    return null;
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        setMarker({ latitude, longitude });
        mapRef.current.flyTo([latitude, longitude], 15);
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };

  const handleCancel = () => {
    setMarker(null);
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

  

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler />

        {marker && (
          <Marker position={[marker.latitude, marker.longitude]}>
            <Popup>{`Latitud: ${marker.latitude.toFixed(4)}, Longitud: ${marker.longitude.toFixed(4)}`}</Popup>
          </Marker>
        )}

      <SearchControlHandler />

      </MapContainer>
      <div>
        <button onClick={handleGetCurrentLocation}>
          Obtener Ubicación Actual
        </button>
        <button onClick={handleSaveLocation}>
          Guardar
        </button>
        <button onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Map3;
