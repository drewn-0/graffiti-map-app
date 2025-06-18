import { NavLink } from 'react-router-dom';
import mapIcon from '/icons/map.svg';
import graffitiListIcon from '/icons/graffiti_list.svg';
import reportIcon from '/icons/report.svg';
import addNewIcon from '/icons/add_new.svg';

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