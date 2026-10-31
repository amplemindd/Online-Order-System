import React, { useEffect, useState, useCallback } from "react";
import "../projectCss/ProductList.css";

const API_URL = "http://localhost:5000";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("Small");
    const [selectedColor, setSelectedColor] = useState("Blue");
    const [quantity, setQuantity] = useState(1);

    const sizes = ["Small", "Medium", "Large", "Ultra"];
    const colors = ["Blue", "Red", "Orange", "Green", "Pink"];

    // Fetch products from backend
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/api/products`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to load products."
                );
            }

            setProducts(data.products || []);
        } catch (err) {
            console.error("Fetch products error:", err);
            setError("Unable to load products. Server Error.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Get product image URL
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

    // Get cart from localStorage
    const getCart = () => {
        try {
            return JSON.parse(
                localStorage.getItem("greenbee_cart")
            ) || [];
        } catch {
            return [];
        }
    };

    // Notify other components when the cart changes
    const updateCartCount = useCallback(() => {
        window.dispatchEvent(
            new Event("greenbee-cart-updated")
        );
    }, []);

    // Load products and listen for cart storage changes
    useEffect(() => {
        fetchProducts();
        updateCartCount();

        const handleStorage = () => {
            updateCartCount();
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage
            );
        };
    }, [fetchProducts, updateCartCount]);

    // Open product options
    const openOptions = (product) => {
        setSelectedProduct(product);
        setSelectedSize("Small");
        setSelectedColor("Blue");
        setQuantity(1);
    };

    // Close product options
    const closeOptions = () => {
        setSelectedProduct(null);
    };

    // Add product to cart
    const addToCart = () => {
        if (!selectedProduct) return;

        const cart = getCart();
        const productId = String(selectedProduct.id);

        const existingIndex = cart.findIndex(
            (item) =>
                String(item.id) === productId &&
                item.size === selectedSize &&
                item.color === selectedColor
        );

        if (existingIndex >= 0) {
            cart[existingIndex].quantity =
                Number(cart[existingIndex].quantity) + quantity;
        } else {
            cart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: Number(selectedProduct.price),
                image_path: selectedProduct.image_path || "",
                size: selectedSize,
                color: selectedColor,
                quantity
            });
        }

        localStorage.setItem(
            "greenbee_cart",
            JSON.stringify(cart)
        );

        updateCartCount();
        closeOptions();

        alert(`${selectedProduct.name} added to cart!`);
    };

    // Buy now
    const buyNow = () => {
        addToCart();
        window.location.href = "/checkout";
    };

    // Handle unavailable product images
    const handleImageError = (e) => {
        e.currentTarget.style.visibility = "hidden";

        if (e.currentTarget.parentElement) {
            e.currentTarget.parentElement.classList.add(
                "image-unavailable"
            );
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="products-status">
                Loading products...
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="products-status products-error">
                <p>{error}</p>

                <button onClick={fetchProducts}>
                    TRY AGAIN
                </button>
            </div>
        );
    }

    return (
        <>
            <section className="products-section">
                <div className="products-grid">
                    {products.map((product, index) => {
                        const imageUrl = getImageUrl(
                            product.image_path
                        );

                        return (
                            <article
                                className="product-card"
                                key={product.id}
                            >
                                <div className="product-image-area">
                                    {index < 4 && (
                                        <span className="product-new-badge">
                                            NEW
                                        </span>
                                    )}

                                    <span className="product-discount-badge">
                                        {
                                            [
                                                "-64%",
                                                "-50%",
                                                "-28%",
                                                "-14%"
                                            ][index % 4]
                                        }
                                    </span>

                                    {imageUrl ? (
                                        <img
                                            className="product-image"
                                            src={imageUrl}
                                            alt={product.name}
                                            onError={handleImageError}
                                        />
                                    ) : (
                                        <div className="product-no-image">
                                            No Image
                                        </div>
                                    )}

                                    <div className="product-image-actions">
                                        <button
                                            type="button"
                                            aria-label="View product"
                                            onClick={() =>
                                                openOptions(product)
                                            }
                                        >
                                            ⌕
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Add to wishlist"
                                            onClick={() =>
                                                alert(
                                                    "Wishlist coming soon!"
                                                )
                                            }
                                        >
                                            ♡
                                        </button>
                                    </div>
                                </div>

                                <div className="product-details">
                                    <h3 className="product-name">
                                        {product.name}
                                    </h3>

                                    <div className="product-prices">
                                        <span className="product-current-price">
                                            $
                                            {Number(
                                                product.price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="product-select-button"
                                    type="button"
                                    onClick={() =>
                                        openOptions(product)
                                    }
                                >
                                    <span className="product-check">
                                        ✓
                                    </span>

                                    SELECT OPTIONS
                                </button>
                            </article>
                        );
                    })}
                </div>

                {products.length === 0 && (
                    <div className="products-status">
                        <h3>No products available</h3>

                        <p>
                            Add products using your Add Product form.
                        </p>

                        <button onClick={fetchProducts}>
                            REFRESH PRODUCTS
                        </button>
                    </div>
                )}
            </section>

            {/* Product Options Popup */}
            {selectedProduct && (
                <div
                    className="gb-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeOptions();
                        }
                    }}
                >
                    <div
                        className="gb-options-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Product options"
                    >
                        <button
                            type="button"
                            className="gb-modal-close"
                            onClick={closeOptions}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="gb-modal-product">
                            {selectedProduct.image_path && (
                                <img
                                    src={getImageUrl(
                                        selectedProduct.image_path
                                    )}
                                    alt={selectedProduct.name}
                                />
                            )}

                            <div>
                                <h3>{selectedProduct.name}</h3>

                                <strong>
                                    $
                                    {Number(
                                        selectedProduct.price
                                    ).toFixed(2)}
                                </strong>
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="gb-option-group">
                            <label>
                                SIZE: {selectedSize.toUpperCase()}
                            </label>

                            <div className="gb-option-buttons">
                                {sizes.map((size) => (
                                    <button
                                        type="button"
                                        key={size}
                                        className={
                                            selectedSize === size
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedSize(size)
                                        }
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="gb-option-group">
                            <label>
                                COLOR: {selectedColor.toUpperCase()}
                            </label>

                            <div className="gb-option-buttons">
                                {colors.map((color) => (
                                    <button
                                        type="button"
                                        key={color}
                                        className={
                                            selectedColor === color
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedColor(color)
                                        }
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="gb-quantity-price">
                            <div>
                                <label>QUANTITY:</label>

                                <div className="gb-quantity-control">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.max(1, q - 1)
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>{quantity}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) => q + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <strong>
                                $
                                {(
                                    Number(selectedProduct.price) *
                                    quantity
                                ).toFixed(2)}
                            </strong>
                        </div>

                        {/* Add to Cart */}
                        <button
                            type="button"
                            className="gb-add-cart-button"
                            onClick={addToCart}
                        >
                            ADD TO CART
                        </button>

                        {/* Buy Now */}
                        <button
                            type="button"
                            className="gb-buy-now-button"
                            onClick={buyNow}
                        >
                            BUY IT NOW
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductList;