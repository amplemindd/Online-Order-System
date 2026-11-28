import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useNavigation } from '@react-navigation/native';
import NewOrderScreen from './NewOrderScreen';
import OrderDetailsScreen from './OrderDetailsScreen';
import NavigationScreen from './NavigationScreen';
import DeliveryConfirmationScreen from './DeliveryConfirmationScreen';
import EarningsScreen from './EarningsScreen';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/api';
import { RiderOrder } from '../types/order';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedOrder, setSelectedOrder] = useState<RiderOrder | null>(null);
  const [availableOrders, setAvailableOrders] = useState<RiderOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] =
    useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
const [riderName, setRiderName] = useState('Rider');
const [totalOrders, setTotalOrders] = useState(0);
const [totalEarnings, setTotalEarnings] = useState(0);

const fetchAvailableOrders = async () => {
  try {
    setIsLoadingOrders(true);
    setOrderError('');

    const token = await AsyncStorage.getItem('riderToken');

    if (!token) {
      throw new Error('Please log in again.');
    }

    const response = await apiRequest(
      '/rider/orders',
      {},
      token,
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to fetch orders.');
    }

    setAvailableOrders(response.orders || []);
  } catch (error: any) {
    setOrderError(error.message || 'Unable to connect to server.');
  } finally {
    setIsLoadingOrders(false);
  }
};

const fetchDashboardDetails = async () => {
  try {
    const token = await AsyncStorage.getItem('riderToken');
    const riderData = await AsyncStorage.getItem('riderUser');

    if (!token) {
      throw new Error('Please log in again.');
    }

    // Get the logged-in rider's name.
    if (riderData) {
      const rider = JSON.parse(riderData);
      setRiderName(rider.first_name || 'Rider');
    }

    // Fetch all-time delivery and earning statistics.
    const response = await apiRequest(
      '/rider/dashboard',
      {},
      token,
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to fetch dashboard details.');
    }

    setTotalOrders(Number(response.summary?.totalOrders || 0));
    setTotalEarnings(Number(response.summary?.totalEarnings || 0));
  } catch (error: any) {
    console.warn(
      'Unable to fetch rider dashboard details:',
      error.message,
    );
  }
};

useEffect(() => {
  fetchAvailableOrders();
  fetchDashboardDetails();
}, []);



  if (showNewOrder && selectedOrder) {
  return (
    <NewOrderScreen
      order={selectedOrder}
      onAccept={() => {
        setShowNewOrder(false);
        setShowOrderDetails(true);
        fetchAvailableOrders();
      }}
      onReject={() => setShowNewOrder(false)}
    />
  );
}
 if (showOrderDetails && selectedOrder) {
  return (
    <OrderDetailsScreen
      order={selectedOrder}
      onBack={() => setShowOrderDetails(false)}
      onNavigate={() => {
        setShowOrderDetails(false);
        setShowNavigation(true);
      }}
    />
  );
}


  if (showNavigation) {
    return (
      <NavigationScreen
        order={selectedOrder!}
        onBack={() => {
          setShowNavigation(false);
          setShowOrderDetails(true);
        }}
        onArrived={() => {
          setShowNavigation(false);
          setShowDeliveryConfirmation(true);
        }}
      />
    );
  }

  if (showDeliveryConfirmation) {
    return (
      <DeliveryConfirmationScreen
        order={selectedOrder!}
        onBack={() => {
          setShowDeliveryConfirmation(false);
          setShowNavigation(true);
        }}
        onConfirm={() => {
          setShowDeliveryConfirmation(false);
          setSelectedOrder(null);
          fetchAvailableOrders();
        }}
      />
    );
  }

  if (showEarnings) {
    return <EarningsScreen onBack={() => setShowEarnings(false)} />;
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Lucide name="settings" size={25} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              {/* <Lucide name="bell" size={23} color="#FFFFFF" /> */}
              <TouchableOpacity onPress={() => setShowNewOrder(true)}>
                <Lucide name="bell" size={23} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Lucide name="user-round" size={23} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.welcome}>Hello, {riderName} 👋</Text>
          <Text style={styles.subtitle}>Ready to deliver?</Text>

          <Text style={styles.deliveryImage}>🛵</Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Lucide name="package" size={25} color="#00852B" />
            <Text style={styles.statValue}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Lucide name="wallet" size={25} color="#00852B" />
            <Text style={styles.statValue}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>

          <View style={styles.statCard}>
            <Lucide name="star" size={25} color="#00852B" />
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Online Toggle */}
        <View style={styles.onlineCard}>
          <View style={styles.onlineLeft}>
            <View style={styles.onlineIcon}>
              <Lucide
                name="wifi"
                size={24}
                color={isOnline ? '#00852B' : '#888888'}
              />
            </View>

            <View>
              <Text style={styles.onlineTitle}>
                {isOnline ? "You're Online" : "You're Offline"}
              </Text>

              <Text style={styles.onlineSubtitle}>
                {isOnline
                  ? 'Ready to receive orders'
                  : 'Turn on to receive orders'}
              </Text>
            </View>
          </View>

          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#999999', true: '#A5E6B5' }}
            thumbColor="#FFFFFF"
          />
        </View>

{/* Recent Orders */}
<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Available Orders</Text>

  <TouchableOpacity onPress={fetchAvailableOrders}>
    <Text style={styles.viewAll}>Refresh ↻</Text>
  </TouchableOpacity>
</View>

{isLoadingOrders ? (
  <ActivityIndicator
    size="large"
    color="#00852B"
    style={{ marginVertical: 25 }}
  />
) : orderError ? (
  <Text style={{ textAlign: 'center', color: 'red', margin: 20 }}>
    {orderError}
  </Text>
) : availableOrders.length === 0 ? (
  <Text style={{ textAlign: 'center', color: '#777', margin: 20 }}>
    No available orders right now.
  </Text>
) : (
  availableOrders.map(order => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.productImage}>
        <Lucide name="shopping-basket" size={26} color="#00852B" />
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>Order #{order.id}</Text>

        <Text style={styles.orderPrice}>
          ₹{Number(order.total_amount).toFixed(2)}
        </Text>

        <Text style={styles.distance}>
          {order.city || 'Address unavailable'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => {
          setSelectedOrder(order);
          setShowNewOrder(true);
        }}
      >
        <Text style={styles.viewButtonText}>View</Text>
        <Lucide name="chevron-right" size={16} color="#00852B" />
      </TouchableOpacity>
    </View>
  ))
)}

              </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Lucide name="house" size={23} color="#00852B" />
          <Text style={styles.activeNavText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setShowEarnings(true)}
        >
          <Lucide name="wallet" size={23} color="#888888" />
          <Text style={styles.navText}>Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Lucide name="user-round" size={23} color="#888888" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00852B',
  },

  scrollView: {
    backgroundColor: '#F5F7F5',
  },

  header: {
    backgroundColor: '#00852B',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 45,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },

  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  welcome: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#E5F5E8',
    fontSize: 15,
    marginTop: 5,
  },

  deliveryImage: {
    fontSize: 65,
    textAlign: 'right',
    marginTop: -15,
    marginBottom: -10,
  },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: -28,
    gap: 8,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: 'center',
    elevation: 3,
  },

  onlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  onlineIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statIcon: {
    color: '#00852B',
    fontSize: 17,
  },

  statValue: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
    marginVertical: 5,
  },

  statLabel: {
    fontSize: 10,
    color: '#666666',
  },

  onlineCard: {
    backgroundColor: '#00852B',
    margin: 15,
    padding: 17,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  onlineTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },

  onlineSubtitle: {
    color: '#E5F5E8',
    fontSize: 12,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
  },

  viewAll: {
    color: '#00852B',
    fontWeight: '600',
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 13,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  productImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  orderInfo: {
    flex: 1,
  },

  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
  },

  orderPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },

  distance: {
    color: '#666666',
    fontSize: 12,
    marginTop: 3,
  },

  viewButton: {
    backgroundColor: '#00852B',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  bottomNav: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  navItem: {
    alignItems: 'center',
  },

  activeNavIcon: {
    fontSize: 24,
    color: '#00852B',
  },

  navIcon: {
    fontSize: 22,
    color: '#555555',
  },

  activeNavText: {
    fontSize: 12,
    color: '#00852B',
    fontWeight: 'bold',
  },

  navText: {
    fontSize: 12,
    color: '#555555',
  },
});

export default DashboardScreen;
