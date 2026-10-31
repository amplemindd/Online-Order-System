

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProductForm from "./project/AddProductForm";   // ← make sure the path matches your file
import Submitted from "./project/Submitted";             // we will create this next
import ProductList from "./project/ProductList";
import PrivacyPolicy from "./project/PrivacyPolicy"
import Navbar from "./project/Navbar";
import TestimonialPage from "./project/TestimonialPage";
import Footer from "./project/Footer";
import { CartPage, CheckoutPage } from "./project/CartCheckout";

import "./App.css"

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


function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submitted" element={<Submitted />} />
        <Route path="/products" element ={<ProductList />} /> 
        <Route path="/policy" element={<PrivacyPolicy />} />
        <Route path="/add-product" element={<AddProductForm />}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/testimonial" element={<TestimonialPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
