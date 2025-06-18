/*import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import graffitiData from '../data/graffitiData';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Компонент для обработки долгого нажатия
const LongPressPopup = ({ onLongPress }) => {
  const timerRef = useRef(null);
  const [pressing, setPressing] = useState(false);

  useMapEvents({
    mousedown(e) {
      timerRef.current = setTimeout(() => {
        onLongPress(e.latlng);
        setPressing(false);
      }, 600); // 600 мс — длительное нажатие
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
      timerRef.current = setTimeout(() => {
        onLongPress(e.latlng);
      }, 600);
    },
    touchend() {
      clearTimeout(timerRef.current);
    }
  });

  return null;
};

const Map = ({ routeType, userLocation }) => {
  const [route, setRoute] = useState([]);
  const [longPressPosition, setLongPressPosition] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('graffitiData:', graffitiData);

  const buildRoute = async (graffiti, type) => {
    if (!userLocation) {
      console.error('userLocation не определен');
      setError('Ваше местоположение не определено');
      return;
    }

    if (!graffiti.coordinates || graffiti.coordinates.length !== 2) {
      console.error('Некорректные координаты граффити:', graffiti);
      setError('Некорректные координаты граффити');
      return;
    }

    const profile = type === 'driving' ? 'driving-car' : 'foot-walking';
    console.log('Построение маршрута:', {
      userLocation,
      graffitiCoordinates: graffiti.coordinates,
      profile,
    });

    try {
      const response = await fetch(`/ors/v2/directions/${profile}/geojson`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
         },
        body: JSON.stringify({
          coordinates: [
            [userLocation[1], userLocation[0]],
            [graffiti.coordinates[1], graffiti.coordinates[0]],
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ORS: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Данные маршрута:', data);
      const coordinates = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coordinates);

      if (mapRef.current) {
        const bounds = L.latLngBounds(coordinates);
        mapRef.current.fitBounds(bounds);
        console.log('Карта центрирована на маршрут');
      }
    } catch (error) {
      console.error('Ошибка при построении маршрута:', error);
      setError('Не удалось построить маршрут. Проверьте подключение.');
    }
  };

  const handleLongPress = (latlng) => {
    setLongPressPosition([latlng.lat, latlng.lng]);
  };

  const handleAddGraffitiClick = () => {
    if (!longPressPosition) return;
    navigate(`/add-graffiti?coords=${longPressPosition[0]},${longPressPosition[1]}`);
  };

  useEffect(() => {
    if (!userLocation) return;

    const params = new URLSearchParams(location.search);
    const graffitiId = params.get('graffitiId');
    const lat = params.get('lat');
    const lng = params.get('lng');
    const type = params.get('routeType') || routeType;

    if (lat && lng) {
      const coordinates = [parseFloat(lat), parseFloat(lng)];
      mapRef.current.setView(coordinates, 16);
    }

    if (graffitiId && mapRef.current) {
      const target = graffitiData.find((g) => String(g.id) === graffitiId);
      if (target) {
        buildRoute(target, type);
      } else {
        setError('Граффити не найдено');
      }
    }
  }, [location.search, routeType, userLocation]);

  if (!userLocation) {
    return <div className="map-container">Загрузка карты...</div>;
  }

  return (
    <div className="map-container">
      {error && <div className="error-message">{error}</div>}
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
        console.log('Карта инициализирована');

        // Дополнительный вызов, если параметры уже в URL
        const params = new URLSearchParams(location.search);
        const graffitiId = params.get('graffitiId');
        const type = params.get('routeType') || routeType;

        if (graffitiId && userLocation) {
          const target = graffitiData.find((g) => String(g.id) === graffitiId);
          if (target) buildRoute(target, type);
        }
        if (lat && lng) {
          const coordinates = [parseFloat(lat), parseFloat(lng)];
          mapRef.current.setView(coordinates, 16);
        }
      }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LongPressPopup onLongPress={handleLongPress} />

        {longPressPosition && (
          <Marker position={longPressPosition}>
            <Popup position={longPressPosition}>
              <div>
                <strong>Добавить граффити?</strong>
                <br />
                <button className="popup-button" onClick={handleAddGraffitiClick}>
                  Да, на этих координатах
                </button>
                <button className="popup-button" onClick={() => setLongPressPosition(null)}>
                  Нет
                </button>
              </div>
            </Popup>
          </Marker>
        )}

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

        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
      {route.length > 0 && (
        <button
          className="popup-button hide-route"
          onClick={() => {
            console.log('Скрытие маршрута');
            setRoute([]);
            navigate('/'); // Очистка параметров URL
          }}
        >
          Скрыть маршрут
        </button>
      )}
    </div>
  );
};

export default Map;*/