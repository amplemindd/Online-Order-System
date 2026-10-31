import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CartCheckout.css";

const API_URL = "http://localhost:5000";

const getSavedCart = () => {
    try {
        return JSON.parse(localStorage.getItem("greenbee_cart")) || [];
    } catch {
        return [];
    }
};

const money = (amount) => `$${Number(amount || 0).toFixed(2)}`;

const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://") ||
        imagePath.startsWith("data:")
    ) {
        return imagePath;
    }

    return `${API_URL}/${imagePath.replace(/^\/+/, "")}`;
};

const saveCart = (cart) => {
    localStorage.setItem("greenbee_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("greenbee-cart-updated"));
};

// ==================== CART PAGE ====================

export const CartPage = () => {
    const [cart, setCart] = useState(getSavedCart);

    useEffect(() => {
        const syncCart = () => setCart(getSavedCart());

        window.addEventListener("greenbee-cart-updated", syncCart);
        window.addEventListener("storage", syncCart);

        return () => {
            window.removeEventListener("greenbee-cart-updated", syncCart);
            window.removeEventListener("storage", syncCart);
        };
    }, []);

    const updateQuantity = (index, amount) => {
        const updated = [...cart];

        updated[index] = {
            ...updated[index],
            quantity: Math.max(
                1,
                Number(updated[index].quantity) + amount
            ),
        };

        setCart(updated);
        saveCart(updated);
    };

    const removeItem = (index) => {
        const updated = cart.filter((_, i) => i !== index);

        setCart(updated);
        saveCart(updated);
    };

    const subtotal = cart.reduce(
        (total, item) =>
            total + Number(item.price) * Number(item.quantity),
        0
    );

    return (
        <main className="gb-cart-page">
            <div className="gb-cart-heading">
                <h1>My Cart</h1>
                <Link to="/products">Continue shopping</Link>
            </div>

            {cart.length === 0 ? (
                <div className="gb-empty-cart">
                    <div className="gb-empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started.</p>

                    <Link
                        to="/products"
                        className="gb-primary-button"
                    >
                        EXPLORE PRODUCTS
                    </Link>
                </div>
            ) : (
                <div className="gb-cart-layout">
                    <section className="gb-cart-items">
                        {cart.map((item, index) => (
                            <article
                                className="gb-cart-item"
                                key={`${item.id}-${item.size}-${item.color}`}
                            >
                                <img
                                    src={getImageUrl(item.image_path)}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.currentTarget.style.visibility =
                                            "hidden";
                                    }}
                                />

                                <div className="gb-cart-item-info">
                                    <h3>{item.name}</h3>

                                    <p>
                                        {item.size} / {item.color}
                                    </p>

                                    <strong>{money(item.price)}</strong>

                                    <div className="gb-cart-quantity">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(index, -1)
                                            }
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(index, 1)
                                            }
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        className="gb-remove-item"
                                        type="button"
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <strong className="gb-cart-line-total">
                                    {money(
                                        Number(item.price) *
                                            Number(item.quantity)
                                    )}
                                </strong>
                            </article>
                        ))}
                    </section>

                    <aside className="gb-cart-summary">
                        <h2>Order Summary</h2>

                        <div className="gb-summary-row">
                            <span>Subtotal</span>
                            <strong>{money(subtotal)}</strong>
                        </div>

                        <div className="gb-summary-row">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div className="gb-summary-total">
                            <span>Total</span>
                            <strong>{money(subtotal)}</strong>
                        </div>

                        <Link
                            to="/checkout"
                            className="gb-primary-button gb-full-button"
                        >
                            PROCEED TO CHECKOUT
                        </Link>

                        <Link
                            to="/products"
                            className="gb-continue-link"
                        >
                            Continue shopping
                        </Link>
                    </aside>
                </div>
            )}
        </main>
    );
};

// ==================== CHECKOUT PAGE ====================

export const CheckoutPage = () => {
    const [cart, setCart] = useState(getSavedCart);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        email: "",
        news: false,
        country: "India",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        state: "Maharashtra",
        postalCode: "",
        phone: "",
        saveInfo: false,
    });

    useEffect(() => {
        const syncCart = () => setCart(getSavedCart());

        window.addEventListener("greenbee-cart-updated", syncCart);
        window.addEventListener("storage", syncCart);

        return () => {
            window.removeEventListener(
                "greenbee-cart-updated",
                syncCart
            );

            window.removeEventListener("storage", syncCart);
        };
    }, []);

    const subtotal = cart.reduce(
        (total, item) =>
            total + Number(item.price) * Number(item.quantity),
        0
    );

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (cart.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        setSubmitting(true);

        try {
            const order = {
                customer: {
                    email: form.email,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    address: form.address,
                    apartment: form.apartment,
                    city: form.city,
                    state: form.state,
                    postalCode: form.postalCode,
                    country: form.country,
                    phone: form.phone,
                },

                items: cart,
                subtotal: Number(subtotal.toFixed(2)),
            };

            localStorage.setItem(
                "greenbee_checkout_draft",
                JSON.stringify(order)
            );

            setMessage(
                "Details validated. MySQL order saving/payment is not connected yet."
            );
        } catch (error) {
            console.error("Checkout error:", error);

            setMessage(
                "Unable to prepare your order. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <main className="gb-checkout-empty">
                <h2>Your cart is empty</h2>

                <Link
                    to="/products"
                    className="gb-primary-button"
                >
                    EXPLORE PRODUCTS
                </Link>
            </main>
        );
    }

    return (
        <main className="gb-checkout-page">
            <section className="gb-checkout-form-side">
                <div className="gb-checkout-form-inner">
                    <Link to="/" className="gb-checkout-brand">
                        GreenBee
                    </Link>

                    <div className="gb-checkout-breadcrumb">
                        <Link to="/cart">Cart</Link>
                        <span>›</span>
                        <strong>Information</strong>
                        <span>›</span>
                        <span>Shipping</span>
                        <span>›</span>
                        <span>Payment</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="gb-checkout-section-heading">
                            <h2>Contact</h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setMessage(
                                        "Sign-in is not configured yet."
                                    )
                                }
                            >
                                Sign in
                            </button>
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email or mobile phone number"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <label className="gb-checkbox-row">
                            <input
                                type="checkbox"
                                name="news"
                                checked={form.news}
                                onChange={handleChange}
                            />

                            Email me with news and offers
                        </label>

                        <h2 className="gb-checkout-section-title">
                            Delivery
                        </h2>

                        <label className="gb-floating-field">
                            <span>Country/Region</span>

                            <select
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                            >
                                <option>India</option>
                                <option>United States</option>
                                <option>United Kingdom</option>
                                <option>Canada</option>
                            </select>
                        </label>

                        <div className="gb-checkout-two-columns">
                            <input
                                name="firstName"
                                placeholder="First name (optional)"
                                value={form.firstName}
                                onChange={handleChange}
                            />

                            <input
                                name="lastName"
                                placeholder="Last name"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <input
                            name="address"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="apartment"
                            placeholder="Apartment, suite, etc. (optional)"
                            value={form.apartment}
                            onChange={handleChange}
                        />

                        <div className="gb-checkout-three-columns">
                            <input
                                name="city"
                                placeholder="City"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />

                            <label className="gb-floating-field">
                                <span>State</span>

                                <select
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    required
                                >
                                    <option>Maharashtra</option>
                                    <option>Madhya Pradesh</option>
                                    <option>Gujarat</option>
                                    <option>Karnataka</option>
                                    <option>Delhi</option>
                                    <option>Rajasthan</option>
                                    <option>Uttar Pradesh</option>
                                    <option>Other</option>
                                </select>
                            </label>

                            <input
                                name="postalCode"
                                placeholder="PIN code"
                                value={form.postalCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone (optional)"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <label className="gb-checkbox-row">
                            <input
                                type="checkbox"
                                name="saveInfo"
                                checked={form.saveInfo}
                                onChange={handleChange}
                            />

                            Save this information for next time
                        </label>

                        <h3 className="gb-shipping-heading">
                            Shipping method
                        </h3>

                        <div className="gb-shipping-notice">
                            Enter your shipping address to view available
                            shipping methods.
                        </div>

                        {message && (
                            <p
                                className="gb-checkout-message"
                                role="status"
                            >
                                {message}
                            </p>
                        )}

                        <div className="gb-checkout-bottom">
                            <Link to="/cart">
                                ← Return to cart
                            </Link>

                            <button
                                className="gb-primary-button"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "PROCESSING..."
                                    : "CONTINUE"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <aside className="gb-checkout-summary-side">
                <div className="gb-checkout-summary-inner">
                    {cart.map((item, index) => (
                        <div
                            className="gb-checkout-product"
                            key={`${item.id}-${item.size}-${item.color}-${index}`}
                        >
                            <div className="gb-checkout-image-wrap">
                                <img
                                    src={getImageUrl(item.image_path)}
                                    alt={item.name}
                                />

                                <span>{item.quantity}</span>
                            </div>

                            <div className="gb-checkout-product-details">
                                <p>{item.name}</p>

                                <span>
                                    {item.size} / {item.color}
                                </span>
                            </div>

                            <strong>
                                {money(
                                    Number(item.price) *
                                        Number(item.quantity)
                                )}
                            </strong>
                        </div>
                    ))}

                    <div className="gb-checkout-summary-row">
                        <span>
                            Subtotal ·{" "}
                            {cart.reduce(
                                (sum, item) =>
                                    sum + Number(item.quantity),
                                0
                            )}{" "}
                            items
                        </span>

                        <span>{money(subtotal)}</span>
                    </div>

                    <div className="gb-checkout-summary-row">
                        <span>Shipping</span>
                        <span>Enter shipping address</span>
                    </div>

                    <div className="gb-checkout-grand-total">
                        <strong>Total</strong>

                        <div>
                            <span>USD</span>
                            <strong>{money(subtotal)}</strong>
                        </div>
                    </div>
                </div>
            </aside>
        </main>
    );
};