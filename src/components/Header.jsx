import { Link } from 'react-router-dom';
import settingsIcon from '/icons/options.svg';
import profileIcon from '/icons/profile.svg';

const Header = () => {
  return (
    <header className="header">
      <div className="header-overlay"></div>
      <div className="header-left">
        <span className="header-title">GraFite</span>
      </div>
      <div className="header-right">
        <Link to="/settings" className="header-button">
          <img src={settingsIcon} alt="Settings" className="icon" />
        </Link>
        <Link to="/profile" className="header-button profile">
          <img src={profileIcon} alt="Profile" className="icon" />
        </Link>
      </div>
    </header>
  );
};

export default Header;