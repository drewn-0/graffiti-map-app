import { NavLink } from 'react-router-dom';
import mapIcon from '../public/icons/map.svg';
import graffitiListIcon from '../public/icons/graffiti_list.svg';
import reportIcon from '../public/icons/report.svg';
import addNewIcon from '../public/icons/add_new.svg';

const Nav = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src={mapIcon} alt="Map" className="icon" />
      </NavLink>
      <NavLink to="/all-graffiti" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src={graffitiListIcon} alt="Graffiti List" className="icon" />
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src={reportIcon} alt="Report" className="icon" />
      </NavLink>
      <NavLink to="/add-graffiti" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src={addNewIcon} alt="Add Graffiti" className="icon" />
      </NavLink>
    </nav>
  );
};

export default Nav;
