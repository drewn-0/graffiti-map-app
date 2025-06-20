import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import graffitiData from '../data/graffitiData';

const ProfileScreen = () => {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
    setSavedRoutes(saved);
  }, []);

  const handleOpenRoute = (route) => {
    const ids = route.points.map(p => p.id).join(',');
    const type = route.points[0]?.routeType || 'walking';
    navigate(`/?graffitiId=${ids}&routeType=${type}`);
  };

  const handleDelete = id => {
    const filtered = savedRoutes.filter(r => r.id !== id);
    setSavedRoutes(filtered);
    localStorage.setItem('savedRoutes', JSON.stringify(filtered));
  };

  return (
    <div className="app-screen">
      <h2 className="screen-title">Профиль пользователя</h2>
      <div className="convenience">
        <img
          src='/pictures/default_avatar.png'
          alt="Profile"
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '3px solid #444',
            objectFit: 'cover'
          }}
        />
        <h3 className="screen-title">default_profile</h3>
        
        <div className="saved-routes">
          <h3>Сохранённые маршруты</h3>
          {savedRoutes.length === 0 ? (
            <p>Нет сохранённых маршрутов</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {savedRoutes.map(route => (
                <li key={route.id} 
                  className="engagement" style={{marginBottom: 12}}>
                  <h4 className="graffiti-title" style={{ marginTop:0, marginBottom: 4}}>
                    Маршрут от {new Date(route.createdAt).toLocaleString()}
                  </h4>
                  <div style={{ fontSize: 14 }}>
                    {route.points.map(p => {
                      const g = graffitiData.find(g => g.id === p.id);
                      return <span className="graffiti-description" key={p.id}>{g ? g.name : p.id}</span>;
                    }).reduce((prev, curr) => [prev, ' → ', curr])}
                  </div>
                  <button
                    className="popup-button"
                    style={{ marginTop: 8, marginRight: 8}}
                    onClick={() => handleOpenRoute(route)}
                  >
                    Открыть маршрут
                  </button>
                  <button className="popup-button"
                    style={{ marginTop: 8 }}
                    onClick={() => handleDelete(route.id)}>
                    Удалить</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="engagement" >
          <h4>Уровень: Новичок</h4>
          <p>Посещено мест: 3</p>
        </div>

        <div className="engagement">
          <h4>🏆 Достижения</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 18 }}>
            <li>• Добавил 5 граффити</li>
            <li>• Первый маршрут построен</li>
            <li>• Посещено первое место</li>
          </ul>
          <button className="submit-button">Открыть все достижения</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
