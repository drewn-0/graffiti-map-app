import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import graffitiData from '../data/graffitiData';

const normalizeText = (text) => {
  return text.toLowerCase().replace(/ё/g, 'е');
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const ReportScreen = () => {
  const [fullName, setFullName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGraffiti, setSelectedGraffiti] = useState(null);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [filteredGraffiti, setFilteredGraffiti] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const normalizedQuery = normalizeText(query);
      const results = graffitiData
        .filter(
          (g) =>
            normalizeText(g.name).includes(normalizedQuery) ||
            normalizeText(g.description).includes(normalizedQuery)
        )
        .slice(0, 5);
      setFilteredGraffiti(results);
    } else {
      setFilteredGraffiti([]);
    }
  };

  const selectGraffiti = (graffiti) => {
    setSelectedGraffiti(graffiti);
    setSearchQuery(graffiti.name);
    setFilteredGraffiti([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Report submitted:', { fullName, graffiti: selectedGraffiti?.name, reason, details });
    alert('Обращение отправлено!');
  };

  return (
    <div className="app-screen">
      <h2 className="screen-title">Сообщить о нарушении</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label className="form-label">
          <div className="form-title">ФИО автора заявления</div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Иванов Иван Иванович"
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          <div className="form-title">Название граффити</div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Поиск граффити..."
            className="form-input"
          />
          {filteredGraffiti.length > 0 && (
            <div className="search-results">
              {filteredGraffiti.map((graffiti) => (
                <div
                  key={graffiti.id}
                  className="option-item"
                  onClick={() => selectGraffiti(graffiti)}
                >
                  <div className="graffiti-title">{graffiti.name}</div>
                  <div className="graffiti-description">
                    {truncateText(graffiti.description, 50)}
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedGraffiti && (
            <p className="selected-graffiti">Выбрано: {selectedGraffiti.name}</p>
          )}
        </label>
        <label className="form-label">
          <div className="form-title">Причина жалобы</div>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-select"
            required
          >
            <option value="" disabled>
              <div className="form-title">Выберите причину</div>
            </option>
            <option value="Вандализм">Вандализм</option>
            <option value="Непристойное содержание">Непристойное содержание</option>
            <option value="Другое">Другое</option>
          </select>
        </label>
        <label className="form-label">
          <div className="form-title">Подробности жалобы</div>
          <input
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Опишите детали..."
            className="form-input"
            required
          />
        </label>
        <button type="submit" className="submit-button">
          Отправить обращение
        </button>
      </form>
    </div>
  );
};

export default ReportScreen;