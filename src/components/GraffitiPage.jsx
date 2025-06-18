import { useParams, useNavigate } from 'react-router-dom';
import graffitiData from '../data/graffitiData';
import FitPhoto from '/src/components/FitPhoto';

const GraffitiPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const graffiti = graffitiData.find((g) => g.id === id);

  if (!graffiti) {
    return <div className="graffiti-page">Граффити не найдено</div>;
  }

  const handleBuildRoute = (type) => {
    navigate(`/?graffitiId=${graffiti.id}&routeType=${type}`);
  };

  return (
    <div className="app-screen">
      <h1 className="screen-title">{graffiti.name}</h1>
      <p className="graffiti-description">{graffiti.description}</p>
      <h1 className="graffiti-title">Фото</h1>
      <div className="photo-container">
        {graffiti.photos && graffiti.photos.length > 0 ? (
          <a href={graffiti.photos[0]}>
            <FitPhoto
              src={graffiti.photos[0]}
              alt={graffiti.name}
              containerWidth={300}
              containerHeight={300}
            />
          </a>
        ) : (
          <p className="no-photo">Нет фото</p>
        )}
      </div>
      <h1 className="graffiti-title">Как добраться?</h1>
      <div className="route-type-selector fancy-radio-group">
        <label className="fancy-radio">
          <input
            type="radio"
            name="routeType"
            value="walking"
            defaultChecked
          />
          <span className="fancy-radio-span">Пешком</span>
        </label>
        <label className="fancy-radio">
          <input
            type="radio"
            name="routeType"
            value="driving"
          />
          <span className="fancy-radio-span">На машине</span>
        </label>
      </div>
      <button
        className="popup-button"
        onClick={() => handleBuildRoute(document.querySelector('input[name="routeType"]:checked').value)}
      >
        <img src='/icons/route.svg'/>
        Построить маршрут
      </button>
    </div>
  );
};

export default GraffitiPage;
