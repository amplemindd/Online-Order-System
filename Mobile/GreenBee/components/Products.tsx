import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Product, useCart } from '../context/CartContext';

const API_BASE_URL = 'https://online-order-system-1.onrender.com';

type ApiProduct = {
  id: number;
  name: string;
  price: string | number;
  image_path: string | null;
  description?: string;
  stock?: number;
  pricing_type?: string;
  category?: string;
  category_name?: string;
  images?: Array<string | { image_path?: string; url?: string }>;
  [key: string]: any;
};

type ProductsProps = {
  categoryName?: string | null;
  onBack?: () => void;
  onProductPress?: (product: ApiProduct & Product) => void;
};

const Products: React.FC<ProductsProps> = ({ categoryName, onBack, onProductPress }) => {
  const { addToCart, cartCount } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [selectedSize, setSelectedSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);

  // Fetch products from backend
  const fetchProducts = async () => {
  try {
    setLoading(true);
    setError('');

    console.log('API URL:', `${API_BASE_URL}/api/products`);

    const response = await fetch(
      `${API_BASE_URL}/api/products`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    console.log('API Status:', response.status);

    const responseText = await response.text();

    console.log('API Response:', responseText);

    if (!response.ok) {
      throw new Error(
        `Server Error: ${response.status} - ${responseText}`,
      );
    }

    const data = JSON.parse(responseText);

    if (!data.success || !Array.isArray(data.products)) {
      throw new Error('Invalid products API response.');
    }

    const formattedProducts: Product[] = data.products.map(
      (item: ApiProduct) => ({
        ...item,
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image_path
          ? {
              uri: `${API_BASE_URL}/${item.image_path.replace(/^\/+/, '')}`,
            }
          : require('../assets/images/apples-p.jpg'),
      }),
    );

    setProducts(formattedProducts);
  } catch (err) {
    console.log('PRODUCT API ERROR:', err);

    const errorMessage =
      err instanceof Error ? err.message : String(err);

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // Check whether product is Banana
  const isBanana = (product: Product) =>
    product.name.toLowerCase().includes('banana');

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    if (isBanana(product)) {
      setSelectedProduct(product);
      setSelectedSize('Medium');
      setQuantity(1);
      return;
    }

    addToCart(product);

    Alert.alert(
      'Added to Cart',
      `${product.name} added successfully!`,
    );
  };

  // Add Banana with selected size and quantity
  const handleBananaAddToCart = () => {
    if (!selectedProduct) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct, selectedSize);
    }

    Alert.alert(
      'Added to Cart',
      `${quantity} ${selectedProduct.name} added successfully!`,
    );

    setSelectedProduct(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Heading */}
      <View style={styles.headingContainer}>
        {onBack && <TouchableOpacity onPress={onBack} style={styles.backButton}><Text style={styles.backButtonText}>‹  Back</Text></TouchableOpacity>}
        <Text style={styles.heading}>{categoryName ? categoryName.toUpperCase() : 'OUR PRODUCTS'}</Text>

        <Text style={styles.subheading}>
          Freshness delivered to your doorstep
        </Text>
      </View>

      {/* Cart Information */}
      <View style={styles.cartInfo}>
        <Text style={styles.cartText}>
          Cart Items: {cartCount}
        </Text>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#238B45" />

          <Text style={styles.loadingText}>
            Loading products...
          </Text>
        </View>
      )}

      {/* Error */}
      {!loading && error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProducts}
          >
            <Text style={styles.addButtonText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <View style={styles.productGrid}>
          {products.filter(product => !categoryName || String((product as any).category_name || (product as any).category || '').toLowerCase() === categoryName.toLowerCase()).map(product => {
            return (
              <TouchableOpacity
                style={styles.productCard}
                key={product.id}
                activeOpacity={0.88}
                onPress={() => onProductPress?.(product as ApiProduct & Product)}
              >

                {/* Product Image */}
                <Image
                  source={product.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />

                {/* Product Name */}
                <Text style={styles.productName}>
                  {product.name}
                </Text>

                {/* Product Price */}
                <Text style={styles.productPrice}>
                  ₹{product.price.toFixed(2)}
                </Text>

                {/* Add to Cart */}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddToCart(product)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>
                    {isBanana(product)
                      ? 'SELECT OPTIONS'
                      : 'ADD TO CART'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {products.length === 0 && (
            <Text style={styles.emptyText}>
              No products available.
            </Text>
          )}
        </View>
      )}

      {/* Banana Size and Quantity Modal */}
      <Modal
        visible={selectedProduct !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Select Banana Options
            </Text>

            {/* Size Selection */}
            <Text style={styles.modalLabel}>
              Choose Size
            </Text>

            <View style={styles.sizeContainer}>
              {['Small', 'Medium', 'Large'].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size &&
                      styles.selectedSizeButton,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size &&
                        styles.selectedSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quantity Selection */}
            <Text style={styles.modalLabel}>
              Quantity
            </Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
              >
                <Text style={styles.quantityButtonText}>
                  −
                </Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>
                {quantity}
              </Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>
                  +
                </Text>
              </TouchableOpacity>
            </View>

            {/* Add Banana */}
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleBananaAddToCart}
            >
              <Text style={styles.addButtonText}>
                ADD TO CART
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={styles.cancelText}>
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 15,
    paddingBottom: 30,
  },

  backButton: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 4 },
  backButtonText: { color: '#238B45', fontSize: 14, fontWeight: '700' },

  headingContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },

  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#238B45',
  },

  subheading: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },

  cartInfo: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },

  cartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#238B45',
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },

  heartButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },

  heart: {
    fontSize: 23,
    color: '#E53935',
  },

  productImage: {
    width: '100%',
    height: 125,
    borderRadius: 8,
  },

  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },

  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#238B45',
    marginVertical: 8,
  },

  addButton: {
    backgroundColor: '#238B45',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#777',
  },

  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#238B45',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },

  emptyText: {
    width: '100%',
    textAlign: 'center',
    color: '#777',
    padding: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 22,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#238B45',
    marginBottom: 20,
  },

  modalLabel: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },

  sizeButton: {
    borderWidth: 1,
    borderColor: '#238B45',
    borderRadius: 7,
    padding: 10,
    minWidth: 75,
    alignItems: 'center',
  },

  selectedSizeButton: {
    backgroundColor: '#238B45',
  },

  sizeText: {
    color: '#238B45',
    fontWeight: '600',
  },

  selectedSizeText: {
    color: '#fff',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  quantityButton: {
    backgroundColor: '#238B45',
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 25,
  },

  modalAddButton: {
    backgroundColor: '#238B45',
    padding: 14,
    borderRadius: 7,
    width: '100%',
    alignItems: 'center',
  },

  cancelButton: {
    marginTop: 15,
    padding: 10,
  },

  cancelText: {
    color: '#777',
    fontWeight: 'bold',
  },
});

export default Products;
