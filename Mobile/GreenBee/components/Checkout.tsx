import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { sendOrderConfirmation } from './services/EmailService';

interface CheckoutProps {
  onBackToCart: () => void;
  onContinueShopping: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  onBackToCart,
  onContinueShopping,
}) => {
  const { cartItems, cartTotal, cartCount } = useCart();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const gst = cartTotal * 0.05;
  const shippingCost = shipping === 'express' ? 100 : 0;
  const finalTotal = cartTotal + gst + shippingCost;

  // const handlePayNow = () => {
  //   if (cartItems.length === 0) {
  //     Alert.alert('Your cart is empty', 'Please add products before checkout.');
  //     return;
  //   }

  //   if (
  //     !email.trim() ||
  //     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
  //     !/^[0-9]{10}$/.test(phone) ||
  //     !firstName.trim() ||
  //     !lastName.trim() ||
  //     !address.trim() ||
  //     !city.trim() ||
  //     !state.trim() ||
  //     !/^[0-9]{6}$/.test(pincode)
  //   ) {
  //     Alert.alert(
  //       'Invalid Information',
  //       'Please enter a valid email, 10-digit phone number, complete delivery address and 6-digit PIN code.',
  //     );
  //     return;
  //   }

  //   Alert.alert(
  //     'Order Confirmed! 🎉',
  //     `Thank you, ${firstName}! Your order has been placed successfully.\n\nOrder Total: ${formatPrice(finalTotal)}`,
  //     [
  //       {
  //         text: 'Continue Shopping',
  //         onPress: onContinueShopping,
  //       },
  //     ],
  //   );
  // };

  const handlePayNow = async () => {
  if (cartItems.length === 0) {
    Alert.alert('Your cart is empty', 'Please add products before checkout.');
    return;
  }

  if (
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !/^[0-9]{10}$/.test(phone) ||
    !firstName.trim() ||
    !lastName.trim() ||
    !address.trim() ||
    !city.trim() ||
    !state.trim() ||
    !/^[0-9]{6}$/.test(pincode)
  ) {
    Alert.alert(
      'Invalid Information',
      'Please enter a valid email, 10-digit phone number, complete delivery address and 6-digit PIN code.',
    );
    return;
  }

  const orderId = `GB-${Date.now()}`;

  const orderItems = cartItems
    .map(
      item =>
        `${item.name}${item.size ? ` (${item.size})` : ''} x ${
          item.quantity
        } - ${formatPrice(item.price * item.quantity)}`,
    )
    .join('\n');

  const deliveryAddress = [
    address,
    apartment,
    city,
    state,
    pincode,
  ]
    .filter(Boolean)
    .join(', ');

  try {
    await sendOrderConfirmation({
      to_email: email.trim(),
      customer_name: `${firstName} ${lastName}`,
      order_id: orderId,
      order_items: orderItems,
      subtotal: formatPrice(cartTotal),
      gst: formatPrice(gst),
      shipping: formatPrice(shippingCost),
      total: formatPrice(finalTotal),
      delivery_address: deliveryAddress,
    });

    Alert.alert(
      'Order Confirmation Email Sent! 🎉',
      `Thank you, ${firstName}! Your order confirmation email has been sent to ${email}.\n\nOrder Total: ${formatPrice(finalTotal)}`,
      [
        {
          text: 'Continue Shopping',
          onPress: onContinueShopping,
        },
      ],
    );
  } catch (error) {
    Alert.alert(
      'Email Failed',
      'We could not send your order confirmation email. Please try again.',
    );
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBackToCart}>
        <Text style={styles.backText}>‹ Back to Cart</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Checkout</Text>
      <Text style={styles.subtitle}>
        Complete your details to place your order.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 10-digit phone number"
          value={phone}
          onChangeText={text => setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>

        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.nameField}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="House number and street"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Apartment / Landmark</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartment, suite, etc. (optional)"
          value={apartment}
          onChangeText={setApartment}
        />

        <Text style={styles.label}>City *</Text>
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>State *</Text>
        <TextInput
          style={styles.input}
          placeholder="State"
          value={state}
          onChangeText={setState}
        />

        <Text style={styles.label}>PIN Code *</Text>
        <TextInput
          style={styles.input}
          placeholder="6-digit PIN code"
          value={pincode}
          onChangeText={text => setPincode(text.replace(/[^0-9]/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Method</Text>

        <TouchableOpacity
          style={[
            styles.shippingOption,
            shipping === 'standard' && styles.selectedOption,
          ]}
          onPress={() => setShipping('standard')}
        >
          <View style={styles.shippingText}>
            <Text style={styles.optionTitle}>Standard Delivery</Text>
            <Text style={styles.optionSubtitle}>Regular delivery</Text>
          </View>
          <Text style={styles.optionPrice}>FREE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.shippingOption,
            shipping === 'express' && styles.selectedOption,
          ]}
          onPress={() => setShipping('express')}
        >
          <View style={styles.shippingText}>
            <Text style={styles.optionTitle}>Express Delivery</Text>
            <Text style={styles.optionSubtitle}>Faster delivery</Text>
          </View>
          <Text style={styles.optionPrice}>₹100.00</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Order Summary ({cartCount} items)
        </Text>

        {cartItems.map((item, index) => (
          <View key={`${item.id}-${item.size ?? ''}-${index}`} style={styles.orderItem}>
            <View style={styles.orderItemDetails}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              {!!item.size && (
                <Text style={styles.orderItemQuantity}>Size: {item.size}</Text>
              )}
              <Text style={styles.orderItemQuantity}>
                Quantity: {item.quantity}
              </Text>
            </View>

            <Text style={styles.orderItemPrice}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
        </View>

        <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>GST (5%)</Text>
            <Text style={styles.totalValue}>{formatPrice(gst)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping</Text>
          <Text style={styles.totalValue}>
            {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>{formatPrice(finalTotal)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayNow}
        activeOpacity={0.8}
      >
        <Text style={styles.payButtonText}>
          PLACE ORDER · {formatPrice(finalTotal)}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        This is a demonstration checkout. No real payment will be processed.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 12,
  },
  backText: {
    fontSize: 15,
    color: '#287A43',
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#252525',
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252525',
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DCDAD3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#252525',
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
  },
  nameField: {
    flex: 1,
    minWidth: 0,
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DCDAD3',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#287A43',
    backgroundColor: '#F1F8F2',
  },
  shippingText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#252525',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#287A43',
    marginLeft: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEA',
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
  },
  totalValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E1DA',
    marginTop: 18,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252525',
  },
  grandTotalValue: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#287A43',
  },
  payButton: {
    minHeight: 54,
    borderRadius: 28,
    backgroundColor: '#287A43',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#888888',
    marginTop: 14,
    lineHeight: 17,
  },
});

export default Checkout;