import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src='/icons/map.svg' alt="Map" className="icon" />
      </NavLink>
      <NavLink to="/all-graffiti" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src='/icons/graffiti_list.svg' alt="Graffiti List" className="icon" />
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src='/icons/report.svg' alt="Report" className="icon" />
      </NavLink>
      <NavLink to="/add-graffiti" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        <img src='/icons/add_new.svg' alt="Add Graffiti" className="icon" />
      </NavLink>
    </nav>
  );
};

export default Nav;
