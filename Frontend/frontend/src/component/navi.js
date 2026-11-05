

import { Link } from "react-router-dom";
import '../css/navi.css'
import logo1 from '../images/logo.png'

function Navi() {
  return (
    <nav className="navbar">
      <div className="nav-container">
    
        <Link to="/" className="logo">
          <span className="logo-icon"><img src={logo1} alt=""/></span>
        </Link>

        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/aboutus">About Us</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/otherpages">Other Pages</Link></li>
          <li><Link to="/classes">Classes</Link></li>
        </ul>

        <button className="join-btn">Join Now</button>
      </div>
    </nav>
  );
}

export default Navi;