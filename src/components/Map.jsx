import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import graffitiData from '../data/graffitiData';

const redIcon = new L.Icon({
  iconUrl: '/icons/marker-icon-2x-red.png',
  shadowUrl: '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const graffitiIcon = new L.Icon({
  iconUrl: '/icons/marker-icon-2x.png',
  shadowUrl: '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function DoubleClickPopup({ onDoubleClick }) {
  const lastTouchRef = useRef(null);

  useMapEvents({
    dblclick(e) {
      onDoubleClick(e.latlng);
    },
    touchend(e) {
      const now = new Date().getTime();
      const lastTouch = lastTouchRef.current;

      if (lastTouch && now - lastTouch.time < 300 && e.latlng) {
        onDoubleClick(e.latlng);
      }

      lastTouchRef.current = { time: now };
    },
  });

  return null;
}

export default function Map({ routeType, userLocation }) {
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [doubleClickPosition, setDoubleClickPosition] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [tempRouteTypes, setTempRouteTypes] = useState({});
  const [segments, setSegments] = useState([]);

  const mapRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
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
      if (g) setWaypoints([{ ...g, routeType: type }]);
    }
  }, [userLocation, location.search, routeType]);

  useEffect(() => {
   if (!highlightId || !mapRef.current) return;

    const g = graffitiData.find(g => String(g.id) === highlightId);
    if (g && g.coordinates) {
      mapRef.current.setView(g.coordinates, 18);
    }
  }, [highlightId]);

  useEffect(() => {
    if (!userLocation || waypoints.length === 0) return;

    const buildSegment = async (from, to, routeType) => {
      const profile = routeType === 'driving' ? 'driving-car' : 'foot-walking';
      const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 5b3ce3597851110001cf624805088c2907db46d6a21787d3ef381872',
        },
        body: JSON.stringify({
          coordinates: [[from[1], from[0]], [to.coordinates[1], to.coordinates[0]]],
        }),
      });

      if (!response.ok) return;

      const data = await response.json();
      const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      return {
        points: coords,
        color: routeType === 'driving' ? 'red' : 'blue',
      };
    };

    const buildAllSegments = async () => {
      const allSegments = [];
      let from = { coordinates: userLocation };

      for (const point of waypoints) {
        const segment = await buildSegment(from.coordinates, point, point.routeType);
        if (segment) allSegments.push(segment);
        from = point;
      }

      setSegments(allSegments);
      setIsRouteVisible(true);

      const allPoints = allSegments.flatMap(seg => seg.points);
      if (mapRef.current && allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        mapRef.current.fitBounds(bounds);
      }
    };

    buildAllSegments();
  }, [waypoints, userLocation]);

  const handleAddToRoute = (graffiti) => {
    const selectedType = tempRouteTypes[graffiti.id] || 'walking';
    setWaypoints(prev => {
      const alreadyIn = prev.some(g => g.id === graffiti.id);
      if (!alreadyIn) {
        return [...prev, { ...graffiti, routeType: selectedType }];
      }
      return prev;
    });
  };

  const hideRoute = () => {
    setWaypoints([]);
    setSegments([]);
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
        
        <DoubleClickPopup onDoubleClick={(latlng) => setDoubleClickPosition([latlng.lat, latlng.lng])} />

        <Marker position={userLocation} icon={redIcon}>
          <Popup><h3 className="graffiti-title">Ваше местоположение</h3></Popup>
        </Marker>

        {graffitiData.map((graffiti) => (
          <Marker key={graffiti.id} position={graffiti.coordinates} icon={graffitiIcon}>
            <Popup>
              <div>
                <h3 className="graffiti-title">{graffiti.name}</h3>
                <p className="graffiti-description">{graffiti.description}</p>
                <Link 
                  style={{ marginRight:10, marginBottom: 10 }}
                  to={`/graffiti/${graffiti.id}`} 
                  className="popup-button">
                  Подробнее
                </Link>
                <button 
                  className="popup-button" 
                  onClick={() => handleAddToRoute(graffiti)}>
                  Добавить в маршрут
                </button>
                <div className="route-type-selector fancy-radio-group" style={{ marginTop: '12px' }}>
                  <label className="fancy-radio">
                    <input
                      type="radio"
                      name={`routeType-${graffiti.id}`}
                      value="walking"
                      checked={tempRouteTypes[graffiti.id] === 'walking'}
                      onChange={() => setTempRouteTypes(prev => ({ ...prev, [graffiti.id]: 'walking' }))}
                    />
                    <span className="fancy-radio-span">Пешком</span>
                  </label>
                  <label className="fancy-radio">
                    <input
                      type="radio"
                      name={`routeType-${graffiti.id}`}
                      value="driving"
                      checked={tempRouteTypes[graffiti.id] === 'driving'}
                      onChange={() => setTempRouteTypes(prev => ({ ...prev, [graffiti.id]: 'driving' }))}
                    />
                    <span className="fancy-radio-span">На машине</span>
                  </label>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {doubleClickPosition && (
          <Marker position={doubleClickPosition} icon={graffitiIcon}>
            <Popup
              position={doubleClickPosition}
              onClose={() => setDoubleClickPosition(null)}
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
                    onClick={() => navigate(`/add-graffiti?coords=${doubleClickPosition[0]},${doubleClickPosition[1]}`)}
                    >
                    Да, на этих координатах
                  </button>
                  <button className="popup-button" onClick={() => setDoubleClickPosition(null)}>
                    Нет
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {segments.length > 0 && segments.map((segment, index) => (
          <Polyline key={index} positions={segment.points} color={segment.color} />
        ))}

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
