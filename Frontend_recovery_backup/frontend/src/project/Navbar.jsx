import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../projectCss/Navbar.css";

const Navbar = () => {
    return (
        <header className="greenbee-header">

            {/* Top Header */}
            <div className="greenbee-topbar">
                <div className="greenbee-topbar-inner">

                    {/* Search Button */}
                    <button
                        className="greenbee-icon-button search-button"
                        aria-label="Search"
                        onClick={() => {
                            window.location.href = "/products";
                        }}
                    >
                        <span className="search-icon">⌕</span>
                    </button>

                    {/* Logo */}
                    <Link to="/" className="greenbee-logo">
                        <span className="logo-leaf">♧</span>
                        GreenBee
                    </Link>

                    {/* Right Side Actions */}
                    <div className="greenbee-actions">

                        <button
                            className="greenbee-icon-button"
                            aria-label="Settings"
                            title="Settings"
                        >
                            ⚙
                        </button>

                        <Link
                            to="/cart"
                            className="greenbee-cart-link"
                            aria-label="My Cart"
                        >
                            <span className="greenbee-cart-icon">🛒</span>
                            <span className="greenbee-cart-count">0</span>
                        </Link>

                        <Link
                            to="/cart"
                            className="greenbee-cart-text"
                        >
                            MY CART
                        </Link>

                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="greenbee-navigation">
                <div className="greenbee-nav-inner">

                    {/* All Categories */}
                    <Link
                        to="/categories"
                        className="greenbee-all-categories"
                    >
                        <span className="category-menu-icon">☰</span>
                        <span>ALL CATEGORIES</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="greenbee-nav-links">

                        <NavLink
                            to="/"
                            end
                            className="greenbee-nav-link"
                        >
                            HOME
                        </NavLink>

                        <NavLink
                            to="/products"
                            className="greenbee-nav-link"
                        >
                            PRODUCTS
                        </NavLink>

                        {/* Add Product Button */}
                        <NavLink
                            to="/add-product"
                            className="greenbee-nav-link greenbee-add-product-link"
                        >
                            + ADD PRODUCT
                        </NavLink>

                        <NavLink
                            to="/categories"
                            className="greenbee-nav-link"
                        >
                            CATEGORIES
                        </NavLink>

                        {/* Pages Dropdown */}
                        <div className="greenbee-dropdown">

                            <button
                                type="button"
                                className="greenbee-nav-link dropdown-trigger"
                            >
                                PAGES <span className="nav-arrow"></span>
                            </button>

                            <div className="greenbee-dropdown-menu">
                                <Link to="/about">
                                    About Us
                                </Link>

                                <Link to="/policy">
                                    Privacy Policy
                                </Link>

                                <Link to="/testimonial">
                                Testimonial Page
                                </Link>

                                <Link to="/contact">
                                    Contact Us
                                </Link>
                            </div>

                        </div>

                        <NavLink
                            to="/blog"
                            className="greenbee-nav-link"
                        >
                            BLOG
                        </NavLink>

                    </div>

                    {/* Social Links */}
                    <div className="greenbee-social-links">

                        <a
                            href="https://facebook.com"
                            aria-label="Facebook"
                            target="_blank"
                            rel="noreferrer"
                        >
                            f
                        </a>

                        <a
                            href="https://twitter.com"
                            aria-label="Twitter"
                            target="_blank"
                            rel="noreferrer"
                        >
                            ♥
                        </a>

                        <a
                            href="https://pinterest.com"
                            aria-label="Pinterest"
                            target="_blank"
                            rel="noreferrer"
                        >
                            p
                        </a>

                        <a
                            href="https://vimeo.com"
                            aria-label="Vimeo"
                            target="_blank"
                            rel="noreferrer"
                        >
                            v
                        </a>

                        <a
                            href="https://instagram.com"
                            aria-label="Instagram"
                            target="_blank"
                            rel="noreferrer"
                        >
                            ◎
                        </a>

                    </div>

                </div>
            </nav>

        </header>
    );
};

export default Navbar;
