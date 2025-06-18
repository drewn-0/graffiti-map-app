import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from './components/Map';
import InfoPanel from './components/InfoPanel';
import NavBar from './components/NavBar';
import GraffitiListScreen from './components/GraffitiListScreen';
import GraffitiPage from './components/GraffitiPage';
import ReportScreen from './components/ReportScreen';
import AddGraffitiScreen from './components/AddGraffitiScreen';
import SettingsScreen from './components/SettingsScreen';
import ProfileScreen from './components/ProfileScreen';
import Header from './components/Header';
import './styles.css';

const App = () => {
  const [routeType, setRouteType] = useState('walking');
  const [userLocation, setUserLocation] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);

  const handleRequestLocation = () => {
    setLocationRequested(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Геолокация не доступна или отказана:', error.message);
          // fallback — Екатеринбург
          setUserLocation([56.838129, 60.597228]);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      // если API нет — сразу ставим центр
      setUserLocation([56.838129, 60.597228]);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {!locationRequested && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <button
              onClick={handleRequestLocation}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Поделиться моим местоположением
            </button>
          </div>
        )}

        {locationRequested && userLocation === null && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Загрузка карты и локации...
          </div>
        )}
        {userLocation && (
          <Routes>
            <Route
              index
              element={
                <>
                  <Map routeType={routeType} userLocation={userLocation} />
                  <InfoPanel />
                </>
              }
            />
            <Route path="/all-graffiti" element={<GraffitiListScreen />} />
            <Route path="/graffiti/:id" element={<GraffitiPage />} />
            <Route path="/report" element={<ReportScreen />} />
            <Route path="/add-graffiti" element={<AddGraffitiScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default App;
