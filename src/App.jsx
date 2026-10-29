import { Heart, Search, ChevronDown } from "lucide-react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&auto=format&fit=crop&q=80",
    price: "₹40.00",
    oldPrice: "₹55.00",
    discount: "-25%",
  },
  {
    id: 2,
    name: "Fresh Green Broccoli",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&auto=format&fit=crop&q=80",
    price: "₹60.00",
    oldPrice: "₹80.00",
    discount: "-25%",
  },
  {
    id: 3,
    name: "Fresh Orange Juice",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80",
    price: "₹90.00",
    oldPrice: "₹120.00",
    discount: "-25%",
  },
  {
    id: 4,
    name: "Fresh Carrot Juice",
    image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&auto=format&fit=crop&q=80",
    price: "₹75.00",
    oldPrice: "₹100.00",
    discount: "-25%",
  },
  {
    id: 5,
    name: "Fresh Green Cucumber",
    image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=80",
    price: "₹30.00",
    oldPrice: "₹40.00",
    discount: "-25%",
  },
];

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-badges">
        <span className="new-badge">NEW</span>
        <span className="discount-badge">{product.discount}</span>
      </div>

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="image-actions">
        <button aria-label="Add to wishlist">
          <Heart size={18} />
        </button>
        <button aria-label="Search product">
          <Search size={18} />
        </button>
      </div>

      <h3>{product.name}</h3>

      <div className="price-row">
        <span className="current-price">{product.price}</span>
        <span className="old-price">{product.oldPrice}</span>
      </div>

      <button className="options-button">
        SELECT OPTIONS
        <ChevronDown size={13} />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <main className="products-section">
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}