import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AddProductModal({ onClose, onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "Fruits",
    price: "",
    stock: "",
    pricingType: "Per Kg",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) onClose?.();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, saving]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select a valid image.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
      window.alert("Enter a product name and a valid price.");
      return;
    }
    if (form.stock !== "" && (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)) {
      window.alert("Stock must be a non-negative whole number.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("Please log in again to add a product.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("stock", form.stock || "0");
      formData.append("pricingType", form.pricingType);
      formData.append("description", form.description);
      if (image) formData.append("image", image);

      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Product could not be saved.");
      }

      await onProductAdded?.();
      window.alert("Product added successfully!");
      onClose?.();
    } catch (error) {
      window.alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose?.();
    }}>
      <aside className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
        <div className="modal-head">
          <div>
            <h2 id="add-product-title">Add New Product</h2>
            <p>Add a new product to your store</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSave}>
          <label className="label" htmlFor="product-image-input">Product Image</label>
          <label className="upload-box" htmlFor="product-image-input">
            {preview ? (
              <img src={preview} alt="Product preview" />
            ) : (
              <>
                <span>📷</span>
                <strong>Click to upload product image</strong>
                <small>PNG, JPG or WEBP · Maximum 5 MB</small>
              </>
            )}
            <input
              id="product-image-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImage}
            />
          </label>

          <div className="form-grid">
            <div className="form-field full-width">
              <label className="label" htmlFor="product-name">Product Name *</label>
              <input id="product-name" className="input" name="name" value={form.name} onChange={handleChange} placeholder="Enter product name" required />
            </div>

            <div className="form-field">
              <label className="label" htmlFor="product-category">Category *</label>
              <select id="product-category" className="input" name="category" value={form.category} onChange={handleChange}>
                <option>Fruits</option>
                <option>Vegetables</option>
                <option>Dairy</option>
                <option>Bakery</option>
                <option>Groceries</option>
              </select>
            </div>

            <div className="form-field">
              <label className="label" htmlFor="product-pricing-type">Pricing Type</label>
              <select id="product-pricing-type" className="input" name="pricingType" value={form.pricingType} onChange={handleChange}>
                <option>Per Kg</option>
                <option>Per Piece</option>
                <option>Per Litre</option>
                <option>Per Pack</option>
              </select>
            </div>

            <div className="form-field">
              <label className="label" htmlFor="product-price">Price (₹) *</label>
              <input id="product-price" className="input" type="number" min="0.01" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="Enter price" required />
            </div>

            <div className="form-field">
              <label className="label" htmlFor="product-stock">Stock Quantity</label>
              <input id="product-stock" className="input" type="number" min="0" step="1" name="stock" value={form.stock} onChange={handleChange} placeholder="Enter stock" />
            </div>

            <div className="form-field full-width">
              <label className="label" htmlFor="product-description">Description</label>
              <textarea id="product-description" className="input" name="description" value={form.description} onChange={handleChange} placeholder="Enter product description" rows="4" />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Product"}</button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default AddProductModal;
