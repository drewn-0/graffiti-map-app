const SettingsScreen = () => {
  const applyFontSize = (value) => {
    document.querySelectorAll('.app-screen, .graffiti-description, .graffiti-title, .screen-title')
      .forEach(el => el.style.fontSize = `${value}px`);
  };

  return (
    <div className="app-screen">
      <h2 className="screen-title">Настройки</h2>
      <div className="convenience">
        <label>
          <h2 className="screen-title">Цвет интерфейса:</h2>
          <input
            className="app-color"
            type="color" 
            onChange={(e) => document.body.style.backgroundColor = e.target.value}
          />
        </label>
        <label>
          <h2 className="screen-title">Размер шрифта:</h2>
          <input
            className="app-font-size"
            type="range"
            min="12"
            max="40"
            defaultValue="20"
            onChange={e => applyFontSize(e.target.value)}
          />
        </label>
        <button
          className="popup-button"
          onClick={() => {
            document.body.classList.toggle('dark-theme');
          }}
        >
          Переключить тему
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;