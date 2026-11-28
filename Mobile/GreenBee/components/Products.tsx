import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Product, useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchProducts } from './services/ProductService';

interface ProductsProps {
  categoryId: number | string | null;
  onProductPress: (product: Product) => void;
  onBack: () => void;
}

const Products: React.FC<ProductsProps> = ({
  categoryId,
  onProductPress,
  onBack,
}) => {
  const { addToCart, cartCount } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const filteredProducts = categoryId
  ? products.filter(
      product =>
        String(product.categoryId) === String(categoryId),
    )
  : products;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Unable to load products:', err);
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock !== undefined && product.stock <= 0) {
      Alert.alert('Out of Stock', `${product.name} is currently unavailable.`);
      return;
    }

    addToCart(product);

    Alert.alert(
      'Added to Cart',
      `${product.name} added successfully!`,
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>OUR PRODUCTS</Text>
        <Text style={styles.subheading}>
          Freshness delivered to your doorstep
        </Text>
      </View>

      <View style={styles.cartInfo}>
        <Text style={styles.cartText}>
          Cart Items: {cartCount}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#238B45" />
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#E53935', marginBottom: 12 }}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={loadProducts}
          >
            <Text style={styles.addButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#777' }}>
          No products available.
        </Text>
      ) : (
        <View style={styles.productGrid}>
            {filteredProducts.map(product => {
          const wishlisted = isWishlisted(product.id);

            return (
              <View style={styles.productCard} key={product.id}>
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => toggleWishlist(product)}
                >
                  <Text style={styles.heart}>
                    {wishlisted ? '❤️' : '♡'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.productPressArea}
                onPress={() => onProductPress(product)}>
                <Image
                  source={product.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />

                <Text style={styles.productName}>
                  {product.name}
                </Text>
                </TouchableOpacity>


                <Text style={styles.productPrice}>
                  ₹{product.price.toFixed(2)}
                </Text>

                <Text style={{ fontSize: 12, color: '#777', marginBottom: 8 }}>
                  {product.pricingType || ''}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    product.stock !== undefined &&
                      product.stock <= 0 && { backgroundColor: '#999' },
                  ]}
                  onPress={() => handleAddToCart(product)}
                  activeOpacity={0.8}
                  disabled={product.stock !== undefined && product.stock <= 0}
                >
                  <Text style={styles.addButtonText}>
                    {product.stock !== undefined && product.stock <= 0
                      ? 'OUT OF STOCK'
                      : 'ADD TO CART'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 15,
    paddingBottom: 30,
  },

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

productPressArea: {
  width: '100%',
  alignItems: 'center',
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
