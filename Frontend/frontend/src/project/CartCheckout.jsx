import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./CartCheckout.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getSavedCart = () => {
  try {
    return JSON.parse(localStorage.getItem("greenbee_cart")) || [];
  } catch {
    return [];
  }
};

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (/^(https?:|data:)/i.test(imagePath)) return imagePath;
  return `${API_URL}/${String(imagePath).replace(/^\/+/, "")}`;
};

const saveCart = (cart) => {
  localStorage.setItem("greenbee_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("greenbee-cart-updated"));
};

async function apiRequest(path, token, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const CartPage = () => {
  const [cart, setCart] = useState(getSavedCart);

  useEffect(() => {
    const sync = () => setCart(getSavedCart());
    window.addEventListener("greenbee-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("greenbee-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const updateQuantity = (index, amount) => {
    const updated = [...cart];
    updated[index] = {
      ...updated[index],
      quantity: Math.max(1, Number(updated[index].quantity) + amount),
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
    (sum, item) => sum + Number(item.price) * Number(item.quantity), 0
  );

  return (
    <main className="gb-cart-page">
      <div className="gb-cart-heading">
        <h1>My Cart</h1>
        <Link to="/products">Continue shopping</Link>
      </div>
      {!cart.length ? (
        <div className="gb-empty-cart">
          <div className="gb-empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started.</p>
          <Link to="/products" className="gb-primary-button">EXPLORE PRODUCTS</Link>
        </div>
      ) : (
        <div className="gb-cart-layout">
          <section className="gb-cart-items">
            {cart.map((item, index) => (
              <article className="gb-cart-item" key={`${item.id}-${item.size}-${item.color}-${index}`}>
                <img src={getImageUrl(item.image_path)} alt={item.name}
                  onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                <div className="gb-cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.size || "Standard"} / {item.color || "Default"}</p>
                  <strong>{money(item.price)}</strong>
                  <div className="gb-cart-quantity">
                    <button type="button" onClick={() => updateQuantity(index, -1)} aria-label="Decrease quantity">−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(index, 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="gb-remove-item" type="button" onClick={() => removeItem(index)}>Remove</button>
                </div>
                <strong className="gb-cart-line-total">{money(Number(item.price) * Number(item.quantity))}</strong>
              </article>
            ))}
          </section>
          <aside className="gb-cart-summary">
            <h2>Order Summary</h2>
            <div className="gb-summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div className="gb-summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
            <div className="gb-summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div>
            <Link to="/checkout" className="gb-primary-button gb-full-button">PROCEED TO CHECKOUT</Link>
            <Link to="/products" className="gb-continue-link">Continue shopping</Link>
          </aside>
        </div>
      )}
    </main>
  );
};

export const CheckoutPage = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(getSavedCart);
  const [step, setStep] = useState("information");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const [form, setForm] = useState({
    email: user?.email || "",
    country: "India",
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    address: "",
    apartment: "",
    city: "",
    state: "Maharashtra",
    postalCode: "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  useEffect(() => {
    if (user) {
      setForm((previous) => ({
        ...previous,
        email: user.email || previous.email,
        firstName: user.first_name || previous.firstName,
        lastName: user.last_name || previous.lastName,
        phone: user.phone || previous.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    const sync = () => setCart(getSavedCart());
    window.addEventListener("greenbee-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("greenbee-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [cart]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const orderPayload = {
    customer: form,
    items: cart.map((item) => ({
      id: item.id,
      quantity: Number(item.quantity),
      size: item.size || null,
      color: item.color || null,
    })),
  };

  const placeCODOrder = async () => {
    const result = await apiRequest("/api/orders/cod", token, orderPayload);
    setPlacedOrder(result);
    saveCart([]);
    setCart([]);
  };

  const payWithRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error("Unable to load Razorpay checkout. Please try again.");

    const order = await apiRequest("/api/payments/razorpay/order", token, orderPayload);
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "GreenBee",
      description: `Order #${order.orderId}`,
      order_id: order.razorpayOrderId,
      prefill: order.customer,
      theme: { color: "#176d47" },
      handler: async (response) => {
        try {
          const verified = await apiRequest("/api/payments/razorpay/verify", token, {
            orderId: order.orderId,
            ...response,
          });
          setPlacedOrder({
            success: true,
            orderId: verified.orderId,
            message: verified.message,
            currency: "INR",
          });
          saveCart([]);
          setCart([]);
        } catch (error) {
          setMessage(`${error.message} If money was deducted, contact support with Razorpay payment ID ${response.razorpay_payment_id}.`);
        } finally {
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setMessage("Payment was not completed. Your order remains unpaid; you can try again.");
          setSubmitting(false);
        },
      },
    };

    const checkout = new window.Razorpay(options);
    checkout.on("payment.failed", (response) => {
      setMessage(response.error?.description || "Payment failed. Please try again.");
      setSubmitting(false);
    });
    checkout.open();
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!token || !isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" }, replace: true });
      return;
    }
    if (!cart.length) {
      setMessage("Your cart is empty.");
      return;
    }
    if (!form.phone.trim()) {
      setMessage("Please enter your mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      if (paymentMethod === "cod") await placeCODOrder();
      else await payWithRazorpay();
    } catch (error) {
      setMessage(error.message || "Unable to process your order.");
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (placedOrder) {
    return (
      <main className="gb-checkout-empty">
        <h2>Thank you for your order!</h2>
        <p>Your order number is <strong>#{placedOrder.orderId}</strong>.</p>
        <p>{placedOrder.message || "Your order has been placed successfully."}</p>
        <Link to="/home" className="gb-primary-button">CONTINUE SHOPPING</Link>
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="gb-checkout-empty">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="gb-primary-button">EXPLORE PRODUCTS</Link>
      </main>
    );
  }

  return (
    <main className="gb-checkout-page">
      <section className="gb-checkout-form-side">
        <div className="gb-checkout-form-inner">
          <Link to="/" className="gb-checkout-brand">GreenBee</Link>
          <div className="gb-checkout-breadcrumb">
            <Link to="/cart">Cart</Link><span>›</span>
            <strong>Information</strong><span>›</span><span>Payment</span>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="gb-checkout-section-heading">
              <h2>Contact</h2>
              <span>{user?.first_name || "Logged-in customer"}</span>
            </div>
            <input type="email" name="email" placeholder="Email" value={form.email}
              onChange={handleChange} required readOnly={Boolean(user?.email)} />

            <h2 className="gb-checkout-section-title">Delivery</h2>
            <label className="gb-floating-field">
              <span>Country/Region</span>
              <select name="country" value={form.country} onChange={handleChange}>
                <option>India</option>
              </select>
            </label>

            <div className="gb-checkout-two-columns">
              <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
              <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
            </div>
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
            <input name="apartment" placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={handleChange} />
            <div className="gb-checkout-three-columns">
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
              <label className="gb-floating-field">
                <span>State</span>
                <select name="state" value={form.state} onChange={handleChange} required>
                  {["Maharashtra", "Madhya Pradesh", "Gujarat", "Karnataka", "Delhi", "Rajasthan", "Uttar Pradesh", "Other"].map((state) => <option key={state}>{state}</option>)}
                </select>
              </label>
              <input name="postalCode" placeholder="PIN code" inputMode="numeric" pattern="[0-9]{6}"
                maxLength={6} value={form.postalCode} onChange={handleChange} required />
            </div>
            <input type="tel" name="phone" placeholder="10-digit mobile number" pattern="[0-9+ -]{10,15}"
              value={form.phone} onChange={handleChange} required />

            <h3 className="gb-shipping-heading">Payment method</h3>
            <label className="gb-payment-option">
              <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)} />
              <span><strong>Cash on Delivery</strong><small>Pay when your order arrives</small></span>
            </label>
            <label className="gb-payment-option">
              <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)} />
              <span><strong>UPI / Cards / Net Banking</strong><small>Secure payment through Razorpay</small></span>
            </label>

            {message && <p className="gb-checkout-message" role="alert">{message}</p>}
            <div className="gb-checkout-bottom">
              <Link to="/cart">← Return to cart</Link>
              <button className="gb-primary-button" type="submit" disabled={submitting}>
                {submitting ? "PROCESSING..." : paymentMethod === "cod" ? "PLACE COD ORDER" : "PAY NOW"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <aside className="gb-checkout-summary-side">
        <div className="gb-checkout-summary-inner">
          {cart.map((item, index) => (
            <div className="gb-checkout-product" key={`${item.id}-${item.size}-${item.color}-${index}`}>
              <div className="gb-checkout-image-wrap">
                <img src={getImageUrl(item.image_path)} alt={item.name} />
                <span>{item.quantity}</span>
              </div>
              <div className="gb-checkout-product-details">
                <p>{item.name}</p>
                <span>{item.size || "Standard"} / {item.color || "Default"}</span>
              </div>
              <strong>{money(Number(item.price) * Number(item.quantity))}</strong>
            </div>
          ))}
          <div className="gb-checkout-summary-row">
            <span>Subtotal · {cart.reduce((sum, item) => sum + Number(item.quantity), 0)} items</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="gb-checkout-summary-row"><span>Shipping</span><span>Calculated by store</span></div>
          <div className="gb-checkout-grand-total"><strong>Total</strong><div><span>INR</span><strong>{money(subtotal)}</strong></div></div>
          <small className="gb-price-note">Final payable amount is calculated and validated by the server.</small>
        </div>
      </aside>
    </main>
  );
};
