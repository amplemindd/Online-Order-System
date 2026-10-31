import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductForm = () => {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check whether an image is selected
    if (!image) {
      setError("Please upload a product image.");
      return;
    }

    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", productName);
    formData.append("price", productPrice);

    try {
      const response = await fetch(
        "https://online-order-system-1.onrender.com/api/products",
        {
          method: "POST",
          body: formData,
        }
      );

      // Read the response safely
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product."
        );
      }

      console.log("Product added successfully:", data);

      // Navigate only once after successful submission
      navigate("/submitted");
    } catch (err) {
      console.error("Product submission error:", err);

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Product</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Image Upload */}
        <div style={styles.field}>
          <label style={styles.label}>
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              setImage(e.target.files[0] || null);
              setError("");
            }}
            style={styles.input}
          />
        </div>

        {/* Product Name */}
        <div style={styles.field}>
          <label style={styles.label}>
            Product Name
          </label>

          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
            required
            style={styles.input}
          />
        </div>

        {/* Product Price */}
        <div style={styles.field}>
          <label style={styles.label}>
            Product Price
          </label>

          <input
            type="number"
            placeholder="Enter price"
            value={productPrice}
            onChange={(e) =>
              setProductPrice(e.target.value)
            }
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "ADD PRODUCT"}
        </button>
      </form>
    </div>
  );
};

// Existing design preserved
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "6px",
    fontSize: "13px",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  input: {
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    marginTop: "10px",
    padding: "14px 24px",
    backgroundColor: "#111",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    alignSelf: "flex-end",
  },

  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default AddProductForm;