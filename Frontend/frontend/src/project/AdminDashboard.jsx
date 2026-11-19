import React, { useCallback, useEffect, useState } from "react";
import "../projectCss/Admin.css";
import AddProductModal from "./AddProductModal";
import AdminOrders from "./AdminOrders";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

async function apiRequest(url, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return data;
}

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getImageUrl = (product) => {
  const image = product.image_path || product.imageUrl || product.image;
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};

const Icons = {
  Dashboard: () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Orders: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v3H7zM5 6h14v15H5z"/><path d="M8 11h8M8 15h8"/></svg>,
  Products: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 22V12"/></svg>,
  Categories: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/><path d="M2 5h.01M2 12h.01M2 19h.01"/></svg>,
  Customers: () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M17 4a4 4 0 0 1 0 8M19 15a5 5 0 0 1 3 4v2"/></svg>,
  Reports: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8z"/></svg>,
};

const menuItems = [
  { id: "dashboard", label: "Dashboard", Icon: Icons.Dashboard },
  { id: "orders", label: "Orders", Icon: Icons.Orders, badge: "" },
  { id: "products", label: "Products", Icon: Icons.Products, expandable: true },
  { id: "categories", label: "Categories", Icon: Icons.Categories },
  { id: "customers", label: "Customers", Icon: Icons.Customers },
  { id: "reports", label: "Reports", Icon: Icons.Reports },
  { id: "settings", label: "Settings", Icon: Icons.Settings },
];

function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [showAdd, setShowAdd] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiRequest("/api/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    setError("");
    try {
      const [dashboardData, productData] = await Promise.all([
        apiRequest("/api/admin/dashboard-stats"),
        apiRequest("/api/products"),
      ]);

      setStats({
        totalProducts: Number(dashboardData.totalProducts || 0),
        totalOrders: Number(dashboardData.totalOrders || 0),
        totalCustomers: Number(dashboardData.totalCustomers || 0),
        totalRevenue: Number(dashboardData.totalRevenue || 0),
        recentOrders: dashboardData.recentOrders || [],
        topProducts: dashboardData.topProducts || [],
      });

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData.products || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await apiRequest(`/api/products/${id}`, { method: "DELETE" });
      await fetchDashboard();
    } catch (err) {
      window.alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("greenbee_token");
    sessionStorage.removeItem("greenbee_user");
    window.location.href = "/login";
  };

  const openProducts = () => {
    setPage("products");
    setProductsExpanded((current) => !current);
  };

  const topProducts =
    stats.topProducts.length > 0 ? stats.topProducts : products.slice(0, 5);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon">
            <span aria-hidden="true">🌿</span>
          </div>
          <div className="admin-logo-copy">
            <h3>GreenBee</h3>
            <span>Online Order System</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {menuItems.map(({ id, label, Icon, badge, expandable }) => (
            <React.Fragment key={id}>
              <button
                type="button"
                className={`admin-nav-item ${page === id ? "active" : ""}`}
                onClick={() => {
                  if (expandable) openProducts();
                  else setPage(id);
                }}
              >
                <Icon />
                <span>{label}</span>
                {badge && <span className="badge">{badge}</span>}
                {expandable && (
                  <span className={`arrow ${productsExpanded ? "open" : ""}`}>›</span>
                )}
              </button>

              {expandable && productsExpanded && (
                <div className="admin-sub">
                  <button
                    type="button"
                    className={`admin-sub-item ${page === "products" ? "active" : ""}`}
                    onClick={() => setPage("products")}
                  >
                    All Products
                  </button>
                  <button
                    type="button"
                    className="admin-sub-item"
                    onClick={() => setShowAdd(true)}
                  >
                    Add Product
                  </button>
                  <button type="button" className="admin-sub-item" onClick={() => setPage("products")}>
                    Product Variants
                  </button>
                  <button type="button" className="admin-sub-item" onClick={() => setPage("products")}>
                    Bulk Upload
                  </button>
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="admin-basket">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3081/3081648.png"
            alt="Shopping basket"
          />
          <h4>GreenBee</h4>
          <p>Manage your online<br />store efficiently.</p>
        </div>

        <div className="admin-user">
          <div className="admin-user-avatar">👤</div>
          <div className="admin-user-copy">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
          <span className="admin-online-dot" />
          <button type="button" className="admin-logout" onClick={handleLogout} title="Logout" aria-label="Logout">↪</button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-top">
          <div className="admin-page-heading">
            <h2>{page === "dashboard" ? "Admin Dashboard" : `${page.charAt(0).toUpperCase()}${page.slice(1)} Management`}</h2>
            <p>Welcome back, Admin 👋</p>
          </div>
          <div className="admin-top-actions">
            <label className="admin-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" placeholder="Search orders, products, customers..." />
            </label>
            <button className="admin-refresh" type="button" onClick={fetchDashboard} title="Refresh dashboard">↻</button>
          </div>
        </header>

        {error && (
          <div className="admin-error">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>✕</button>
          </div>
        )}

        {loading ? (
          <div className="admin-loading">Loading dashboard...</div>
        ) : (
          <>
            {page === "dashboard" && (
              <>
                <section className="admin-cards">
                  <div className="stat-card">
                    <div className="stat-icon stat-green">🛒</div>
                    <div><h4>Total Orders</h4><h2>{stats.totalOrders.toLocaleString("en-IN")}</h2><p>All customer orders</p></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-purple">📦</div>
                    <div><h4>Total Products</h4><h2>{stats.totalProducts.toLocaleString("en-IN")}</h2><p>Live products in store</p></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-blue">👥</div>
                    <div><h4>Total Customers</h4><h2>{stats.totalCustomers.toLocaleString("en-IN")}</h2><p>Registered customers</p></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-yellow">₹</div>
                    <div><h4>Total Revenue</h4><h2>{money(stats.totalRevenue)}</h2><p>Revenue from paid orders</p></div>
                  </div>
                </section>

                <section className="admin-grid2">
                  <div className="admin-card">
                    <div className="admin-card-heading">
                      <strong>Sales Overview</strong>
                      <select aria-label="Sales period" defaultValue="month"><option value="month">This Month</option></select>
                    </div>
                    <div className="chart-wrap">
                      <svg viewBox="0 0 500 160" role="img" aria-label="Decorative sales trend chart">
                        <defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity=".22"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs>
                        {[35, 75, 115, 150].map((y) => <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#edf1ed" strokeDasharray="4 5" />)}
                        <path d="M0 130 Q20 125 40 110 T80 100 T120 70 T160 75 T200 90 T240 85 T280 50 T320 40 T360 45 T400 20 T440 30 T480 20 L500 160 L0 160Z" fill="url(#salesFill)" />
                        <path d="M0 130 Q20 125 40 110 T80 100 T120 70 T160 75 T200 90 T240 85 T280 50 T320 40 T360 45 T400 20 T440 30 T480 20" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <div className="chart-labels"><span>Oct 01</span><span>Oct 07</span><span>Oct 14</span><span>Oct 21</span><span>Oct 29</span></div>
                    </div>
                  </div>

                  <div className="admin-card">
                    <div className="admin-card-heading"><strong>Orders by Status</strong></div>
                    <div className="orders-donut">
                      <div className="donut-chart"><div className="donut-hole"><strong>{stats.totalOrders}</strong><span>Total Orders</span></div></div>
                      <div className="donut-legend">
                        <span><i className="legend-completed" />Completed</span>
                        <span><i className="legend-processing" />Processing</span>
                        <span><i className="legend-pending" />Pending</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="admin-grid3">
                  <div className="admin-card">
                    <div className="admin-card-heading"><strong>Recent Orders</strong><button type="button" onClick={() => setPage("orders")}>View All →</button></div>
                    <div className="table-responsive">
                      <table className="recent-table">
                        <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
                        <tbody>
                          {stats.recentOrders.length ? stats.recentOrders.slice(0, 5).map((order) => (
                            <tr key={order.id}>
                              <td className="order-id">#{order.id}</td>
                              <td>{order.customer_name || "Customer"}</td>
                              <td>{money(order.total_amount)}</td>
                              <td><span className={`status ${String(order.status || "Pending").toLowerCase()}`}>{order.status || "Pending"}</span></td>
                            </tr>
                          )) : <tr><td colSpan="4" className="empty-cell">No orders found.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="admin-card">
                    <div className="admin-card-heading"><strong>Top Selling Products</strong></div>
                    <div className="top-products">
                      {topProducts.length ? topProducts.slice(0, 4).map((product, index) => (
                        <div className="top-product" key={product.id || index}>
                          {getImageUrl(product) ? <img src={getImageUrl(product)} alt={product.name} /> : <span className="top-product-placeholder">🍎</span>}
                          <div className="top-product-info"><strong>{product.name}</strong><small>{product.total_sold || 0} units sold</small></div>
                          <div className="progress"><div style={{ width: `${Math.max(12, 90 - index * 16)}%` }} /></div>
                        </div>
                      )) : <p className="empty-note">No products available yet.</p>}
                    </div>
                  </div>

                  <div className="admin-card">
                    <div className="admin-card-heading"><strong>Quick Actions</strong></div>
                    <div className="quick-grid">
                      <button className="quick-btn green" type="button" onClick={() => setShowAdd(true)}><span>＋</span>Add Product</button>
                      <button className="quick-btn purple" type="button" onClick={() => setPage("categories")}><span>▦</span>Add Category</button>
                      <button className="quick-btn orange" type="button" onClick={() => setPage("products")}><span>◇</span>Manage Products</button>
                      <button className="quick-btn blue" type="button" onClick={() => setPage("reports")}><span>▤</span>View Reports</button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {page === "products" && (
              <section className="admin-card products-card">
                <div className="prod-header">
                  <div><h2>Product Management</h2><p>Manage your store products here.</p></div>
                  <button className="add-product-btn" type="button" onClick={() => setShowAdd(true)}>＋ Add Product</button>
                </div>
                <div className="prod-stats">
                  <div className="prod-stat"><span>📦</span><div><small>Total Products</small><strong>{products.length}</strong></div></div>
                  <div className="prod-stat"><span>🟢</span><div><small>In Stock</small><strong>{products.filter((p) => Number(p.stock) > 0).length}</strong></div></div>
                </div>
                <div className="table-responsive">
                  <table className="recent-table product-table">
                    <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.length ? products.map((product) => (
                        <tr key={product.id}>
                          <td><div className="product-cell">{getImageUrl(product) ? <img src={getImageUrl(product)} alt={product.name} /> : <span className="product-placeholder">🍎</span>}<strong>{product.name}</strong></div></td>
                          <td>{product.category || "Uncategorized"}</td>
                          <td>{money(product.price)}</td>
                          <td>{product.stock ?? "—"}</td>
                          <td><button className="delete-product-btn" type="button" onClick={() => handleDeleteProduct(product.id)}>Delete</button></td>
                        </tr>
                      )) : <tr><td colSpan="5" className="empty-cell">No products found. Add your first product.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {page === "orders" && <AdminOrders />}

{["categories", "customers", "reports", "settings"].includes(page) && (
  <section className="admin-card module-placeholder">
    <h3>{page.charAt(0).toUpperCase() + page.slice(1)} Management</h3>
    <p>This section is ready for its module integration.</p>
  </section>
)}

          </>
        )}
      </main>

      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onProductAdded={async () => {
            await fetchDashboard();
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
