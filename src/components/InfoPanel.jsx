import { useState, useEffect } from 'react';
import graffitiData from '../data/graffitiData';
import { Link, useNavigate } from 'react-router-dom';
import FitPhoto from '/src/components/FitPhoto';


const normalizeText = (text) => {
  return text.toLowerCase().replace(/ё/g, 'е');
};

const InfoPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = normalizeText(searchQuery);
    const results = graffitiData
      .filter(
        (graffiti) =>
          normalizeText(graffiti.name).includes(normalizedQuery) ||
          normalizeText(graffiti.description).includes(normalizedQuery) ||
          normalizeText(graffiti.author).includes(normalizedQuery)
      )
      .slice(0, 10);
    setSearchResults(results);
  }, [searchQuery]);

  const handleBuildRoute = (graffiti) => {
    setVisible(false);
    navigate(`/?graffitiId=${graffiti.id}&routeType=walking`);
  };

  const handleShowOnMap = (graffiti) => {
    setVisible(false);
    navigate(`/?highlightId=${graffiti.id}`);
  };

  return (
    <>
      {visible ? (
        <div className="info-panel">
          <div className="button-container">
            <button
              className="popup-button hide"
              onClick={() => setVisible(false)}
            >▼</button>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Поиск граффити..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {searchQuery.trim() !== '' ? (
            searchResults.length > 0 ? (
              <div className="search-results">
                {searchResults.map((g) => (
                  <div key={g.id} className="search-result" style={{ padding: 12 }}>
                    <Link 
                      to={`/graffiti/${g.id}`} 
                      className="card-link" 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="photo-container in-list">
                        {g.photos && g.photos.length > 0 ? (
                          <FitPhoto
                            src={g.photos[0]}
                            alt={g.name}
                            containerWidth={100}
                            containerHeight={100}
                          />
                        ) : (
                          <p className="graffiti-title">Нет фото</p>
                        )}
                      </div>
                      <div className="graffiti-info">
                        <h3 className="graffiti-title">{g.name}</h3>
                        <p className="graffiti-description">{g.description}</p>
                      </div>
                    </Link>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button className="popup-button" onClick={() => handleBuildRoute(g)}>
                        <img src={'/icons/route.svg'} />
                        Построить маршрут
                      </button>
                      <button className="popup-button" onClick={() => handleShowOnMap(g)}>
                        Показать на карте
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="error-text">Ничего не найдено</p>
            )
          ) : null}
        </div>
      ) : (
        <div className="button-container">
          <button
            className="popup-button show"
            onClick={() => setVisible(true)}
          >
            ▲
          </button>
        </div>
      )}
    </>
  );
};

export default InfoPanel;
