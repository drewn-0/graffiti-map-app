import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AddGraffitiScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    coordinatesInput: '',
    coordinates: ['',''],
    description: '',
    author: ''
  });

  const [coordError, setCoordError] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const handleCoordinatesChange = (e) => {
    const input = e.target.value;
    const parts = input.split(',').map((part) => part.trim());

    if (
      parts.length === 2 &&
      !isNaN(parseFloat(parts[0])) &&
      !isNaN(parseFloat(parts[1]))
    ) {
      setFormData((prev) => ({
        ...prev,
        coordinatesInput: input,
        coordinates: [parseFloat(parts[0]), parseFloat(parts[1])],
      }));
      setCoordError('');
    } else {
      setFormData((prev) => ({
        ...prev,
        coordinatesInput: input,
        coordinates: ['', ''],
      }));
      setCoordError('Введите координаты в формате "12.3456, 12.3456"');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (coordError || formData.coordinates.includes('')) {
      alert('Пожалуйста, введите корректные координаты.');
      return;
    }

    setFormData({
      name: '',
      coordinatesInput: '',
      coordinates: ['', ''],
      description: '',
      author: ''
    });
    setCoordError('');
    alert('Обращение отправлено!');
  };

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const coords = params.get('coords');
    if (coords) {
      const [lat, lng] = coords.split(',').map(parseFloat);
      if (!isNaN(lat) && !isNaN(lng)) {
        const coordString = `${lat}, ${lng}`;
        setFormData((prev) => ({
          ...prev,
          coordinatesInput: coordString,
          coordinates: [lat, lng],
        }));
      }
    }
  }, [location.search]);

  return (
    <div className="app-screen">
      <h2 className="screen-title">Добавить граффити</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <label className="form-label">
          <div className="form-title">Название</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Название граффити"
            className="form-input"
          />
        </label>

        <label className="form-label">
          <div className="form-title">Введите координаты места</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={formData.coordinatesInput}
              onChange={handleCoordinatesChange}
              placeholder='На карте можно выбрать место долгим нажатием'
              className="form-input"
              style={{ flex: 1 }}
            />
          </div>
          {coordError && <div style={{ color: 'red', fontSize: '20px' }}>{coordError}</div>}
        </label>

        <label className="form-label">
          <div className="form-title">Описание</div>
          <input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Описание граффити и места"
            className="form-input"
          />
        </label>

        <label className="form-label">
          <div className="form-title">Автор граффити</div>
          <input
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Введите псевдоним или соц сети автора"
            className="form-input"
          />
        </label>

        <label className="form-label">
          <div className="form-title">Фото граффити</div>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPhotoFile(e.target.files?.[0])}
            className="form-input"
          />
        </label>

        <button type="submit" className="submit-button">
          Добавить граффити
        </button>
      </form>
    </div>
  );
};

export default AddGraffitiScreen;