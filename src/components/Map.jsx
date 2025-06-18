import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import graffitiData from '../data/graffitiData';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/icons/marker-icon.png',
  shadowUrl: '/icons/marker-shadow.png',
});

//Красный маркер для местоположения
const redIcon = new L.Icon({
  iconUrl: '/icons/marker-icon-2x-red.png',
  shadowUrl: '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LongPressPopup({ onLongPress }) {
  const timerRef = useRef(null);
  const [pressing, setPressing] = useState(false);

  useMapEvents({
    mousedown(e) {
      setPressing(true);
      timerRef.current = setTimeout(() => {
        onLongPress(e.latlng);
        setPressing(false);
      }, 700);
      setPressing(true);
    },
    mouseup() {
      if (pressing) {
        clearTimeout(timerRef.current);
        setPressing(false);
      }
    },
    mousemove() {
      if (pressing) {
        clearTimeout(timerRef.current);
        setPressing(false);
      }
    },
    touchstart(e) {
      setPressing(true);
      timerRef.current = setTimeout(() => {
        if (pressing && e.latlng) {
          onLongPress(e.latlng);
          setPressing(false);
        }
      }, 700);
    },
    touchend() {
      if (pressing) {
        clearTimeout(timerRef.current);
        setPressing(false);
      }
    }
  });

  return null;
}

export default function Map({ routeType, userLocation }) {
  const [route, setRoute] = useState([]);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [longPressPosition, setLongPressPosition] = useState(null);

  const mapRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const rawType = new URLSearchParams(location.search).get('routeType') || routeType;
  const currentRouteType = rawType === 'driving' || rawType === 'driving-car' ? 'driving' : 'walking';
  const highlightId = params.get('highlightId');
  const latParam = parseFloat(params.get('lat'));
  const lngParam = parseFloat(params.get('lng'));

  const highlightGraffiti = highlightId
    ? graffitiData.find(g => String(g.id) === highlightId)
    : null;

  const center = !isNaN(latParam) && !isNaN(lngParam)
    ? [latParam, lngParam]
    : highlightGraffiti
      ? highlightGraffiti.coordinates
      : userLocation;
    
  const zoom = (highlightGraffiti || (!isNaN(latParam) && !isNaN(lngParam))) ? 18 : 15;

  useEffect(() => {
    const graffitiId = params.get('graffitiId');
    const type = params.get('routeType') || routeType;

    if (graffitiId && userLocation) {
      const g = graffitiData.find((g) => String(g.id) === graffitiId);
      if (g) buildRoute(g, type);
    }
  }, [userLocation, location.search, routeType]);

  useEffect(() => {
   if (!highlightId || !mapRef.current) return;

    const g = graffitiData.find(g => String(g.id) === highlightId);
    if (g && g.coordinates) {
      mapRef.current.setView(g.coordinates, 18);
    }
  }, [highlightId]);

  const buildRoute = async (graffiti, type) => {
    if (!userLocation) return;

    const profile = type === 'driving' ? 'driving-car' : 'foot-walking';

    const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 5b3ce3597851110001cf624805088c2907db46d6a21787d3ef381872',},
      body: JSON.stringify({
        coordinates: [[userLocation[1], userLocation[0]], [graffiti.coordinates[1], graffiti.coordinates[0]]],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка ORS: ${response.statusText}`);
    }

    const data = await response.json();
    const coordinates = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    setRoute(coordinates);
    setIsRouteVisible(true);

    if (mapRef.current) {
      const bounds = L.latLngBounds(coordinates);
      mapRef.current.fitBounds(bounds);
    }
  };

  const hideRoute = () => {
    setRoute([]);
    setIsRouteVisible(false);
    params.delete('graffitiId');
    params.delete('routeType');
    navigate(`${location.pathname}?${params.toString()}`);
  };

  if (!userLocation) {
    return <div className="map-container">Загрузка карты...</div>;
  }

  return (
    <div className="map-container">
      <MapContainer
        tap={false}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenCreated={mapInstance => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <LongPressPopup onLongPress={(latlng) => setLongPressPosition([latlng.lat, latlng.lng])} />

        <Marker position={userLocation} icon={redIcon}>
          <Popup><h3 className="graffiti-title">Ваше местоположение</h3></Popup>
        </Marker>

        {graffitiData.map((graffiti) => (
          <Marker key={graffiti.id} position={graffiti.coordinates}>
            <Popup>
              <div>
                <h3 className="graffiti-title">{graffiti.name}</h3>
                <p className="graffiti-description">{graffiti.description}</p>
                <Link to={`/graffiti/${graffiti.id}`} className="popup-button">
                  Подробнее
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {longPressPosition && (
          <Marker position={longPressPosition}>
            <Popup
              position={longPressPosition}
              onClose={() => setLongPressPosition(null)}
              autoClose={false}
              closeOnClick={false}
              closeButton={true}
              className="new-marker"
            >
              <div>
                <h3 className="graffiti-title">Добавить граффити?</h3>
                <div className='add-buttons'>
                  <button 
                    className="popup-button" 
                    onClick={() => navigate(`/add-graffiti?coords=${longPressPosition[0]},${longPressPosition[1]}`)}>
                    Да, на этих координатах
                  </button>
                  <button className="popup-button" onClick={() => setLongPressPosition(null)}>
                    Нет
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline 
            positions={route} 
            color={currentRouteType === 'driving' ? 'red' : 'blue'}
          />
        )}

      </MapContainer>

      {isRouteVisible && (
        <button
          className="popup-button"
          onClick={hideRoute}
          style={{
            position: 'absolute',
            border:'1px solid black',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          Скрыть маршрут
        </button>
      )}
    </div>
  );
};
