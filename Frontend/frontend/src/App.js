
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import AddProductForm from "./project/AddProductForm";
import Submitted from "./project/Submitted";
import ProductList from "./project/ProductList";
import PrivacyPolicy from "./project/PrivacyPolicy";
import Navbar from "./project/Navbar";
import TestimonialPage from "./project/TestimonialPage";
import Footer from "./project/Footer";
import { CartPage, CheckoutPage } from "./project/CartCheckout";
import Register from "./project/Register";
import Login from "./project/Login";
import { AuthProvider } from "./project/AuthContext";
import MyAccount from "./project/MyAccount";
import AdminDashboard from "./project/AdminDashboard";

import "./App.css";

const Home = () => (
    <main className="page-container">
        <section className="home-hero">
            <p className="home-subtitle">WELCOME TO GREENBEE</p>
            <h1>Fresh Choices, Better Living.</h1>
            <p>
                Discover our products and find something you love.
            </p>

            <a href="/products" className="home-button">
                EXPLORE PRODUCTS
            </a>
        </section>
    </main>
);

function AppContent() {
    const location = useLocation();

    // Hide the main website Navbar and Footer on admin pages
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPage && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/submitted" element={<Submitted />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/policy" element={<PrivacyPolicy />} />
                <Route path="/add-product" element={<AddProductForm />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/testimonial" element={<TestimonialPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<MyAccount />} />
            </Routes>

            {!isAdminPage && <Footer />}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
