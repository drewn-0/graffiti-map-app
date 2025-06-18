import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-overlay"></div>
      <div className="header-left">
        <span className="header-title">GraFite</span>
      </div>
      <div className="header-right">
        <Link to="/settings" className="header-button">
          <img src='/icons/options.svg' alt="Settings" className="icon" />
        </Link>
        <Link to="/profile" className="header-button profile">
          <img src='/icons/profile.svg' alt="Profile" className="icon" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
