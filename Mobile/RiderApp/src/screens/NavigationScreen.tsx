import React, { useEffect, useState } from 'react';
import { RiderOrder } from '../types/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/api';
import {
  startLocationTracking,
  stopLocationTracking,
} from '../services/locationService';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NavigationScreenProps {
  order: RiderOrder;
  onBack?: () => void;
  onArrived?: () => void;
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({
  order,
  onBack,
  onArrived,
}) => {
  const [navigationStage, setNavigationStage] = useState<'pickup' | 'delivery'>(
    'pickup',
  );

const [isUpdating, setIsUpdating] = useState(false);

useEffect(() => {
  let isActive = true;

  const beginTracking = async () => {
    try {
      const token = await AsyncStorage.getItem('riderToken');

      if (!token || !isActive) {
        return;
      }

      await startLocationTracking(token, message => {
        if (isActive) {
          console.warn('Location tracking:', message);
        }
      });
    } catch (error: any) {
      console.error('Unable to initialize GPS:', error.message);
    }
  };

  beginTracking();

  return () => {
    isActive = false;
    stopLocationTracking();
  };
}, [order.id]);


const handleConfirmPickup = async () => {
  try {
    setIsUpdating(true);

    const token = await AsyncStorage.getItem('riderToken');

    if (!token) {
      throw new Error('Please log in again.');
    }

    const response = await apiRequest(
      `/rider/orders/${order.id}/pickup`,
      {
        method: 'PUT',
      },
      token,
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to confirm pickup.');
    }

    setNavigationStage('delivery');
    Alert.alert('Pickup Confirmed', 'Order collected successfully.');

  } catch (error: any) {
    Alert.alert(
      'Pickup Failed',
      error.message || 'Unable to update order status.',
    );
  } finally {
    setIsUpdating(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Navigation</Text>
      </View>

      <View style={styles.navigationProgress}>
        <View style={styles.progressActive} />
        <View
          style={
            navigationStage === 'delivery'
              ? styles.progressActive
              : styles.progressInactive
          }
        />
        <Text style={styles.progressText}>
          {navigationStage === 'pickup'
            ? 'Going to pickup'
            : 'Going to customer'}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={styles.mapTitle}>Live Navigation</Text>
          <Text style={styles.mapSubtitle}>Your route will appear here</Text>

          <View style={styles.mapLocation}>
            <Text style={styles.locationEmoji}>📍</Text>
            <Text style={styles.mapLocationText}>
              {navigationStage === 'pickup'
                ? 'Green Fresh Store'
                : 'Customer Address'}
            </Text>
          </View>
        </View>
        <View style={styles.tripInfoCard}>
          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>DISTANCE</Text>
            <Text style={styles.tripInfoValue}>3.5 km</Text>
          </View>

          <View style={styles.tripDivider} />

          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>ESTIMATED TIME</Text>
            <Text style={styles.tripInfoValue}>12 mins</Text>
          </View>
        </View>
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.pickupIcon}>📍</Text>

            <View style={styles.locationDetails}>
              <Text style={styles.locationType}>PICKUP LOCATION</Text>
              <Text style={styles.locationName}>Store Pickup</Text>
              <Text style={styles.locationAddress}>
                Pickup address will be provided by the store.
              </Text>
            </View>
          </View>

          <View style={styles.locationFooter}>
            <Text style={styles.locationHint}>
              {navigationStage === 'pickup'
                ? 'Navigate to the store to collect the order.'
                : 'Order collected successfully.'}
            </Text>
          </View>
        </View>

        {/* Delivery Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.pickupIcon}>🏠</Text>

            <View style={styles.locationDetails}>
              <Text style={styles.deliveryType}>DELIVERY LOCATION</Text>
              <Text style={styles.locationName}>{order.customer_name}</Text>
<Text style={styles.locationAddress}>
  {order.address}
  {order.apartment ? `, ${order.apartment}` : ''}
</Text>
<Text style={styles.locationAddress}>
  {order.city}, {order.state} - {order.postal_code}
</Text>
<Text style={styles.locationAddress}>
  Phone: {order.customer_phone}
</Text>
            </View>
          </View>

          <View style={styles.locationFooter}>
            <Text style={styles.locationHint}>
              {navigationStage === 'pickup'
                ? 'Your next destination after pickup.'
                : 'Navigate to the customer to complete delivery.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => {
            const destination =
              navigationStage === 'pickup'
                ? 'Green Fresh Store, Dharampeth, Nagpur'
                : 'Customer Address, Civil Lines, Nagpur';

            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                destination,
              )}`,
            );
          }}
        >
          <Text style={styles.navigateButtonText}>↗ Start Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arrivedButton}
          onPress={() => {
            if (navigationStage === 'pickup') {
              Alert.alert(
                'Confirm Pickup',
                'Have you collected the order from Green Fresh Store?',
                [
                  { text: 'Not Yet', style: 'cancel' },
                  {
                    text: 'Yes, Collected',
                    onPress: handleConfirmPickup,
                  },
                ],
              );
            } else {
              onArrived?.();
            }
          }}
        >
          <Text style={styles.arrivedButtonText}>
            {navigationStage === 'pickup'
              ? "I've Arrived at Store"
              : "I've Arrived at Customer"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  header: {
    backgroundColor: '#00852B',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 30,
    marginRight: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    paddingHorizontal: 18,
  },
  progressActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00852B',
  },
  progressInactive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D5D5D5',
    marginLeft: 8,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00852B',
    marginLeft: 10,
  },
  content: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  paddingBottom: 15,
  },
  placeholder: {
    fontSize: 18,
    color: '#777777',
  },
  mapContainer: {
    height: 280,
    width: '100%',
    backgroundColor: '#E5EFE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  mapEmoji: {
    fontSize: 55,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#245C35',
    marginTop: 12,
  },
  mapSubtitle: {
    fontSize: 13,
    color: '#718574',
    marginTop: 5,
  },
  mapLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  locationEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  mapLocationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  tripInfoCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 15,
    elevation: 2,
  },
  tripInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  tripInfoLabel: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
  },
  tripInfoValue: {
    fontSize: 19,
    color: '#00852B',
    fontWeight: 'bold',
    marginTop: 6,
  },
  tripDivider: {
    width: 1,
    height: 35,
    backgroundColor: '#EEEEEE',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  locationDetails: {
    flex: 1,
  },
  locationType: {
    fontSize: 10,
    color: '#16834A',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  locationName: {
    fontSize: 16,
    color: '#222222',
    fontWeight: 'bold',
    marginTop: 5,
  },
  locationAddress: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },
  locationFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    marginTop: 14,
    paddingTop: 10,
  },
  locationHint: {
    fontSize: 12,
    color: '#777777',
  },
  deliveryType: {
    fontSize: 10,
    color: '#E68A00',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bottomContainer: {
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  arrivedButton: {
    backgroundColor: '#00852B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  navigateButton: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00852B',
  },
  navigateButtonText: {
    color: '#00852B',
    fontSize: 15,
    fontWeight: 'bold',
  },
  arrivedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
