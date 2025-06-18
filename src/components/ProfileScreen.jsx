import defaultAvatar from '/pictures/default_avatar.png';
const ProfileScreen = () => (
  <div className="app-screen">
    <h2 className="screen-title">Профиль пользователя</h2>
    <div className="convenience">
      <img
        src={defaultAvatar}
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

      <div className="engagement">
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

export default ProfileScreen;