import React, { useState } from 'react';

function AddProductModal({ onClose, onProductAdded }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Fruits',
    price: '',
    stock: '',
    pricingType: 'Per Kg',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert('Product Name aur Price toh bhar bhai!');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('stock', form.stock || 0);
      formData.append('pricingType', form.pricingType);
      formData.append('description', form.description);
      if (image) formData.append('image', image);

      const res = await fetch('http://localhost:3000/api/products/add', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert('Product added successfully');
        if (onProductAdded) onProductAdded();
        if (onClose) onClose();
      } else {
        alert('Error: ' + (data.error || 'Save nahi hua'));
      }
    } catch (err) {
      alert('Backend check kar - ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}>
      {/* SIDE SE KHULNE WALA PANEL - Right Side */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '430px', maxWidth: '90vw', height: '100vh', background: '#fff', padding: '24px', overflowY: 'auto', boxShadow: '-5px 0 20px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Add New Product</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer' }}>✕</button>
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>Add a new product to your store</p>

        <div onClick={() => document.getElementById('product-image-input').click()} style={{ border: '2px dashed #ddd', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px' }}>
          {preview ? (
            <img src={preview} alt="preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            <div>
              <div style={{ fontSize: '32px' }}>📷</div>
              <p style={{ margin: '8px 0 0' }}>Click to upload Product Image</p>
              <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>PNG, JPG, JPEG (Max 5MB)</p>
            </div>
          )}
          <input id="product-image-input" type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        </div>

        <label>Product Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Apple" style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd' }} />

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option>Fruits</option>
              <option>Vegetables</option>
              <option>Dairy</option>
              <option>Bakery</option>
              <option>Groceries</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Pricing Type</label>
            <select name="pricingType" value={form.pricingType} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option>Per Kg</option>
              <option>Per Piece</option>
              <option>Per Litre</option>
              <option>Per Pack</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label>Price (₹)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="50" style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Stock Quantity</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="16" style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
        </div>

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="tasty apple" style={{ width: '100%', padding: '10px', marginBottom: '16px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '70px' }} />

        <div style={{ display: 'flex', gap: '12px', paddingBottom: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#2e7d32', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;