
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

interface SavedAddress {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: number;
}

interface CheckoutProps {
  onBackToCart: () => void;
  onContinueShopping: () => void;
}

const API_URL = 'https://online-order-system-1.onrender.com/api';

const Checkout: React.FC<CheckoutProps> = ({
  onBackToCart,
  onContinueShopping,
}) => {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  // Contact and address form
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Saved address states
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Checkout states
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const gst = cartTotal * 0.05;
  const shippingCost = shipping === 'express' ? 100 : 0;
  const finalTotal = cartTotal + gst + shippingCost;

  const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
  };

  // Select an address
  const selectSavedAddress = (item: SavedAddress) => {
    const nameParts = item.full_name.trim().split(/\s+/);

    setSelectedAddressId(item.id);
    setEditingAddressId(null);
    setFirstName(nameParts[0] || '');
    setLastName(nameParts.slice(1).join(' '));
    setPhone(item.phone);
    setAddress(item.address);
    setApartment(item.apartment || '');
    setCity(item.city);
    setState(item.state);
    setPincode(item.postal_code);
  };

  // Fetch saved addresses
  const fetchSavedAddresses = async () => {
    try {
      setAddressLoading(true);

      const token = await getToken();

      if (!token) {
        setSavedAddresses([]);
        return;
      }

      const response = await fetch(`${API_URL}/addresses`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to fetch addresses.');
      }

      const addresses: SavedAddress[] = data.addresses || [];
      setSavedAddresses(addresses);

      const defaultAddress =
        addresses.find(item => Number(item.is_default) === 1) ||
        addresses[0];

      if (defaultAddress) {
        selectSavedAddress(defaultAddress);
      } else {
        setSelectedAddressId(null);
      }
    } catch (error) {
      console.log('Fetch saved addresses error:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  // Start editing an address
  const editAddress = (item: SavedAddress) => {
    const nameParts = item.full_name.trim().split(/\s+/);

    setEditingAddressId(item.id);
    setSelectedAddressId(item.id);
    setFirstName(nameParts[0] || '');
    setLastName(nameParts.slice(1).join(' '));
    setPhone(item.phone);
    setAddress(item.address);
    setApartment(item.apartment || '');
    setCity(item.city);
    setState(item.state);
    setPincode(item.postal_code);
  };

  // Save a new address or update an existing one
  const saveAddress = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !/^[0-9]{10}$/.test(phone) ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !/^[0-9]{6}$/.test(pincode)
    ) {
      Alert.alert(
        'Invalid Information',
        'Please enter your complete address, valid 10-digit phone number and 6-digit PIN code.',
      );
      return;
    }

    try {
      setSavingAddress(true);

      const token = await getToken();

      if (!token) {
        Alert.alert('Login Required', 'Please login to save your address.');
        return;
      }

      const isEditing = editingAddressId !== null;

      const url = isEditing
        ? `${API_URL}/addresses/${editingAddressId}`
        : `${API_URL}/addresses`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: `${firstName.trim()} ${lastName.trim()}`,
          phone: phone.trim(),
          address: address.trim(),
          apartment: apartment.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: pincode.trim(),
          country: 'India',
          isDefault: savedAddresses.length === 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save address.');
      }

      setEditingAddressId(null);

      Alert.alert(
        'Success',
        isEditing
          ? 'Address updated successfully.'
          : 'Address saved successfully.',
      );

      await fetchSavedAddresses();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Unable to save address. Please try again.',
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // Set an address as default
  const setDefaultAddress = async (id: number) => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert('Login Required', 'Please login first.');
        return;
      }

      const response = await fetch(`${API_URL}/addresses/${id}/default`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to set default address.');
      }

      await fetchSavedAddresses();
      Alert.alert('Success', 'Default address updated.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to update default address.');
    }
  };

  // Delete an address
  const deleteAddress = (id: number) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();

              if (!token) {
                Alert.alert('Login Required', 'Please login first.');
                return;
              }

              const response = await fetch(`${API_URL}/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || 'Unable to delete address.');
              }

              if (editingAddressId === id) {
                setEditingAddressId(null);
              }

              await fetchSavedAddresses();

              Alert.alert('Success', 'Address deleted successfully.');
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'Unable to delete address.',
              );
            }
          },
        },
      ],
    );
  };

  // Place COD order
  const handlePayNow = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add products before checkout.');
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
        'Please enter valid contact and delivery details.',
      );
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        Alert.alert('Login Required', 'Please login before placing an order.');
        return;
      }

      const response = await fetch(`${API_URL}/orders/cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: {
            email: email.trim().toLowerCase(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            apartment: apartment.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: pincode.trim(),
            country: 'India',
          },
          items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            size: item.size || null,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Order Failed', data.message || 'Unable to place order.');
        return;
      }

      Alert.alert(
        'Order Placed Successfully!',
        `Order ID: ${data.orderId}\nTotal: ₹${Number(data.total).toFixed(2)}\nPayment: Cash on Delivery`,
        [
          {
            text: 'Continue Shopping',
            onPress: () => {
              clearCart();
              onContinueShopping();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('Connection Error', 'Unable to connect to the server.');
    } finally {
      setLoading(false);
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

      {/* Contact Information */}
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
          onChangeText={text =>
            setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))
          }
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>

        {addressLoading && (
          <Text style={styles.optionSubtitle}>Loading saved addresses...</Text>
        )}

        {!addressLoading && savedAddresses.length > 0 && (
          <View style={styles.savedAddressInfo}>
            <Text style={styles.savedAddressTitle}>
              Choose Delivery Address
            </Text>

            {savedAddresses.map(item => (
              <View
                key={item.id}
                style={[
                  styles.addressOption,
                  selectedAddressId === item.id &&
                    styles.addressOptionSelected,
                ]}
              >
                <TouchableOpacity
                  onPress={() => selectSavedAddress(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.addressOptionHeader}>
                    <Text style={styles.addressName}>{item.full_name}</Text>

                    {Number(item.is_default) === 1 && (
                      <Text style={styles.defaultBadge}>DEFAULT</Text>
                    )}
                  </View>

                  <Text style={styles.savedAddressSubtitle}>
                    {item.address}
                    {item.apartment ? `, ${item.apartment}` : ''}
                    {`, ${item.city}, ${item.state} - ${item.postal_code}`}
                  </Text>

                  <Text style={styles.savedAddressSubtitle}>
                    Phone: {item.phone}
                  </Text>

                  {selectedAddressId === item.id && (
                    <Text style={styles.selectedAddressText}>✓ Selected</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.addressActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => editAddress(item)}
                  >
                    <Text style={styles.editText}>EDIT</Text>
                  </TouchableOpacity>

                  {Number(item.is_default) !== 1 && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setDefaultAddress(item.id)}
                    >
                      <Text style={styles.defaultText}>SET DEFAULT</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteAddress(item.id)}
                  >
                    <Text style={styles.deleteText}>DELETE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {!addressLoading && savedAddresses.length === 0 && (
          <Text style={styles.optionSubtitle}>
            No saved addresses found. Enter your delivery details below.
          </Text>
        )}

        <Text style={styles.formHeading}>
          {editingAddressId !== null ? 'Edit Address' : 'Address Details'}
        </Text>

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
          onChangeText={text =>
            setPincode(text.replace(/[^0-9]/g, '').slice(0, 6))
          }
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.saveAddressButton}
          onPress={saveAddress}
          disabled={savingAddress}
          activeOpacity={0.8}
        >
          <Text style={styles.saveAddressButtonText}>
            {savingAddress
              ? 'SAVING...'
              : editingAddressId !== null
                ? 'UPDATE ADDRESS'
                : '+ SAVE THIS ADDRESS'}
          </Text>
        </TouchableOpacity>

        {editingAddressId !== null && (
          <TouchableOpacity
            style={styles.cancelEditButton}
            onPress={() => {
              setEditingAddressId(null);
              const selected = savedAddresses.find(
                item => item.id === selectedAddressId,
              );
              if (selected) {
                selectSavedAddress(selected);
              }
            }}
          >
            <Text style={styles.cancelEditText}>Cancel Editing</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Shipping Method */}
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

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Order Summary ({cartCount} items)
        </Text>

        {cartItems.map((item, index) => (
          <View
            key={`${item.id}-${item.size ?? ''}-${index}`}
            style={styles.orderItem}
          >
            <View style={styles.orderItemDetails}>
              <Text style={styles.orderItemName}>{item.name}</Text>

              {!!item.size && (
                <Text style={styles.orderItemQuantity}>
                  Size: {item.size}
                </Text>
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
          <Text style={styles.grandTotalValue}>
            {formatPrice(finalTotal)}
          </Text>
        </View>
      </View>

      {/* Place Order */}
      <TouchableOpacity
        style={[styles.payButton, loading && styles.disabledButton]}
        onPress={handlePayNow}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.payButtonText}>
          {loading
            ? 'PLACING ORDER...'
            : `PLACE ORDER · ${formatPrice(finalTotal)}`}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        Cash on Delivery is currently available. No online payment will be
        processed through this checkout.
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
  formHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#252525',
    marginTop: 12,
    marginBottom: 14,
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
  savedAddressInfo: {
    marginBottom: 18,
  },
  savedAddressTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#252525',
    marginBottom: 4,
  },
  savedAddressSubtitle: {
    fontSize: 12,
    color: '#777777',
    marginTop: 5,
    lineHeight: 18,
  },
  addressOption: {
    borderWidth: 1,
    borderColor: '#DCDAD3',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  addressOptionSelected: {
    borderColor: '#287A43',
    backgroundColor: '#F1F8F2',
  },
  addressOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#252525',
    flex: 1,
  },
  defaultBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#287A43',
    marginLeft: 8,
  },
  selectedAddressText: {
    fontSize: 12,
    color: '#287A43',
    fontWeight: 'bold',
    marginTop: 8,
  },
  addressActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EAEAE5',
    marginTop: 12,
    paddingTop: 8,
    gap: 16,
  },
  actionButton: {
    paddingVertical: 5,
  },
  editText: {
    color: '#287A43',
    fontSize: 11,
    fontWeight: 'bold',
  },
  defaultText: {
    color: '#555555',
    fontSize: 11,
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#C0392B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  saveAddressButton: {
    borderWidth: 1,
    borderColor: '#287A43',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 2,
  },
  saveAddressButtonText: {
    color: '#287A43',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cancelEditButton: {
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
  },
  cancelEditText: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '600',
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
  disabledButton: {
    opacity: 0.6,
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
