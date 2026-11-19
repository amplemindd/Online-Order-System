import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useWishlist } from '../context/WishlistContext';

type WishlistProps = {
  onContinueShopping: () => void;
};

const Wishlist: React.FC<WishlistProps> = ({ onContinueShopping }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>MY WISHLIST</Text>

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Your wishlist is empty!
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onContinueShopping}
          >
            <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {wishlistItems.map(item => (
            <View style={styles.wishlistCard} key={item.id}>
              <Image
                source={item.image}
                style={styles.productImage}
                resizeMode="cover"
              />

              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>

                <Text style={styles.price}>
                  ₹{item.price.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromWishlist(item.id)}
              >
                <Text style={styles.removeText}>♥</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onContinueShopping}
          >
            <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
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

  wishlistCard: {
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

  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#238B45',
    marginTop: 7,
  },

  removeButton: {
    padding: 10,
  },

  removeText: {
    color: '#E53935',
    fontSize: 24,
  },

  primaryButton: {
    backgroundColor: '#238B45',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default Wishlist;
