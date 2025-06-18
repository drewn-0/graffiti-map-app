import { useState } from 'react';
import { Link } from 'react-router-dom';
import graffitiData from '../data/graffitiData';
import FitPhoto from '/src/components/FitPhoto';

const normalizeText = (text) => {
  return text.toLowerCase().replace(/ё/g, 'е');
};

const GraffitiListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGraffiti, setFilteredGraffiti] = useState(graffitiData);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const normalizedQuery = normalizeText(query);
      const results = graffitiData
        .filter(
          (g) =>
            normalizeText(g.name).includes(normalizedQuery) ||
            normalizeText(g.description).includes(normalizedQuery) ||
            normalizeText(g.author).includes(normalizedQuery)
        )
        .slice(0, 10);
      setFilteredGraffiti(results);
    } else {
      setFilteredGraffiti(graffitiData);
    }
  };

  return (
    <div className="app-screen">
      <h2 className="screen-title">Все граффити</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Поиск граффити..."
        className="search-input"
      />
      <div className="search-results">
        {filteredGraffiti.length > 0 ? (
          filteredGraffiti.map((g) => (
            <div key={g.id}>
              <Link to={`/graffiti/${g.id}`} key={g.id} className="search-result with-photo">
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
              <Link 
                to={`/?highlightId=${g.id}`} 
                className="popup-button"
                style={{marginTop: '10px'}}>
                Показать на карте
              </Link>
            </div>
          ))
        ) : (
          <p className="error-text">Ничего не найдено</p>
        )}
      </div>
    </div>
  );
};

export default GraffitiListScreen;
