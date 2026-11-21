import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { useCart } from '../context/CartContext';

type CartProps = {
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
};

const Cart: React.FC<CartProps> = ({ 
    onContinueShopping,
    onProceedToCheckout,
 }) => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();
  const gst = cartTotal * 0.05;
  const grandTotal = cartTotal + gst;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>MY CART</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty!</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onContinueShopping}
          >
            <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cartItems.map(item => (
            <View
              style={styles.cartCard}
              key={`${item.id}-${item.size ?? 'default'}`}
            >
              <Image
                source={item.image}
                style={styles.productImage}
                resizeMode="cover"
              />

              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>

                {item.size ? (
                  <Text style={styles.sizeText}>Size: {item.size}</Text>
                ) : null}

                <Text style={styles.price}>
                  ₹{item.price.toFixed(2)}
                </Text>

                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => decreaseQuantity(item.id, item.size)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantity}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => increaseQuantity(item.id, item.size)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id, item.size)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{cartTotal.toFixed(2)}</Text>
          </View> */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalAmount}>₹{cartTotal.toFixed(2)}</Text>
           </View>

           <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>GST (5%)</Text>
            <Text style={styles.totalAmount}>₹{gst.toFixed(2)}</Text>
           </View>
           
           <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalAmount}>₹{grandTotal.toFixed(2)}</Text>
           </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onProceedToCheckout}
          >
            <Text style={styles.buttonText}>PROCEED TO CHECKOUT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onContinueShopping}
          >
            <Text style={styles.secondaryButtonText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </>
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

  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#238B45',
    textAlign: 'center',
    marginVertical: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 45,
  },

  emptyText: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },

  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  productImage: {
    width: 85,
    height: 85,
    borderRadius: 8,
  },

  productDetails: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },

  sizeText: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#238B45',
    marginTop: 5,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#238B45',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  quantity: {
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 13,
  },

  removeButton: {
    padding: 8,
  },

  removeText: {
    color: '#E53935',
    fontSize: 19,
    fontWeight: 'bold',
  },

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 18,
    marginTop: 12,
    marginBottom: 20,
  },

  totalLabel: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#238B45',
  },

  primaryButton: {
    backgroundColor: '#238B45',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#238B45',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#238B45',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default Cart;
