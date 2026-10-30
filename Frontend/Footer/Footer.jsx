import { Phone, Mail, MapPin, Clock } from "lucide-react";
import "./Footer.css";

const columns = [
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "#contact" },
      { label: "Help and Advice", href: "#help" },
      { label: "Shipping & Returns", href: "#shipping" },
      { label: "Terms and Conditions", href: "#terms" },
      { label: "Refund Policy", href: "#refund" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "My Account", href: "#account" },
      { label: "Payments & Returns", href: "#payments" },
      { label: "Catalogues Online", href: "#catalogues" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Who We Are?", href: "#who-we-are" },
      { label: "Corporate Responsibility", href: "#responsibility" },
      { label: "California Laws", href: "#california" },
      { label: "Careers", href: "#careers" },
      { label: "Privacy Policy", href: "#privacy" },
    ],
  },
];

const contact = [
  { Icon: Phone, text: "Phone (+612) 2531 5600", href: "tel:+61225315600" },
  { Icon: Mail, text: "greenbee@domain.com", href: "mailto:greenbee@domain.com" },
  { Icon: MapPin, text: "PO Box 1622 Vissasoang Street West", href: "#location" },
  { Icon: Clock, text: "Opening Hours: 8:00 AM–9:00 PM" },
];

const payments = [
  {
    name: "Visa",
    svg: (
      <text x="30" y="21" textAnchor="middle" fontSize="15" fontWeight="800" fontStyle="italic" fill="#1a1f71" fontFamily="Arial, sans-serif">
        VISA
      </text>
    ),
  },
  {
    name: "Mastercard",
    svg: (
      <>
        <circle cx="23" cy="16" r="9" fill="#eb001b" />
        <circle cx="37" cy="16" r="9" fill="#f79e1b" fillOpacity="0.9" />
      </>
    ),
  },
  {
    name: "PayPal",
    svg: (
      <text x="30" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fontStyle="italic" fontFamily="Arial, sans-serif">
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009cde">Pal</tspan>
      </text>
    ),
  },
  {
    name: "American Express",
    svg: (
      <>
        <rect x="1" y="1" width="58" height="30" rx="3" fill="#2e77bc" />
        <text x="30" y="21" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">
          AMEX
        </text>
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {columns.map(({ title, links }) => (
            <nav className="footer__col" key={title} aria-label={title}>
              <h4 className="footer__heading">{title}</h4>
              <ul className="footer__list">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a className="footer__link" href={href}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col">
            <h4 className="footer__heading">Contact Us</h4>
            <ul className="footer__list">
              {contact.map(({ Icon, text, href }) => (
                <li className="footer__contact" key={text}>
                  <Icon className="footer__icon" size={16} strokeWidth={2} aria-hidden="true" />
                  {href ? (
                    <a className="footer__link" href={href}>
                      {text}
                    </a>
                  ) : (
                    <span className="footer__text">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            Copyright © {new Date().getFullYear() > 2026 ? new Date().getFullYear() : 2026}{" "}
            <a href="#home">YourCompany</a>. All rights reserved.
          </p>
          <ul className="footer__payments" aria-label="Accepted payment methods">
            {payments.map(({ name, svg }) => (
              <li key={name}>
                <svg viewBox="0 0 60 32" role="img" aria-label={name} className="footer__card">
                  <title>{name}</title>
                  <rect x="0.5" y="0.5" width="59" height="31" rx="3.5" fill="#fff" stroke="#d9d9d9" />
                  {name === "American Express" && <rect x="1" y="1" width="58" height="30" rx="3" fill="#2e77bc" />}
                  {svg}
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
