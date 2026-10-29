
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://online-order-system-1.onrender.com";

const AddProductForm = () => {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const API_URL = "https://online-order-system-1.onrender.com";

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `${API_URL}/api/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          price: Number(productPrice),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add product");
    }

    alert(data.message);
    console.log(data);

  } catch (error) {
    console.error("Error:", error);
    setError(error.message);
  }
};

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", productName);
    formData.append("price", productPrice);

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product.");
      }

      setSuccess("Product added successfully!");

      setImage(null);
      setProductName("");
      setProductPrice("");

      e.target.reset();

      // Navigate only if your application has this route.
      // Uncomment the next line if you want to redirect:
      // navigate("/submitted");

    } catch (err) {
      console.error("Add product error:", err);

      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Product</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Upload Image</label>

          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0] || null)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Product Name</label>

          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Product Price</label>

          <input
            type="number"
            placeholder="Enter price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {success && <p style={styles.success}>{success}</p>}

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
    alignSelf: "flex-end",
  },

  error: {
    color: "red",
    fontSize: "14px",
  },

  success: {
    color: "green",
    fontSize: "14px",
  },
};

export default AddProductForm;
