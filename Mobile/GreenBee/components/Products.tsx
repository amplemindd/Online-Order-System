import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';

import { Product, useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Temporary static product data.
// Later, we will fetch this from the Node.js backend.
const products: Product[] = [
  {
    id: 1,
    name: 'APPLES',
    price: 12,
    image: require('../assets/images/apples-p.jpg'),
  },
  {
    id: 2,
    name: 'AVOCADOS',
    price: 20,
    image: require('../assets/images/avocado.jpg'),
  },
  {
    id: 3,
    name: 'BANANAS',
    price: 14,
    image: require('../assets/images/banana.jpg'),
  },
  {
    id: 4,
    name: 'BLACKBERRIES',
    price: 16,
    image: require('../assets/images/blackberry.jpg'),
  },
];

const Products: React.FC = () => {
  const { addToCart, cartCount } = useCart();

  const { toggleWishlist, isWishlisted } = useWishlist();

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [selectedSize, setSelectedSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product: Product) => {
    if (product.id === 3) {
      setSelectedProduct(product);
      setSelectedSize('Medium');
      setQuantity(1);
      return;
    }

    addToCart(product);
    // Alert.alert('Added to Cart', `${product.name} added successfully!`);
    Alert.alert('Added to Cart', `${product.name} added successfully!`);
  };

  const handleBananaAddToCart = () => {
    if (!selectedProduct) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct, selectedSize);
    }

    setSelectedProduct(null);

    Alert.alert(
      'Added to Cart',
      `${quantity} ${selectedProduct.name} added successfully!`,
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

      <View style={styles.productGrid}>
        {products.map(product => {
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

              <Image
                source={product.image}
                style={styles.productImage}
                resizeMode="cover"
              />

              <Text style={styles.productName}>
                {product.name}
              </Text>

              <Text style={styles.productPrice}>
                ₹{product.price.toFixed(2)}
              </Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(product)}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>
                  {product.id === 3 ? 'SELECT OPTIONS' : 'ADD TO CART'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Banana size and quantity selection */}
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

            <Text style={styles.modalLabel}>Choose Size</Text>

            <View style={styles.sizeContainer}>
              {['Small', 'Medium', 'Large'].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.selectedSizeButton,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.selectedSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Quantity</Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleBananaAddToCart}
            >
              <Text style={styles.addButtonText}>ADD TO CART</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
