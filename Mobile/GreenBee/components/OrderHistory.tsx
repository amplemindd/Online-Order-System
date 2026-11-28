
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

interface Order {
  id: number;
  total_amount: number | string;
  status: string;
  payment_status: string;
  payment_method: string;
  currency: string;
  created_at: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  rider_assigned?: boolean | number;
}

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number | string;
  subtotal: number | string;
  product_size?: string | null;
  product_color?: string | null;
}

interface OrderDetails {
  order: Order;
  items: OrderItem[];
}

interface RiderTracking {
  id: number;
  name: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  location_updated_at: string | null;
}

interface Props {
  onBack: () => void;
}

const formatDate = (value: string) => {
  if (!value) return 'Date unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatStatus = (value?: string) =>
  (value || 'pending')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());

const OrderHistory: React.FC<Props> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<number | null>(null);
  const [rider, setRider] = useState<RiderTracking | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

const fetchRiderTracking = async (orderId: number, showLoader = false) => {
  try {
    if (showLoader) {
      setTrackingLoading(true);
    }

    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      setTrackingError('Please log in again to track your order.');
      return;
    }

    const response = await fetch(
      `${API_URL}/orders/my-orders/${orderId}/tracking`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      setTrackingError(data.message || 'Unable to fetch rider details.');
      return;
    }

    setRider(data.rider);
    setTrackingError('');
  } catch (error) {
    console.error('Rider tracking error:', error);
    setTrackingError('Unable to connect to the server. Please try again.');
  } finally {
    if (showLoader) {
      setTrackingLoading(false);
    }
  }
};

useEffect(() => {
  if (trackingOrderId === null) {
    return;
  }

  fetchRiderTracking(trackingOrderId, true);

  const interval = setInterval(() => {
    fetchRiderTracking(trackingOrderId);
  }, 5000);

  return () => clearInterval(interval);
}, [trackingOrderId]);

const startTracking = (orderId: number) => {
  setRider(null);
  setTrackingError('');
  setTrackingOrderId(orderId);
};

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Login Required', 'Please login to view your orders.');
        return;
      }

      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load orders.');
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to load your orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openOrderDetails = async (orderId: number) => {
    try {
      setDetailsLoading(true);
      setSelectedOrder(null);

      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Login Required', 'Please login again.');
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/my-orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load order details.');
      }

      setSelectedOrder({
        order: data.order,
        items: data.items || [],
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to load order details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const renderStatus = (status: string, payment = false) => {
    const value = (status || 'pending').toLowerCase();
    const isSuccess = payment
      ? value === 'paid'
      : value === 'delivered';

    const isCancelled = value === 'cancelled';
    const isPending = value === 'pending';

    return (
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: isSuccess
              ? '#E4F7EC'
              : isCancelled
              ? '#FCE8E8'
              : isPending
              ? '#FFF3D6'
              : '#E8F1FF',
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: isSuccess
                ? '#16834A'
                : isCancelled
                ? '#C62828'
                : isPending
                ? '#A66A00'
                : '#245BB5',
            },
          ]}
        >
          {formatStatus(status)}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16845C" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

if (trackingOrderId !== null) {
  const latitude = Number(rider?.latitude);
  const longitude = Number(rider?.longitude);
  const hasLocation =
    rider?.latitude !== null &&
    rider?.longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView(
          [${hasLocation ? latitude : 21.1458}, ${hasLocation ? longitude : 79.0882}],
          16
        );
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        ${hasLocation ? `
          L.marker([${latitude}, ${longitude}])
            .addTo(map)
            .bindPopup('Your delivery rider')
            .openPopup();
        ` : ''}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setTrackingOrderId(null)}
      >
        <Text style={styles.backText}>‹ Back to Order Details</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Track Your Order</Text>
      <Text style={styles.subtitle}>Order #{trackingOrderId}</Text>

      {trackingLoading && !rider ? (
        <ActivityIndicator size="large" color="#16845C" />
      ) : trackingError && !rider ? (
        <Text style={styles.value}>{trackingError}</Text>
      ) : rider ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Delivery Rider</Text>
          <Text style={styles.value}>Name: {rider.name}</Text>
          <Text style={styles.value}>Mobile: {rider.phone}</Text>
          <Text style={styles.label}>
            {hasLocation ? 'Live location available' : 'Waiting for rider GPS location...'}
          </Text>
        </View>
      ) : null}

      {rider && hasLocation && (
        <View style={{ height: 400, marginTop: 15, overflow: 'hidden', borderRadius: 12 }}>
          <WebView
            source={{ html: mapHtml }}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
          />
        </View>
      )}

      {trackingError !== '' && rider && (
        <Text style={styles.label}>{trackingError}</Text>
      )}
    </View>
  );
}

  if (selectedOrder) {
    const { order, items } = selectedOrder;

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedOrder(null)}
        >
          <Text style={styles.backText}>‹  Back to Orders</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Order Details</Text>
        <Text style={styles.orderNumber}>Order #{order.id}</Text>
        <Text style={styles.dateText}>
          {formatDate(order.created_at)}
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Delivery Status</Text>
            {renderStatus(order.status)}
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Payment Status</Text>
            {renderStatus(order.payment_status, true)}
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>
              {formatStatus(order.payment_method)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>

          {items.map((item, index) => (
            <View key={`${item.product_id}-${index}`} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.productName}>
                  {item.product_name}
                </Text>

                <Text style={styles.itemMeta}>
                  Qty: {item.quantity}
                  {item.product_size ? `  •  ${item.product_size}` : ''}
                  {item.product_color ? `  •  ${item.product_color}` : ''}
                </Text>
              </View>

              <Text style={styles.itemPrice}>
                ₹{Number(item.subtotal).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.value}>
            {order.address || ''}
            {order.apartment ? `, ${order.apartment}` : ''}
            {'\n'}
            {order.city}, {order.state} - {order.postal_code}
            {'\n'}
            {order.country || 'India'}
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Order Total</Text>
          <Text style={styles.totalAmount}>
            ₹{Number(order.total_amount).toFixed(2)}
          </Text>
        </View>

        {Number(order.rider_assigned) === 1 && (
          <TouchableOpacity
            style={styles.trackOrderButton}
            activeOpacity={0.8}
             onPress={() => startTracking(order.id)}
         >
            <Text style={styles.trackOrderButtonText}>
              Track Order
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>‹  Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>My Orders</Text>
      <Text style={styles.subtitle}>View and track your purchases</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Your placed orders will appear here.
          </Text>
          <TouchableOpacity style={styles.shopButton} onPress={onBack}>
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(true)}
              colors={['#16845C']}
            />
          }
        >
          {orders.map(order => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              activeOpacity={0.8}
              onPress={() => openOrderDetails(order.id)}
            >
              <View style={styles.orderTop}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.dateText}>
                    {formatDate(order.created_at)}
                  </Text>
                </View>

                {renderStatus(order.status)}
              </View>

              <View style={styles.orderBottom}>
                <View>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.orderAmount}>
                    ₹{Number(order.total_amount).toFixed(2)}
                  </Text>
                </View>

                <Text style={styles.detailsLink}>View Details  ›</Text>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentText}>
                  Payment: {formatStatus(order.payment_status)}
                </Text>
                <Text style={styles.paymentText}>
                  {formatStatus(order.payment_method)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {detailsLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#16845C" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F8',
    padding: 18,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    color: '#666666',
    marginTop: 10,
    fontSize: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 8,
  },
  backText: {
    color: '#16845C',
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    fontSize: 25,
    fontWeight: '700',
    color: '#202820',
    marginTop: 5,
  },
  subtitle: {
    color: '#777777',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 18,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9EFEB',
    elevation: 2,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    color: '#222222',
    fontSize: 16,
    fontWeight: '700',
  },
  dateText: {
    color: '#888888',
    fontSize: 12,
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    marginTop: 15,
    paddingTop: 13,
  },
  totalLabel: {
    fontSize: 12,
    color: '#888888',
  },
  orderAmount: {
    fontSize: 19,
    color: '#16845C',
    fontWeight: '700',
    marginTop: 3,
  },
  detailsLink: {
    color: '#16845C',
    fontWeight: '600',
    fontSize: 13,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  paymentText: {
    color: '#777777',
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 70,
  },
  emptyIcon: {
    fontSize: 55,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  emptyText: {
    color: '#888888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#16845C',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 7,
    marginTop: 20,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trackOrderButton: {
    backgroundColor: '#16845C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  trackOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E9EFEB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  label: {
    color: '#777777',
    fontSize: 13,
  },
  value: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 22,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16845C',
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  itemMeta: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  totalCard: {
    backgroundColor: '#EAF6EF',
    padding: 18,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    color: '#16845C',
    fontSize: 21,
    fontWeight: '700',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderHistory;
