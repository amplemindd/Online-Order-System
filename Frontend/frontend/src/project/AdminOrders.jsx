import React, { useCallback, useEffect, useState } from "react";
import "../projectCss/Admin.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const money = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(v || 0));

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await request("/api/admin/orders");
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const viewOrder = async (id) => {
    try {
      const data = await request(`/api/admin/orders/${id}`);
      setSelected(data.order);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    setSaving(true);
    try {
      await request(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadOrders();
      if (selected?.id === id) setSelected((old) => ({ ...old, status }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-card products-card">
      <div className="prod-header">
        <div><h2>Orders Management</h2><p>View customer orders and update fulfilment status.</p></div>
        <button className="add-product-btn" type="button" onClick={loadOrders}>↻ Refresh Orders</button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      {loading ? <p className="admin-loading">Loading orders...</p> : (
        <div className="table-responsive">
          <table className="recent-table product-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Payment</th><th>Order Status</th><th>Details</th></tr></thead>
            <tbody>
              {orders.length ? orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>{order.customer_name}<br /><small>{order.customer_email}</small></td>
                  <td>{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                  <td>{money(order.total_amount)}</td>
                  <td>{String(order.payment_method || "—").toUpperCase()}<br /><small>{order.payment_status}</small></td>
                  <td>
                    <select value={order.status} disabled={saving}
                      onChange={(e) => updateStatus(order.id, e.target.value)}>
                      {["pending", "placed", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button type="button" className="add-product-btn" onClick={() => viewOrder(order.id)}>View</button></td>
                </tr>
              )) : <tr><td colSpan="7" className="empty-cell">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="gb-order-detail">
          <div className="prod-header">
            <div><h3>Order #{selected.id}</h3><p>{selected.customer_name} · {selected.customer_email} · {selected.customer_phone}</p></div>
            <button type="button" className="delete-product-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
          <p><strong>Delivery:</strong> {selected.address}{selected.apartment ? `, ${selected.apartment}` : ""}, {selected.city}, {selected.state} - {selected.postal_code}, {selected.country}</p>
          <p><strong>Payment:</strong> {selected.payment_method} / {selected.payment_status} · <strong>Total:</strong> {money(selected.total_amount)}</p>
          <div className="table-responsive">
            <table className="recent-table">
              <thead><tr><th>Product</th><th>Variant</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
              <tbody>{items.map((item, i) => (
                <tr key={`${item.product_id}-${i}`}>
                  <td>{item.product_name}</td>
                  <td>{[item.product_size, item.product_color].filter(Boolean).join(" / ") || "—"}</td>
                  <td>{item.quantity}</td><td>{money(item.price)}</td><td>{money(item.subtotal)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
