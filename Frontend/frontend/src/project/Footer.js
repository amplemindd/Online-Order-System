import React from "react";
import "../projectCss/Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Customer Service */}
        <div className="footer-column">
          <h4>CUSTOMER SERVICE</h4>

          <ul>
            <li><a href="/contact">Contact us</a></li>
            <li><a href="/help">Help and advice</a></li>
            <li><a href="/shipping">Shipping &amp; Returns</a></li>
            <li><a href="/terms">Terms and conditions</a></li>
            <li><a href="/refund">Refund Policy</a></li>
          </ul>
        </div>

        {/* Information */}
        <div className="footer-column">
          <h4>INFORMATION</h4>

          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/testimonials">Testimonials</a></li>
            <li><a href="/account">My Account</a></li>
            <li><a href="/payments">Payments &amp; Returns</a></li>
            <li><a href="/catalogues">Catalogues Online</a></li>
          </ul>
        </div>

        {/* About Us */}
        <div className="footer-column">
          <h4>ABOUT US</h4>

          <ul>
            <li><a href="/who-we-are">Who We Are ?</a></li>
            <li><a href="/responsibility">Corporate Responsibility</a></li>
            <li><a href="/california-laws">California Laws</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="footer-column footer-contact">
          <h4>CONTACT US</h4>

          <ul>
            <li>
              <span className="contact-icon">♧</span>
              <a href="tel:+61225315600">(+612) 2531 5600</a>
            </li>

            <li>
              <span className="contact-icon">✉</span>
              <a href="mailto:greenbee@domain.com">
                greenbee@domain.com
              </a>
            </li>

            <li>
              <span className="contact-icon">♧</span>
              <span>PO Box 1622 Vissasoang Street West</span>
            </li>

            <li>
              <span className="contact-icon">◷</span>
              <span>Opening Hours : 8.00AM - 21.00AM</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">

          <p className="copyright">
            Copyright © 2020 Vinovathemes. All rights reserved.
          </p>

          <div className="payment-methods">
            <span className="payment-logo amex">AMERICAN<br />EXPRESS</span>
            <span className="payment-logo mastercard">Mastercard</span>
            <span className="payment-logo visa">VISA</span>
            <span className="payment-logo paypal">PayPal</span>
            <span className="payment-logo dbs">▰ DBS</span>
          </div>

        </div>
      </div>

      {/* Back to Top */}
      <button
        type="button"
        className="back-to-top"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ⌃
      </button>
    </footer>
  );
};

export default Footer;