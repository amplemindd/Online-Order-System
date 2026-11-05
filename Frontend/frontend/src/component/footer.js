import React from "react";
import { Link } from "react-router-dom";
import '../css/footer.css'
import logo5 from '../images/logo.png'

function Footer() {
  return (
    <footer className="footer">

      <div className="newsletter">
        <h2>Subscribe To Our Newsletter For Latest Updates</h2>
        <div className="newsletter-form">
          <input type="email" placeholder="Email Address..." />
          <button type="button">Subscribe →</button>
        </div>
      </div>

      <div className="footer-content">

        <div className="footer-col brand">
          <div className="footer-logo">
            <span className="logo-icon"><img src={logo5} alt=""/></span>
    
            
          </div>

          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <p>1800-121-3637</p>
              <p>+91 555 234-8765</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div>
              <p>info@example.com</p>
              <p>sale@example.com</p>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h3>Our Links</h3>
          <ul>
            <li><Link to="/">Partners</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/">Career</Link></li>
            <li><Link to="/">Reviews</Link></li>
            <li><Link to="/">Terms & Conditions</Link></li>
            <li><Link to="/">Help</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Other Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/">Project</Link></li>
            <li><Link to="/">Our Team</Link></li>
            <li><Link to="/blog">Latest Blog</Link></li>
          </ul>
        </div>

        
        <div className="footer-col about">
          <p>
            Fusce orci ligula, tincidunt ut metus vel, venenatis aliquet tortor. 
            Duis et consequat enim. Curabitur pulvinar, dolor at pulvinar molestie, 
            augue massa volutpat felis, at rhoncus tortor velit vel diam. Cras ac 
            suscipit metus. Cras vitae quam eget risus efficitur malesuada. 
            Praesent condimentum lacus nisi, eu venenatis purus eleifend sit amet.
          </p>

          <div className="social-icons">
            <a href="#">f</a>
            <a href="#">𝕏</a>
            <a href="#">📷</a>
            <a href="#">G+</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;